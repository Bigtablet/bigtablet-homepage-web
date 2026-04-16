import { expect, test } from "@playwright/test";

test.describe("recruit pages", () => {
	test("recruit list page loads", async ({ page }) => {
		await page.goto("/recruit");
		await expect(page.locator("main")).toBeVisible();
	});

	test("recruit list renders job cards", async ({ page }) => {
		await page.goto("/recruit");
		const cards = page.locator("main a[href*='/recruit/']");
		await expect(cards.first()).toBeVisible({ timeout: 10_000 });
	});

	test("navigates to recruit detail page", async ({ page }) => {
		await page.goto("/recruit");
		const firstCard = page.locator("main a[href*='/recruit/']").first();
		await expect(firstCard).toBeVisible({ timeout: 10_000 });
		await firstCard.click();
		await expect(page).toHaveURL(/\/recruit\/\d+/);
		await expect(page.locator("main")).toBeVisible();
	});

	test("recruit detail has apply button", async ({ page }) => {
		await page.goto("/recruit");
		const firstCard = page.locator("main a[href*='/recruit/']").first();
		await expect(firstCard).toBeVisible({ timeout: 10_000 });
		await firstCard.click();
		await expect(page).toHaveURL(/\/recruit\/\d+/);

		const applyLink = page.locator("a[href*='/apply']");
		await expect(applyLink).toBeVisible();
	});
});
