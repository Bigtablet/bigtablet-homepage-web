import type { Page } from "@playwright/test";

const blogListResponse = {
	status: 200,
	message: "ok",
	data: [
		{
			idx: 1,
			titleKr: "AI 영상 분석 기술의 미래",
			titleEn: "Future of AI Video Analytics",
			imageUrl: null,
			summaryKr: "AI 기반 영상 분석 기술의 발전 방향을 소개합니다.",
			summaryEn: "Introducing the future direction of AI-based video analytics.",
			contentKr: "본문 내용",
			contentEn: "Content body",
			createdAt: "2026-01-15",
			modifiedAt: "2026-01-15",
			views: 42,
		},
		{
			idx: 2,
			titleKr: "리테일 보안 솔루션 출시",
			titleEn: "Retail Security Solution Launch",
			imageUrl: null,
			summaryKr: "새로운 리테일 보안 솔루션을 출시했습니다.",
			summaryEn: "We launched a new retail security solution.",
			contentKr: "본문 내용 2",
			contentEn: "Content body 2",
			createdAt: "2026-01-10",
			modifiedAt: "2026-01-10",
			views: 28,
		},
	],
};

const newsListResponse = {
	status: 200,
	message: "ok",
	data: [
		{
			idx: 1,
			titleKr: "빅태블릿, CES 2026 참가",
			titleEn: "Bigtablet at CES 2026",
			newsUrl: "https://example.com/news/1",
			thumbnailImageUrl: "https://example.com/thumb1.png",
			createdAt: "2026-01-05",
			modifiedAt: "2026-01-05",
		},
		{
			idx: 2,
			titleKr: "한화비전 파트너십 체결",
			titleEn: "Hanwha Vision Partnership",
			newsUrl: "https://example.com/news/2",
			thumbnailImageUrl: "https://example.com/thumb2.png",
			createdAt: "2026-01-03",
			modifiedAt: "2026-01-03",
		},
	],
};

const recruitListResponse = {
	status: 200,
	message: "ok",
	data: [
		{
			idx: 1,
			title: "프론트엔드 개발자",
			department: "IT",
			location: "PANGYO",
			recruitType: "FULL_TIME",
			experiment: "",
			education: "NO_REQUIREMENT",
			companyIntroduction: "빅태블릿 소개",
			positionIntroduction: "프론트엔드 직무 소개",
			mainResponsibility: "웹 개발",
			qualification: "React 경험",
			preferredQualification: "Next.js 경험",
			startDate: "2026-01-01",
			endDate: null,
			isActive: true,
		},
	],
};

/**
 * Playwright page.route()로 API 응답을 mock.
 * 모든 API 의존 페이지 테스트에서 사용.
 */
export async function mockApiRoutes(page: Page) {
	await page.route("**/blog/list**", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify(blogListResponse),
		});
	});

	await page.route("**/blog?idx=*", (route) => {
		if (route.request().method() === "PATCH") {
			route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ status: 200, message: "ok" }),
			});
			return;
		}
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				status: 200,
				message: "ok",
				data: blogListResponse.data[0],
			}),
		});
	});

	await page.route("**/news/list**", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify(newsListResponse),
		});
	});

	await page.route("**/job/list**", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify(recruitListResponse),
		});
	});

	await page.route("**/job?idx=*", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				status: 200,
				message: "ok",
				data: recruitListResponse.data[0],
			}),
		});
	});

	// PATCH /blog (view count, query param 없는 경우)
	await page.route("**/blog", (route) => {
		if (route.request().method() === "PATCH") {
			route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ status: 200, message: "ok" }),
			});
		} else {
			route.continue();
		}
	});
}
