import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** API 의존 페이지(blog, news, recruit) 제외 — CI에서 API 미가용 시 렌더링 실패 */
const pages = [
	{ name: "main", path: "/main" },
	{ name: "about", path: "/about" },
	{ name: "privacy policy", path: "/policies/privacy" },
	{ name: "terms", path: "/policies/terms" },
];

test.describe("accessibility", () => {
	for (const { name, path } of pages) {
		test(`${name} page has no critical a11y violations`, async ({ page }) => {
			await page.goto(path);
			await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });

			const results = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
				.analyze();

			// critical만 실패, serious는 경고 출력
			const critical = results.violations.filter((v) => v.impact === "critical");
			const serious = results.violations.filter((v) => v.impact === "serious");

			if (serious.length > 0) {
				const summary = serious
					.map((v) => `  [serious] ${v.id}: ${v.help} (${v.nodes.length} nodes)`)
					.join("\n");
				console.warn(`⚠️ Serious a11y issues on ${name}:\n${summary}`);
			}

			if (critical.length > 0) {
				const summary = critical
					.map((v) => `  [critical] ${v.id}: ${v.help} (${v.nodes.length} nodes)`)
					.join("\n");
				expect(critical, `Critical a11y violations on ${name}:\n${summary}`).toHaveLength(0);
			}
		});
	}
});
