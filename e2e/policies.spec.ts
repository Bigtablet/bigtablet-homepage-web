import { expect, test } from "@playwright/test";

const policyPages = [
	{ path: "/policies/privacy", titleKo: /개인정보/, titleEn: /Privacy/ },
	{ path: "/policies/terms", titleKo: /이용약관/, titleEn: /Terms/ },
	{ path: "/policies/cookies", titleKo: /쿠키/, titleEn: /Cookie/ },
	{ path: "/policies/accessibility", titleKo: /접근성/, titleEn: /Accessibility/ },
];

test.describe("policy pages", () => {
	for (const policy of policyPages) {
		test(`${policy.path} loads with korean content`, async ({ page }) => {
			await page.goto(policy.path);
			await expect(page.locator("main")).toBeVisible();
			await expect(page.locator("main").getByText(policy.titleKo)).toBeVisible();
		});
	}

	for (const policy of policyPages) {
		test(`${policy.path} loads with english content`, async ({ page, context, baseURL }) => {
			await context.addCookies([
				{ name: "NEXT_LOCALE", value: "en", url: baseURL ?? "http://localhost:3000" },
			]);
			await page.goto(policy.path);
			await expect(page.locator("main")).toBeVisible();
			await expect(page.locator("main").getByText(policy.titleEn)).toBeVisible();
		});
	}

	test("policy page has back link that navigates", async ({ page }) => {
		await page.goto("/main");
		await page.goto("/policies/privacy");

		const backButton = page.locator("button").filter({ hasText: /홈|돌아가기/ });
		await expect(backButton).toBeVisible();
		await backButton.click();
		await expect(page).toHaveURL(/\/main/);
	});
});
