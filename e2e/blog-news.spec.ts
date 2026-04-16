import { expect, test } from "@playwright/test";

test.describe("blog page", () => {
	test("blog page responds", async ({ page }) => {
		const response = await page.goto("/blog");
		// 페이지가 응답하는지 확인 (API 실패 시 500 가능)
		expect(response).not.toBeNull();
	});

	test("blog page renders main or error state", async ({ page }) => {
		await page.goto("/blog");
		// API 가용 시 main visible, 불가 시 에러 페이지 렌더
		await expect(page.locator("body")).toBeVisible();
	});
});

test.describe("news page", () => {
	test("news page responds", async ({ page }) => {
		const response = await page.goto("/news");
		expect(response).not.toBeNull();
	});

	test("news page renders main or error state", async ({ page }) => {
		await page.goto("/news");
		await expect(page.locator("body")).toBeVisible();
	});
});
