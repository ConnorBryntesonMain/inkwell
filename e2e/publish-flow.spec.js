// e2e/publish-flow.spec.js
//
// Section 4.1's device-diversity principle, and Section 4.2's chosen
// headless-browser testing strategy, applied directly: the same user
// journey is run once per viewport, not just once at an arbitrary
// default size.
//
// Registration has no client-side UI anywhere in Inkwell (only Section
// 6.1a's LoginForm exists) -- every account so far has been created via
// curl. This test creates its account the same way, via a direct API
// call, then drives the real UI for the login/publish journey.

import { test, expect, devices } from "@playwright/test";

const viewports = [
  { name: "mobile", viewport: devices["iPhone 13"].viewport },
  { name: "desktop", viewport: { width: 1280, height: 800 } },
];

for (const viewport of viewports) {
  test.describe(`publish flow — ${viewport.name}`, () => {
    test.use({ viewport: viewport.viewport });

    test("a registered user can log in and publish a post", async ({ page, request }) => {
      // Verification fix: a fixed email/title collides across repeated
      // runs of this suite against the same dev database (no isolated
      // e2e database exists) -- register silently "fails" on a
      // duplicate but login still succeeds against the stale account,
      // and re-running the suite accumulates duplicate posts until
      // Playwright's strict-mode element matching breaks. A per-run
      // suffix sidesteps it.
      const runId = Date.now();
      const email = `e2e-${viewport.name}-${runId}@example.com`;
      const title = `Hello from ${viewport.name} (${runId})`;

      const registerRes = await request.post("http://localhost:4000/api/auth/register", {
        data: { email, displayName: "E2E Tester", password: "correcthorse" },
      });
      expect(registerRes.ok()).toBe(true);

      await page.goto("http://localhost:5173/login");

      // Section 4.1: real interaction, not simulated events — Playwright
      // drives an actual browser, so this exercises real focus order,
      // real touch/click handling, and real CSS layout.
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("correcthorse");
      await page.getByRole("button", { name: "Log In" }).click();

      await expect(page).toHaveURL("http://localhost:5173/");

      await page.getByRole("link", { name: "Write", exact: true }).click();
      await page.getByLabel("Title").fill(title);
      await page.getByLabel("Body").fill("Published end to end.");
      await page.getByRole("button", { name: "Publish" }).click();

      // Verification fix: a bare getByText() here passes even when
      // publishing fails server-side, because it matches the leftover
      // value still sitting in the unsubmitted <input> -- the page
      // never navigates away on failure, so the typed text is still
      // technically "visible" on screen. Asserting the actual
      // navigation first, then scoping the text check to a real post
      // heading, makes this test fail the way it's supposed to when
      // publishing is actually broken.
      await expect(page).toHaveURL("http://localhost:5173/");

      // Section 4.3 (UX testing): the actual, user-visible outcome —
      // the new post genuinely appears in the rendered feed.
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    });
  });
}
