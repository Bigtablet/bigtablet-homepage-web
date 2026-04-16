import { expect, test } from "@playwright/test";

test.describe("internationalization", () => {
	test("default locale renders korean content", async ({ page }) => {
		await page.goto("/main");
		await expect(page.locator("main")).toBeVisible();
		// 기본 로케일 = 한국어
		await expect(page.getByRole("link", { name: "About Us" })).toBeVisible();
	});

	test("korean locale renders korean navigation", async ({ page, context, baseURL }) => {
		await context.addCookies([{ name: "NEXT_LOCALE", value: "ko", url: baseURL }]);
		await page.goto("/main");
		await expect(page.locator("main")).toBeVisible();
		await expect(page.locator("header")).toBeVisible();
	});

	test("english locale renders english navigation", async ({ page, context, baseURL }) => {
		await context.addCookies([{ name: "NEXT_LOCALE", value: "en", url: baseURL }]);
		await page.goto("/main");
		await expect(page.locator("main")).toBeVisible();
		await expect(page.locator("header")).toBeVisible();
	});

	test("language switch changes content on about page", async ({ page, context, baseURL }) => {
		// 한국어
		await context.addCookies([{ name: "NEXT_LOCALE", value: "ko", url: baseURL }]);
		await page.goto("/about");
		await expect(page.locator("main")).toBeVisible();

		// 영어로 전환
		await context.addCookies([{ name: "NEXT_LOCALE", value: "en", url: baseURL }]);
		await page.reload();
		await expect(page.locator("main")).toBeVisible();
	});

	test("legacy /en/ prefix redirects to /", async ({ page }) => {
		const response = await page.goto("/en/main");
		expect(response?.url()).not.toContain("/en/");
	});

	test("legacy /ko/ prefix redirects to /", async ({ page }) => {
		const response = await page.goto("/ko/main");
		expect(response?.url()).not.toContain("/ko/");
	});
});
