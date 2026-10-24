import { expect, test, type Page } from "@playwright/test";

async function fillRequest(page: Page) {
  // Synthetic data only. Nothing here identifies a real participant.
  await page.getByLabel("First name").fill("Demo");
  await page.getByLabel("Email address").fill("demo@example.com");
  await page
    .getByLabel("What would you like to practice?")
    .fill("Read two pages after dinner");
  await page.getByRole("radio", { name: "Unsure", exact: true }).check();
  await page.getByRole("checkbox").check();
}
const requestSubmit = (page: Page) =>
  page
    .locator("form.request-form")
    .getByRole("button", { name: /Try the demo form|Request pilot details/ });

// Every test gets an isolated browser context, including browser storage.
test("four pages fit mobile, tablet, and desktop with working skip targets", async ({
  page,
}) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/", "/sample", "/request", "/privacy"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("main#main")).toHaveCount(1);
      const dimensions = await page.evaluate(() => ({
        width: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.documentWidth,
        `${path} overflows at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.width);
    }
  }
  expect(runtimeErrors).toEqual([]);
});

test("homepage curriculum and FAQs work with a keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  const selectedTab = page.getByRole("tab", { selected: true });
  await expect(selectedTab).toContainText("DAY 1");
  await selectedTab.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("tab", { selected: true })).toContainText(
    "DAY 2",
  );
  await expect(page.getByRole("tab", { selected: true })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Give your action a place to begin.",
  );
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { selected: true })).toContainText(
    "DAY 7",
  );
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { selected: true })).toContainText(
    "DAY 0",
  );
  const faq = page
    .locator("details")
    .filter({
      has: page.locator("summary", { hasText: "What if I miss a day?" }),
    });
  await faq.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(faq).toHaveAttribute("open", "");
  await expect(faq.locator("p")).toContainText("no punishment");
  await page.keyboard.press("Enter");
  await expect(faq).not.toHaveAttribute("open", "");
});

test("mobile navigation closes on navigation and primary destinations work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Try a sample" })
    .click();
  await expect(page).toHaveURL(/\/sample$/);
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page
    .locator(".sample-next")
    .getByRole("link", { name: "Request pilot details" })
    .click();
  await expect(page).toHaveURL(/\/request$/);
  await page.getByRole("link", { name: "draft privacy notice" }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await page.getByRole("link", { name: "Do.Theory home" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("sample presets, generation, editing, copying, and printing work without storage", async ({
  page,
}) => {
  await page.goto("/sample");
  const sampleRequests: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") sampleRequests.push(request.url());
  });
  await page.getByRole("radio", { name: /Clear some space/ }).check();
  await expect(
    page.getByLabel("My standard version", { exact: true }),
  ).toHaveValue("clear a small table");
  await expect(
    page.getByLabel("My minimum version", { exact: true }),
  ).toHaveValue("put away three items");
  await page.getByRole("radio", { name: /Start that project/ }).check();
  await expect(
    page.getByLabel("My standard version", { exact: true }),
  ).toHaveValue("write for five minutes");
  await page.getByRole("radio", { name: /Read a little/ }).check();
  await page.getByRole("button", { name: "Make my action card" }).click();
  await expect(
    page.getByRole("region", { name: "Your generated action card" }),
  ).toBeVisible();
  await expect(page.locator(".builder-card-print")).toContainText(
    "read two pages",
  );
  await expect(page.locator(".builder-card-print")).toContainText(
    "read one paragraph",
  );
  await page.getByRole("button", { name: "Edit my plan" }).click();
  await expect(page.getByLabel("The action I want to practice")).toBeFocused();
  await page
    .getByLabel("My minimum version", { exact: true })
    .fill("read two sentences");
  await page.getByRole("button", { name: "Update my action card" }).click();
  await expect(page.locator(".builder-card-print")).toContainText(
    "read two sentences",
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.documentElement.dataset.copiedCard = text;
        },
      },
    }),
  );
  await page.getByRole("button", { name: "Copy my card" }).click();
  await expect(page.getByRole("button", { name: "Copied ✓" })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.dataset.copiedCard),
  ).toContain("read two sentences");
  await page.evaluate(() => {
    window.print = () => {
      document.documentElement.dataset.printed = "yes";
    };
  });
  await page.getByRole("button", { name: "Print card" }).click();
  expect(
    await page.evaluate(() => document.documentElement.dataset.printed),
  ).toBe("yes");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".builder-card-print")).toHaveCSS(
    "visibility",
    "visible",
  );
  await expect(page.locator(".builder-form")).not.toBeVisible();
  await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });
  await expect(page.locator(".builder-choice").first()).toHaveCSS(
    "transition-duration",
    "0s",
  );
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  expect(sampleRequests).toEqual([]);
  await page.reload();
  await expect(
    page.getByRole("region", { name: "Your generated action card" }),
  ).toHaveCount(0);
  await expect(
    page.getByLabel("My minimum version", { exact: true }),
  ).toHaveValue("read one paragraph");
});

test("sample validates custom plans and offers a selected copy fallback", async ({
  page,
}) => {
  await page.goto("/sample");
  await page.getByRole("radio", { name: /Something of my own/ }).check();
  await page.getByRole("button", { name: "Make my action card" }).click();
  await expect(page.locator(".builder-error")).toHaveCount(8);
  await expect(page.getByLabel("The action I want to practice")).toBeFocused();
  await page.getByRole("radio", { name: /Read a little/ }).check();
  await page.getByRole("button", { name: "Make my action card" }).click();
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Clipboard denied for test");
        },
      },
    }),
  );
  await page.getByRole("button", { name: "Copy my card" }).click();
  const fallback = page.getByLabel("Copy your action card", { exact: true });
  await expect(fallback).toHaveValue(/When I finish my evening tea/);
  await expect(fallback).toBeFocused();
  const selection = await fallback.evaluate((element: HTMLTextAreaElement) => ({
    start: element.selectionStart,
    end: element.selectionEnd,
    length: element.value.length,
  }));
  expect(selection.start).toBe(0);
  expect(selection.end).toBe(selection.length);
});

test("request form validates consent and unconfigured storage produces a clear demo result", async ({
  page,
}) => {
  await page.goto("/request");
  test.skip(
    !(await page.locator(".request-demo-notice").isVisible()),
    "Requires unconfigured storage; no real personal-data submission is attempted.",
  );
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await requestSubmit(page).click();
  await expect(page.locator(".request-field-error")).toHaveCount(5);
  await expect(page.getByLabel("First name")).toBeFocused();
  await fillRequest(page);
  const before = await page.evaluate(() => ({
    local: localStorage.length,
    session: sessionStorage.length,
  }));
  await requestSubmit(page).click();
  await expect(page.locator(".request-result-demo")).toContainText(
    "No request was sent or stored",
  );
  await expect(page.locator(".request-success")).toHaveCount(0);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual(before);
});

test("request failure retries safely and only a confirmed saved response shows success", async ({
  page,
}) => {
  await page.goto("/request");
  await fillRequest(page);
  const requestIds: string[] = [];
  let shouldSave = false;
  await page.route("**/api/request", async (route) => {
    requestIds.push(route.request().postDataJSON().requestId);
    await new Promise((resolve) => setTimeout(resolve, 350));
    await route.fulfill({
      status: shouldSave ? 200 : 503,
      contentType: "application/json",
      body: JSON.stringify({ status: shouldSave ? "saved" : "error" }),
    });
  });
  await requestSubmit(page).click();
  await expect(page.locator(".request-result-error")).toContainText(
    "couldn’t confirm",
  );
  await expect(requestSubmit(page)).toBeEnabled();
  await expect(page.locator(".request-success")).toHaveCount(0);
  shouldSave = true;
  await requestSubmit(page).click();
  await expect(
    page.getByRole("button", { name: "Checking your request…" }),
  ).toBeDisabled();
  await expect(page.locator(".request-success")).toContainText(
    "Your request has been received. This is not a booking or payment. We’ll contact you with pilot details when they are ready.",
  );
  await expect(page.locator(".request-success")).toBeFocused();
  expect(requestIds).toHaveLength(2);
  expect(requestIds[0]).toBe(requestIds[1]);
});

test("request server field errors stay accessible and network failures permit retry", async ({
  page,
}) => {
  await page.goto("/request");
  await fillRequest(page);
  await page.route("**/api/request", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        status: "error",
        errors: { email: "Please enter a valid email address." },
      }),
    }),
  );
  await requestSubmit(page).click();
  await expect(page.getByLabel("Email address")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.getByLabel("Email address")).toBeFocused();
  await expect(page.locator("#email-error")).toContainText("valid email");
  await page.getByLabel("Email address").fill("demo-retry@example.com");
  await expect(page.getByLabel("Email address")).toHaveAttribute(
    "aria-invalid",
    "false",
  );
  await page.unroute("**/api/request");
  await page.route("**/api/request", (route) => route.abort("failed"));
  await requestSubmit(page).click();
  await expect(page.locator(".request-result-error")).toContainText(
    "Check your connection and try again",
  );
  await expect(requestSubmit(page)).toBeEnabled();
  await expect(page.locator(".request-success")).toHaveCount(0);
});
