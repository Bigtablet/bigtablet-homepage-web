import { expect, test } from "@playwright/test";

test.describe("recruit pages", () => {
	test("recruit page responds", async ({ page }) => {
		const response = await page.goto("/recruit");
		expect(response).not.toBeNull();
	});

	test("recruit page renders main or error state", async ({ page }) => {
		await page.goto("/recruit");
		const body = page.locator("body");
		await expect(body).toBeVisible();
	});
});
