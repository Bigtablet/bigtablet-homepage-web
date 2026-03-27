import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** Vitest 환경용 MSW 서버 */
export const server = setupServer(...handlers);
