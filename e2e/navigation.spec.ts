import { test } from "@playwright/test";
import { mockApiRoutes } from "./fixtures/mock-api";

test.describe("header navigation", () => {
	test.beforeEach(async ({ page }) => {
		await mockApiRoutes(page);
	});

	test("navigates to recruit page", async ({ page }) => {
		await page.goto("/main");
		await page.getByRole("link", { name: "Recruit" }).click();
		await page.waitForURL(/\/recruit/, { timeout: 15_000 });
	});

	test("navigates to blog page", async ({ page }) => {
		await page.goto("/main");
		await page.getByRole("link", { name: "Blog" }).click();
		await page.waitForURL(/\/blog/, { timeout: 15_000 });
	});

	test("navigates to news page", async ({ page }) => {
		await page.goto("/main");
		await page.getByRole("link", { name: "News" }).click();
		await page.waitForURL(/\/news/, { timeout: 15_000 });
	});

	test("navigates to about page", async ({ page }) => {
		await page.goto("/main");
		await page.getByRole("link", { name: "About Us" }).click();
		await page.waitForURL(/\/about/, { timeout: 15_000 });
	});
});
