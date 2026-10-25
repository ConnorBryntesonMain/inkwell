// e2e/accessibility.spec.js
//
// A lightweight automated check standing in for the manual accessibility
// audit from Lecture 7 — catches regressions between full manual reviews.

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("feed page has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
