import { expect, test } from "@playwright/test";

test.describe("recruit pages", () => {
	test("recruit page responds without server error", async ({ page }) => {
		const response = await page.goto("/recruit");
		expect(response).not.toBeNull();
		expect(response?.status()).toBeLessThan(500);
	});
});
