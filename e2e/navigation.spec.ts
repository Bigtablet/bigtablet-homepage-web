import { expect, test } from "@playwright/test";
import { mockApiRoutes } from "./fixtures/mock-api";

test.describe("header navigation", () => {
	test.beforeEach(async ({ page }) => {
		await mockApiRoutes(page);
		await page.goto("/main");
	});

	test("navigates to recruit page", async ({ page }) => {
		await page.getByRole("link", { name: "Recruit" }).click();
		await expect(page).toHaveURL(/\/recruit/, { timeout: 15_000 });
	});

	test("navigates to blog page", async ({ page }) => {
		await page.getByRole("link", { name: "Blog" }).click();
		await expect(page).toHaveURL(/\/blog/, { timeout: 15_000 });
	});

	test("navigates to news page", async ({ page }) => {
		await page.getByRole("link", { name: "News" }).click();
		await expect(page).toHaveURL(/\/news/, { timeout: 15_000 });
	});

	test("navigates to about page", async ({ page }) => {
		await page.getByRole("link", { name: "About Us" }).click();
		await expect(page).toHaveURL(/\/about/, { timeout: 15_000 });
	});
});
