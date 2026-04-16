import { expect, test } from "@playwright/test";
import { mockApiRoutes } from "./fixtures/mock-api";

test.describe("recruit pages", () => {
	test.beforeEach(async ({ page }) => {
		await mockApiRoutes(page);
	});

	test("recruit list page loads", async ({ page }) => {
		await page.goto("/recruit");
		await expect(page.locator("main")).toBeVisible({ timeout: 15_000 });
	});
});
