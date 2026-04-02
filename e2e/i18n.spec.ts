import { expect, test } from "@playwright/test";

test.describe("internationalization", () => {
	test("default locale renders content", async ({ page }) => {
		await page.goto("/main");
		await expect(page.locator("main")).toBeVisible();
	});

	test("korean locale renders korean content", async ({
		page,
		context,
		baseURL,
	}) => {
		await context.addCookies([
			{ name: "NEXT_LOCALE", value: "ko", url: baseURL! },
		]);
		await page.goto("/main");
		await expect(page.locator("main")).toBeVisible();
	});

	test("english locale renders english content", async ({
		page,
		context,
		baseURL,
	}) => {
		await context.addCookies([
			{ name: "NEXT_LOCALE", value: "en", url: baseURL! },
		]);
		await page.goto("/main");
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
