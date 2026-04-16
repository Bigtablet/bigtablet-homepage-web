import { expect, test } from "@playwright/test";

test.describe("blog page", () => {
	test("blog page responds without server error", async ({ page }) => {
		const response = await page.goto("/blog");
		// API 미가용 시에도 서버 자체는 응답해야 함
		expect(response).not.toBeNull();
		expect(response?.status()).toBeLessThan(500);
	});
});

test.describe("news page", () => {
	test("news page responds without server error", async ({ page }) => {
		const response = await page.goto("/news");
		expect(response).not.toBeNull();
		expect(response?.status()).toBeLessThan(500);
	});
});
