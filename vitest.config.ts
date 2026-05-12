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
		env: {
			NEXT_PUBLIC_SERVER_URL: "http://localhost:3000",
		},
		exclude: ["e2e/**", "node_modules/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "json-summary", "html"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				// 타입 선언 및 배럴
				"src/**/*.d.ts",
				"src/**/index.ts",
				"src/**/type.ts",
				"src/**/types.ts",
				// Next.js 앱 라우터 (페이지, 레이아웃) + 인스트루멘테이션
				"src/app/**",
				"src/instrumentation.ts",
				// React 컴포넌트 및 훅 (UI 테스트는 e2e 가 담당)
				"src/**/*.tsx",
				"src/**/hooks/**",
				// .ts 확장자로 만든 React 컴포넌트 (JSX는 안 쓰지만 createPortal 등 DOM 의존)
				"src/shared/libs/ui/portal/portal.ts",
				// hook 형 .ts 파일이 hooks/ 디렉토리 밖에 있는 케이스도 동일 취급
				"src/**/use-*.ts",
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
