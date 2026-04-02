import { expect, test } from "@playwright/test";

test.describe("blog page", () => {
	test("blog list page loads", async ({ page }) => {
		await page.goto("/blog");
		await expect(page.locator("main")).toBeVisible();
	});
});

test.describe("news page", () => {
	test("news list page loads", async ({ page }) => {
		await page.goto("/news");
		await expect(page.locator("main")).toBeVisible();
	});
});
