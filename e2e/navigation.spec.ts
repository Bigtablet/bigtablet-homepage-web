import { expect, test } from "@playwright/test";

test.describe("header navigation", () => {
	test("navigates to recruit page", async ({ page }) => {
		await page.goto("/main");
		await page.click('a[href="/recruit"]');
		await expect(page).toHaveURL(/\/recruit/);
	});

	test("navigates to blog page", async ({ page }) => {
		await page.goto("/main");
		await page.click('a[href="/blog"]');
		await expect(page).toHaveURL(/\/blog/);
	});

	test("navigates to news page", async ({ page }) => {
		await page.goto("/main");
		await page.click('a[href="/news"]');
		await expect(page).toHaveURL(/\/news/);
	});

	test("navigates to about page", async ({ page }) => {
		await page.goto("/main");
		await page.click('a[href="/about"]');
		await expect(page).toHaveURL(/\/about/);
	});
});
