import { expect, test } from "@playwright/test";

test.describe("blog page", () => {
	test("blog list page loads with content", async ({ page }) => {
		await page.goto("/blog");
		await expect(page.locator("main")).toBeVisible();
	});

	test("blog list renders article cards", async ({ page }) => {
		await page.goto("/blog");
		const cards = page.locator("main a[href*='/blog/']");
		await expect(cards.first()).toBeVisible({ timeout: 10_000 });
	});

	test("navigates to blog detail and back", async ({ page }) => {
		await page.goto("/blog");
		const firstCard = page.locator("main a[href*='/blog/']").first();
		await expect(firstCard).toBeVisible({ timeout: 10_000 });
		await firstCard.click();
		await expect(page).toHaveURL(/\/blog\/\d+/);
		await expect(page.locator("main")).toBeVisible();

		await page.goBack();
		await expect(page).toHaveURL(/\/blog$/);
	});
});

test.describe("news page", () => {
	test("news list page loads with content", async ({ page }) => {
		await page.goto("/news");
		await expect(page.locator("main")).toBeVisible();
	});

	test("news list renders article cards", async ({ page }) => {
		await page.goto("/news");
		const cards = page.locator("main a[href*='/news/']");
		await expect(cards.first()).toBeVisible({ timeout: 10_000 });
	});

	test("navigates to news detail and back", async ({ page }) => {
		await page.goto("/news");
		const firstCard = page.locator("main a[href*='/news/']").first();
		await expect(firstCard).toBeVisible({ timeout: 10_000 });
		await firstCard.click();
		await expect(page).toHaveURL(/\/news\//);
		await expect(page.locator("main")).toBeVisible();
	});
});
