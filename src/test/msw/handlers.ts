import { type HttpHandler, HttpResponse, http } from "msw";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

/** 블로그 목록 mock 아이템 */
const mockBlogItem = {
	idx: 1,
	titleKr: "테스트 블로그",
	titleEn: "Test Blog",
	imageUrl: "https://example.com/img.png",
	summaryKr: "요약",
	summaryEn: "summary",
	contentKr: "내용",
	contentEn: "content",
	createdAt: "2026-01-01",
	modifiedAt: "2026-01-02",
	views: 10,
};

/** 뉴스 목록 mock 아이템 */
const mockNewsItem = {
	idx: 1,
	titleKr: "테스트 뉴스",
	titleEn: "Test News",
	newsUrl: "https://example.com/news/1",
	thumbnailImageUrl: "https://example.com/thumb.png",
	createdAt: "2026-01-01",
	modifiedAt: "2026-01-02",
};

/** 채용 공고 mock 아이템 */
const mockRecruitItem = {
	idx: 1,
	title: "프론트엔드 개발자",
	department: "IT",
	location: "PANGYO",
	recruitType: "FULL_TIME",
	experiment: "",
	education: "NO_REQUIREMENT",
	companyIntroduction: "회사 소개",
	positionIntroduction: "직무 소개",
	mainResponsibility: "주요 업무",
	qualification: "자격 요건",
	preferredQualification: "우대 사항",
	startDate: "2026-01-01",
	endDate: null,
	isActive: true,
};

/**
 * MSW 핸들러 목록
 * API 테스트 시 사용되는 기본 핸들러입니다.
 */
export const handlers: HttpHandler[] = [
	// Blog — 목록
	http.get(`${BASE_URL}/blog/list`, () => {
		return HttpResponse.json({
			status: 200,
			message: "ok",
			data: [mockBlogItem],
		});
	}),

	// Blog — 상세
	http.get(`${BASE_URL}/blog`, () => {
		return HttpResponse.json({
			status: 200,
			message: "ok",
			data: mockBlogItem,
		});
	}),

	// Blog — 조회수 증가
	http.patch(`${BASE_URL}/blog`, () => {
		return HttpResponse.json({ status: 200, message: "ok" });
	}),

	// News — 목록
	http.get(`${BASE_URL}/news/list`, () => {
		return HttpResponse.json({
			status: 200,
			message: "ok",
			data: [mockNewsItem],
		});
	}),

	// Recruit — 목록
	http.get(`${BASE_URL}/job/list`, () => {
		return HttpResponse.json({
			status: 200,
			message: "ok",
			data: [mockRecruitItem],
		});
	}),

	// Recruit — 상세
	http.get(`${BASE_URL}/job`, () => {
		return HttpResponse.json({
			status: 200,
			message: "ok",
			data: mockRecruitItem,
		});
	}),

	// Recruit — 지원
	http.post(`${BASE_URL}/recruit`, () => {
		return HttpResponse.json({ status: 201, message: "ok" });
	}),

	// Talent — 등록
	http.post(`${BASE_URL}/talent`, () => {
		return HttpResponse.json({ status: 201, message: "ok" });
	}),

	// GCP — 업로드
	http.post(`${BASE_URL}/gcp`, () => {
		return HttpResponse.json({
			status: 201,
			message: "ok",
			data: "https://storage.googleapis.com/mock-file.pdf",
		});
	}),
];
