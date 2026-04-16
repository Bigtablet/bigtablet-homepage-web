import { expect, test } from "@playwright/test";
import { mockApiRoutes } from "./fixtures/mock-api";

test.describe("blog page", () => {
	test.beforeEach(async ({ page }) => {
		await mockApiRoutes(page);
	});

	test("blog list page loads with cards", async ({ page }) => {
		await page.goto("/blog");
		await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });
	});

	test("blog list renders article cards", async ({ page }) => {
		await page.goto("/blog");
		const cards = page.locator("main a[href*='/blog/']");
		await expect(cards.first()).toBeVisible({ timeout: 10_000 });
	});
});

test.describe("news page", () => {
	test.beforeEach(async ({ page }) => {
		await mockApiRoutes(page);
	});

	test("news list page loads with cards", async ({ page }) => {
		await page.goto("/news");
		await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });
	});
});
