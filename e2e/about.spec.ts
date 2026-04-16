import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context, baseURL }) => {
	await context.addCookies([
		{ name: "NEXT_LOCALE", value: "ko", url: baseURL ?? "http://localhost:3000" },
	]);
});

test.describe("about page", () => {
	test("about page loads with company intro", async ({ page }) => {
		await page.goto("/about");
		await expect(page.locator("main")).toBeVisible();
	});

	test("renders team member section", async ({ page }) => {
		await page.goto("/about");
		await expect(page.locator("#team")).toBeVisible({ timeout: 10_000 });
	});

	test("renders member cards with links", async ({ page }) => {
		await page.goto("/about");
		const memberCard = page.locator("a[href*='/about/']").first();
		await expect(memberCard).toBeVisible({ timeout: 10_000 });
	});
});
