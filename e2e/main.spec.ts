import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context, baseURL }) => {
	await context.addCookies([{ name: "NEXT_LOCALE", value: "ko", url: baseURL }]);
});

test.describe("main page", () => {
	test("/main redirects to /", async ({ page }) => {
		await page.goto("/main");
		await expect(page).toHaveURL("/");
	});

	test("renders banner section with heading", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("main")).toBeVisible();
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10_000 });
	});

	test("renders solution section", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByText("하나의 엔진, 모든 현장")).toBeVisible({ timeout: 10_000 });
	});

	test("renders trust strip with proof points", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByText("MPEG 국제표준 기여")).toBeVisible({ timeout: 10_000 });
	});

	test("renders partner section", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByText("파트너사")).toBeVisible({ timeout: 10_000 });
	});

	test("renders footer with company info", async ({ page }) => {
		await page.goto("/");
		const footer = page.locator("footer");
		await expect(footer).toBeVisible();
		await expect(footer.getByText("Bigtablet, Inc.")).toBeVisible();
	});

	test("footer policy links navigate correctly", async ({ page }) => {
		await page.goto("/");
		const footer = page.locator("footer");
		await expect(footer.getByText("개인정보처리방침")).toBeVisible({ timeout: 10_000 });
		await footer.getByText("개인정보처리방침").click();
		await expect(page).toHaveURL(/\/policies\/privacy/, { timeout: 10_000 });
	});
});
