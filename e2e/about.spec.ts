import { expect, test } from "@playwright/test";

test.describe("about page", () => {
	test("about page loads with company intro", async ({ page }) => {
		await page.goto("/about");
		await expect(page.locator("main")).toBeVisible();
	});

	test("renders team member section", async ({ page }) => {
		await page.goto("/about");
		const teamSection = page.locator("#team");
		await expect(teamSection).toBeVisible();
	});

	test("navigates to team member detail", async ({ page }) => {
		await page.goto("/about");
		const memberCard = page.locator("a[href*='/about/']").first();
		await expect(memberCard).toBeVisible({ timeout: 10_000 });
		await memberCard.click();
		await expect(page).toHaveURL(/\/about\/\w+/);
		await expect(page.locator("main")).toBeVisible();
	});

	test("team member detail has back link", async ({ page }) => {
		await page.goto("/about");
		const memberCard = page.locator("a[href*='/about/']").first();
		await expect(memberCard).toBeVisible({ timeout: 10_000 });
		await memberCard.click();
		await expect(page).toHaveURL(/\/about\/\w+/);

		const backButton = page.locator("button").filter({ hasText: /Back|돌아가기|팀/ });
		await expect(backButton).toBeVisible();
	});
});
