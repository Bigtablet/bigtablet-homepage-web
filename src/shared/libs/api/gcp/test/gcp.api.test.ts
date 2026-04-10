import { HttpResponse, http } from "msw";
import { server } from "src/test/msw/server";
import { describe, expect, it } from "vitest";
import { postGcpUploadApi } from "../gcp.api";

const createMockFile = (name = "test.pdf", type = "application/pdf") =>
	new File(["content"], name, { type });

describe("postGcpUploadApi", () => {
	it("파일 업로드가 정상 처리된다", async () => {
		const file = createMockFile();
		const result = await postGcpUploadApi(file);
		expect(result).toBeDefined();
		expect(result.data).toContain("storage.googleapis.com");
	});

	it("AbortSignal로 요청을 취소할 수 있다", async () => {
		const controller = new AbortController();
		controller.abort();
		const file = createMockFile();
		await expect(postGcpUploadApi(file, controller.signal)).rejects.toThrow();
	});

	it("서버 에러 시 예외를 throw한다", async () => {
		server.use(http.post("*/gcp", () => HttpResponse.json(null, { status: 500 })));
		const file = createMockFile();
		await expect(postGcpUploadApi(file)).rejects.toThrow();
	});
});
