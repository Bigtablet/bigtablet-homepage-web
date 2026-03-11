import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"src/": `${resolve(__dirname, "src")}/`,
		},
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		globals: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "json-summary", "html"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				// 타입 선언 및 배럴
				"src/**/*.d.ts",
				"src/**/index.ts",
				// Next.js 앱 라우터 (페이지, 레이아웃)
				"src/app/**",
				// API 함수 (HTTP 요청 — 통합 테스트 대상)
				"src/**/api/*.ts",
				"src/**/api/**/*.ts",
				// React 컴포넌트 및 훅 (UI 테스트 불필요)
				"src/**/*.tsx",
				"src/**/hooks/**",
				// mutation/query 훅
				"src/**/mutation/**",
				"src/**/query/**",
				// i18n 설정
				"src/i18n/**",
				// 상수 (로직 없음)
				"src/**/constants/**",
			],
		},
	},
});
