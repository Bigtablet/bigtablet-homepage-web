import { expect, test } from "@playwright/test";

test.describe("main page", () => {
	test("/ redirects to /main", async ({ page }) => {
		const response = await page.goto("/");
		expect(response?.url()).toContain("/main");
	});

	test("renders banner section with heading", async ({ page }) => {
		await page.goto("/main");
		await expect(page.locator("main")).toBeVisible();
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});

	test("renders solution section", async ({ page }) => {
		await page.goto("/main");
		const solution = page.getByRole("region", { name: /솔루션/ });
		await expect(solution).toBeVisible();
	});

	test("renders partner section", async ({ page }) => {
		await page.goto("/main");
		const partners = page.getByRole("heading", { name: /파트너/ });
		await expect(partners).toBeVisible();
	});

	test("renders footer with company info", async ({ page }) => {
		await page.goto("/main");
		const footer = page.locator("footer");
		await expect(footer).toBeVisible();
		await expect(footer.getByText("Bigtablet, Inc.")).toBeVisible();
	});

	test("footer policy links navigate correctly", async ({ page }) => {
		await page.goto("/main");
		const footer = page.locator("footer");
		await footer.getByRole("link", { name: /개인정보/ }).click();
		await expect(page).toHaveURL(/\/policies\/privacy/);
	});
});
