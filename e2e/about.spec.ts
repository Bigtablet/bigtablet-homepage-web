import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context, baseURL }) => {
	await context.addCookies([{ name: "NEXT_LOCALE", value: "ko", url: baseURL }]);
});

test.describe("about page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/about");
	});

	test("about page loads with company intro", async ({ page }) => {
		await expect(page.locator("main")).toBeVisible();
	});

	test("renders team member section", async ({ page }) => {
		await expect(page.locator("#team")).toBeVisible({ timeout: 10_000 });
	});

	test("renders member cards with links", async ({ page }) => {
		const memberCard = page.locator("a[href*='/about/']").first();
		await expect(memberCard).toBeVisible({ timeout: 10_000 });
	});
});
