import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 1 : 0,
	workers: isCI ? 2 : undefined,
	timeout: 30_000,
	reporter: "html",
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
	],
	webServer: {
		command: "pnpm e2e:start",
		url: "http://localhost:3000",
		reuseExistingServer: !isCI,
		timeout: 120_000,
	},
});
