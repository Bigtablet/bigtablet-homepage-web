import { expect, test } from "@playwright/test";

test.describe("main page", () => {
	test("/ redirects to /main", async ({ page }) => {
		const response = await page.goto("/");
		expect(response?.url()).toContain("/main");
	});

	test("renders banner section", async ({ page }) => {
		await page.goto("/main");
		await expect(page.locator("main")).toBeVisible();
	});

	test("renders footer", async ({ page }) => {
		await page.goto("/main");
		await expect(page.locator("footer")).toBeVisible();
	});
});
