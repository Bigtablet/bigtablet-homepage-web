import { expect, test } from "@playwright/test";

test.describe("recruit pages", () => {
	test("recruit list page loads", async ({ page }) => {
		await page.goto("/recruit");
		await expect(page.locator("main")).toBeVisible();
	});
});
