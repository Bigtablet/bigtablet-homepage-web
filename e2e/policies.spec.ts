import { expect, test } from "@playwright/test";

const policyPages = [
	{ path: "/policies/privacy", titleKo: "개인정보 처리방침", titleEn: "Privacy Policy" },
	{ path: "/policies/terms", titleKo: "서비스 이용약관", titleEn: "Terms of Service" },
	{ path: "/policies/cookies", titleKo: "쿠키 정책", titleEn: "Cookie Policy" },
	{
		path: "/policies/accessibility",
		titleKo: "접근성 선언문",
		titleEn: "Accessibility Statement",
	},
];

test.describe("policy pages - korean", () => {
	test.beforeEach(async ({ context, baseURL }) => {
		await context.addCookies([{ name: "NEXT_LOCALE", value: "ko", url: baseURL }]);
	});

	for (const policy of policyPages) {
		test(`${policy.path} loads with korean content`, async ({ page }) => {
			await page.goto(policy.path);
			await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });
			await expect(page.getByRole("heading", { name: policy.titleKo })).toBeVisible({
				timeout: 10_000,
			});
		});
	}

	test("policy page back link navigates to previous page", async ({ page }) => {
		await page.goto("/main");
		await page.goto("/policies/privacy");
		await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });

		const backButton = page.locator("button").filter({ hasText: /홈/ });
		await expect(backButton).toBeVisible({ timeout: 10_000 });
		await backButton.click();
		await expect(page).toHaveURL(/\/main/);
	});
});

test.describe("policy pages - english", () => {
	test.beforeEach(async ({ context, baseURL }) => {
		await context.addCookies([{ name: "NEXT_LOCALE", value: "en", url: baseURL }]);
	});

	for (const policy of policyPages) {
		test(`${policy.path} loads with english content`, async ({ page }) => {
			await page.goto(policy.path);
			await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });
			await expect(page.getByRole("heading", { name: policy.titleEn })).toBeVisible({
				timeout: 10_000,
			});
		});
	}
});
