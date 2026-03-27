import "@testing-library/jest-dom/vitest";
import { server } from "src/test/msw/server";
import { afterAll, afterEach, beforeAll } from "vitest";

// MSW 서버 생명주기
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
