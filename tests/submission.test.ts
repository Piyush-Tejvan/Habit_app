import test from "node:test";
import assert from "node:assert/strict";
import {
  createSupabasePersistence,
  validateSubmission,
} from "../lib/submission";

const validInput = {
  firstName: " Asha ",
  email: " ASHA@example.com ",
  action: "Read two pages",
  sevenDays: "unsure",
  consent: true,
  requestId: "c2d7f8d2-2b4a-4b6c-8d1e-c7c2c2c0a001",
};

test("valid requests are normalized without requiring a yes answer", () => {
  const result = validateSubmission(validInput);
  assert.equal(result.valid, true);
  if (result.valid) {
    assert.equal(result.data.firstName, "Asha");
    assert.equal(result.data.email, "asha@example.com");
    assert.equal(result.data.sevenDays, "unsure");
  }
  assert.equal(
    validateSubmission({ ...validInput, sevenDays: "no" }).valid,
    true,
  );
});

test("consent, contact details, action and availability are validated server-side", () => {
  const result = validateSubmission({
    ...validInput,
    firstName: "",
    email: "invalid",
    action: "a",
    sevenDays: "maybe",
    consent: "true",
  });
  assert.equal(result.valid, false);
  if (!result.valid)
    assert.deepEqual(Object.keys(result.errors).sort(), [
      "action",
      "consent",
      "email",
      "firstName",
      "sevenDays",
    ]);
});

test("rejects wrong payload types, oversized strings and malformed request IDs", () => {
  for (const value of [
    null,
    [],
    "text",
    { ...validInput, firstName: "x".repeat(61) },
    { ...validInput, email: `${"a".repeat(255)}@example.com` },
    { ...validInput, action: "x".repeat(301) },
    { ...validInput, requestId: "not-a-uuid" },
  ]) {
    assert.equal(validateSubmission(value).valid, false);
  }
});

test("persistence sends a private idempotent insert with the expected fields", async () => {
  const result = validateSubmission(validInput);
  assert.equal(result.valid, true);
  if (!result.valid) return;
  let calls = 0;
  const fetcher: typeof fetch = async (url, init) => {
    calls += 1;
    assert.equal(
      String(url),
      "https://project.supabase.co/rest/v1/pilot_requests?on_conflict=request_id",
    );
    assert.equal(init?.method, "POST");
    const headers = new Headers(init?.headers);
    assert.equal(
      headers.get("Prefer"),
      "resolution=ignore-duplicates,return=minimal",
    );
    assert.equal(headers.get("Authorization"), "Bearer test-server-key");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.contact_consent, true);
    assert.equal(body.request_id, validInput.requestId);
    assert.equal(body.email, "asha@example.com");
    assert.equal(body.website, undefined);
    return new Response(null, { status: 201 });
  };
  await createSupabasePersistence(
    "https://project.supabase.co",
    "test-server-key",
    fetcher,
  ).save(result.data);
  assert.equal(calls, 1);
});

test("persistence rejects insecure URLs and propagates storage errors", async () => {
  assert.throws(() =>
    createSupabasePersistence("http://project.supabase.co", "key"),
  );
  const result = validateSubmission(validInput);
  if (!result.valid) throw new Error("Fixture invalid");
  const fetcher: typeof fetch = async () => new Response(null, { status: 403 });
  await assert.rejects(
    createSupabasePersistence(
      "https://project.supabase.co",
      "key",
      fetcher,
    ).save(result.data),
    /HTTP 403/,
  );
});

// Route-level tests mock storage; no real credentials or network requests are used.
import { POST } from "../app/api/request/route";

function apiRequest(
  body: unknown,
  options: { ip?: string; origin?: string; contentType?: string } = {},
) {
  return new Request("http://localhost:3000/api/request", {
    method: "POST",
    headers: {
      "Content-Type": options.contentType || "application/json",
      "x-forwarded-for": options.ip || "192.0.2.1",
      ...(options.origin ? { Origin: options.origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

test("API rejects invalid fields, cross-origin requests and honeypots", async () => {
  const invalid = await POST(apiRequest({ ...validInput, consent: false }));
  assert.equal(invalid.status, 400);
  assert.ok((await invalid.json()).errors.consent);
  assert.equal(
    (await POST(apiRequest(validInput, { origin: "https://other.example" })))
      .status,
    403,
  );
  assert.equal(
    (await POST(apiRequest({ ...validInput, website: "bot-link" }))).status,
    400,
  );
  assert.equal(
    (await POST(apiRequest(validInput, { contentType: "text/plain" }))).status,
    415,
  );
  assert.equal(
    (await POST(apiRequest({ ...validInput, action: "x".repeat(9000) })))
      .status,
    413,
  );
});

test("API distinguishes no-storage demo, confirmed persistence and retryable errors", async (context) => {
  const previousUrl = process.env.SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  context.after(() => {
    if (previousUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
  });
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const demo = await POST(apiRequest(validInput, { ip: "192.0.2.2" }));
  assert.equal(demo.status, 200);
  const demoBody = await demo.json();
  assert.equal(demoBody.status, "demo");
  assert.match(demoBody.message, /No request was sent or saved/);

  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "unit-test-key";
  const fetchMock = context.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 201 }),
  );
  const saved = await POST(apiRequest(validInput, { ip: "192.0.2.2" }));
  assert.equal((await saved.json()).status, "saved");
  assert.equal(fetchMock.mock.callCount(), 1);
  fetchMock.mock.mockImplementation(
    async () => new Response(null, { status: 503 }),
  );
  const failed = await POST(apiRequest(validInput, { ip: "192.0.2.2" }));
  assert.equal(failed.status, 503);
  assert.equal((await failed.json()).status, "error");
});

test("API rate-limits repeated requests with a retry hint", async () => {
  for (let i = 0; i < 8; i += 1) {
    const result = await POST(apiRequest({}, { ip: "192.0.2.3" }));
    assert.equal(result.status, 400);
  }
  const limited = await POST(apiRequest({}, { ip: "192.0.2.3" }));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "900");
});
