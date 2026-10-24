import { createHash } from "node:crypto";
import {
  createSupabasePersistence,
  validateSubmission,
} from "@/lib/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const MAX_BODY_BYTES = 8192;
const attempts = new Map<string, { count: number; expires: number }>();
let nextCleanup = Date.now() + WINDOW_MS;

function response(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function rateLimited(request: Request) {
  const now = Date.now();
  // Hash and retain only a short-lived bucket identifier, never the raw address.
  // The deployment proxy must overwrite these headers; see docs/launch.md.
  const address =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const key = createHash("sha256").update(address).digest("hex");
  if (now >= nextCleanup || attempts.size >= 10_000) {
    for (const [entryKey, entry] of attempts)
      if (entry.expires <= now) attempts.delete(entryKey);
    nextCleanup = now + WINDOW_MS;
  }
  if (attempts.size >= 10_000 && !attempts.has(key)) return true;
  const existing = attempts.get(key);
  if (!existing || existing.expires <= now) {
    attempts.set(key, { count: 1, expires: now + WINDOW_MS });
    return false;
  }
  existing.count += 1;
  return existing.count > MAX_ATTEMPTS;
}

async function readSmallJson(request: Request): Promise<unknown> {
  if (!request.body) throw new Error("empty");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("large");
    }
    chunks.push(chunk.value);
  }
  const buffer = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(buffer));
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const requestHost =
        request.headers.get("host") || new URL(request.url).host;
      if (new URL(origin).host !== requestHost)
        return response(
          {
            status: "error",
            message: "Please submit this form from the website.",
          },
          403,
        );
    } catch {
      return response(
        {
          status: "error",
          message: "Please submit this form from the website.",
        },
        403,
      );
    }
  }
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return response(
      { status: "error", message: "This endpoint accepts JSON only." },
      415,
    );
  }
  if (rateLimited(request)) {
    return Response.json(
      {
        status: "error",
        message: "Too many attempts. Please wait 15 minutes and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": "900", "Cache-Control": "no-store" },
      },
    );
  }
  let body: unknown;
  try {
    body = await readSmallJson(request);
  } catch (error) {
    const tooLarge = error instanceof Error && error.message === "large";
    return response(
      {
        status: "error",
        message: tooLarge
          ? "The request is too large."
          : "Please check the form and try again.",
      },
      tooLarge ? 413 : 400,
    );
  }
  if (body && typeof body === "object" && "website" in body && body.website) {
    return response(
      {
        status: "error",
        message: "We could not send this request. Please try again.",
      },
      400,
    );
  }
  const validation = validateSubmission(body);
  if (!validation.valid) {
    return response(
      {
        status: "error",
        message: validation.message || "Please check the highlighted fields.",
        errors: validation.errors,
      },
      400,
    );
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return response({
      status: "demo",
      message:
        "Demo only. No request was sent or saved. Pilot request storage has not been configured.",
    });
  }
  try {
    await createSupabasePersistence(url, key).save(validation.data);
    return response({
      status: "saved",
      message:
        "Your request has been received. This is not a booking or payment. We’ll contact you with pilot details when they are ready.",
    });
  } catch {
    return response(
      {
        status: "error",
        message:
          "We could not save your request. Please try again. No booking or payment has been made.",
      },
      503,
    );
  }
}
