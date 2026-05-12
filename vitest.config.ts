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
				/* use-*.ts 훅은 비즈니스 로직 포함 → 커버리지 측정에 포함.
				   아래 use-solution-modal.ts는 GSAP/raf/DOM rect 의존이 강해 renderHook으로도
				   안정 테스트가 어려워 명시 exclude 유지. */
				"src/widgets/main/solution/section/use-solution-modal.ts",
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
