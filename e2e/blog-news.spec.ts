import { expect, test } from "@playwright/test";
import { mockApiRoutes } from "./fixtures/mock-api";

test.describe("blog page", () => {
	test.beforeEach(async ({ page }) => {
		await mockApiRoutes(page);
	});

	test("blog list page loads", async ({ page }) => {
		await page.goto("/blog");
		await expect(page.locator("main")).toBeVisible({ timeout: 15_000 });
	});
});

test.describe("news page", () => {
	test.beforeEach(async ({ page }) => {
		await mockApiRoutes(page);
	});

	test("news list page loads", async ({ page }) => {
		await page.goto("/news");
		await expect(page.locator("main")).toBeVisible({ timeout: 15_000 });
	});
});
