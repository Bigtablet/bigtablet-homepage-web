import { expect, test } from "@playwright/test";
import { mockApiRoutes } from "./fixtures/mock-api";

test.describe("recruit pages", () => {
	test.beforeEach(async ({ page }) => {
		await mockApiRoutes(page);
	});

	test("recruit list page loads", async ({ page }) => {
		await page.goto("/recruit");
		await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });
	});

	test("recruit list renders job cards", async ({ page }) => {
		await page.goto("/recruit");
		const cards = page.locator("main a[href*='/recruit/']");
		await expect(cards.first()).toBeVisible({ timeout: 10_000 });
	});
});
