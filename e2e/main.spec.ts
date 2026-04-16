import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context, baseURL }) => {
	await context.addCookies([{ name: "NEXT_LOCALE", value: "ko", url: baseURL }]);
});

test.describe("main page", () => {
	test("/ redirects to /main", async ({ page }) => {
		const response = await page.goto("/");
		expect(response?.url()).toContain("/main");
	});

	test("renders banner section with heading", async ({ page }) => {
		await page.goto("/main");
		await expect(page.locator("main")).toBeVisible();
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10_000 });
	});

	test("renders solution section", async ({ page }) => {
		await page.goto("/main");
		await expect(page.getByText("솔루션 개요")).toBeVisible({ timeout: 10_000 });
	});

	test("renders partner section", async ({ page }) => {
		await page.goto("/main");
		await expect(page.getByText("파트너사")).toBeVisible({ timeout: 10_000 });
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
		await expect(footer.getByText("개인정보처리방침")).toBeVisible({ timeout: 10_000 });
		await footer.getByText("개인정보처리방침").click();
		await expect(page).toHaveURL(/\/policies\/privacy/, { timeout: 10_000 });
	});
});
