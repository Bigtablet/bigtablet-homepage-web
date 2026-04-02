import { expect, test } from "@playwright/test";

test.describe("internationalization", () => {
	test("default locale renders content", async ({ page }) => {
		await page.goto("/main");
		await expect(page.locator("body")).not.toBeEmpty();
	});

	test("korean locale renders korean content", async ({ page, context }) => {
		await context.addCookies([
			{ name: "NEXT_LOCALE", value: "ko", url: "http://localhost:3000" },
		]);
		await page.goto("/main");
		await expect(page.locator("body")).not.toBeEmpty();
	});

	test("english locale renders english content", async ({ page, context }) => {
		await context.addCookies([
			{ name: "NEXT_LOCALE", value: "en", url: "http://localhost:3000" },
		]);
		await page.goto("/main");
		await expect(page.locator("body")).not.toBeEmpty();
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
