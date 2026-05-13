#!/usr/bin/env node
/**
 * Lighthouse CI 전용 mock API 서버.
 * CI 환경에서 실제 백엔드가 없으면 모든 데이터 의존 페이지가 ErrorFallback 으로 렌더되어
 * 측정값이 실제 페이지 perf 를 반영 못 함. 이 서버는 src/test/msw/handlers.ts 와 동일한
 * shape 의 응답을 반환해 SSR + client query 가 실제 콘텐츠로 통과하게 한다.
 *
 * Node 만 사용 — 외부 의존성 없음. 0.0.0.0:4000 listen.
 */
import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_PORT ?? 4000);

const ok = (data) => ({ status: 200, message: "ok", data });

const blogItem = {
	idx: 1,
	titleKr: "테스트 블로그",
	titleEn: "Test Blog",
	imageUrl: "https://storage.googleapis.com/bigtablet-homepage/mock-blog.webp",
	summaryKr: "요약",
	summaryEn: "summary",
	contentKr: "내용",
	contentEn: "content",
	createdAt: "2026-01-01T00:00:00.000Z",
	modifiedAt: "2026-01-02T00:00:00.000Z",
	views: 10,
};

const newsItem = {
	idx: 1,
	titleKr: "테스트 뉴스",
	titleEn: "Test News",
	newsUrl: "https://example.com/news/1",
	thumbnailImageUrl: "https://storage.googleapis.com/bigtablet-homepage/mock-news.webp",
	createdAt: "2026-01-01T00:00:00.000Z",
	modifiedAt: "2026-01-02T00:00:00.000Z",
};

const recruitItem = {
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

const ROUTES = {
	"GET /blog/list": () => ok([blogItem]),
	"GET /blog": () => ok(blogItem),
	"PATCH /blog": () => ok(null),
	"GET /news/list": () => ok([newsItem]),
	"GET /job/list": () => ok([recruitItem]),
	"GET /job": () => ok(recruitItem),
	"POST /recruit": () => ({ status: 201, message: "ok" }),
	"POST /talent": () => ({ status: 201, message: "ok" }),
	"POST /auth/email": () => ({ status: 200, message: "ok" }),
	"POST /auth/email/check": () => ({ status: 200, message: "verified" }),
	"POST /gcp": () => ({
		status: 201,
		message: "ok",
		data: "https://storage.googleapis.com/mock-file.pdf",
	}),
};

const server = createServer((req, res) => {
	/* Host 헤더 누락 케이스 — 고정 base 로 안전하게 pathname 만 파싱 */
	const url = new URL(req.url ?? "/", "http://localhost");
	const key = `${req.method} ${url.pathname}`;
	const handler = ROUTES[key];

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

	if (req.method === "OPTIONS") {
		res.statusCode = 204;
		res.end();
		return;
	}

	if (!handler) {
		res.statusCode = 404;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ status: 404, message: `no mock for ${key}` }));
		return;
	}

	/* 응답 페이로드의 status 필드를 HTTP statusCode 로도 반영 — MSW handlers 와 일치 */
	const result = handler();
	res.statusCode = typeof result.status === "number" ? result.status : 200;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify(result));
});

server.listen(PORT, "0.0.0.0", () => {
	console.log(`[lighthouse-api-mock] listening on http://127.0.0.1:${PORT}`);
});

const shutdown = (signal) => {
	console.log(`[lighthouse-api-mock] received ${signal}, closing`);
	server.close(() => process.exit(0));
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
