import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockMutateAsync = vi.fn();
vi.mock("src/features/upload/mutation/upload.mutation", () => ({
	useUploadMutation: () => ({
		mutateAsync: mockMutateAsync,
		isPending: false,
		isError: false,
		isSuccess: false,
	}),
}));

import { useUpload } from "src/features/upload/model/use-upload";

const MB = 1024 * 1024;

const makeFile = (
	sizeBytes: number,
	type = "application/pdf",
	name = "test.pdf",
) => new File([new ArrayBuffer(sizeBytes)], name, { type });

describe("useUpload", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("upload 성공", () => {
		it("유효한 파일을 업로드하면 URL을 반환한다", async () => {
			mockMutateAsync.mockResolvedValue({
				data: "https://cdn.example.com/file.pdf",
			});

			const { result } = renderHook(() => useUpload());
			const url = await result.current.upload(makeFile(1 * MB));

			expect(mockMutateAsync).toHaveBeenCalledOnce();
			expect(url).toBe("https://cdn.example.com/file.pdf");
		});

		it("mutation이 data: null을 반환하면 빈 문자열을 반환한다", async () => {
			mockMutateAsync.mockResolvedValue({ data: null });

			const { result } = renderHook(() => useUpload());
			const url = await result.current.upload(makeFile(1 * MB));

			expect(url).toBe("");
		});
	});

	describe("파일 검증 실패", () => {
		it("50MB를 초과하는 파일은 에러를 던진다", async () => {
			const { result } = renderHook(() => useUpload());

			await expect(result.current.upload(makeFile(51 * MB))).rejects.toThrow();
			expect(mockMutateAsync).not.toHaveBeenCalled();
		});

		it("허용되지 않는 파일 타입은 에러를 던진다", async () => {
			const { result } = renderHook(() => useUpload());
			const badFile = makeFile(1 * MB, "video/mp4", "test.mp4");

			await expect(result.current.upload(badFile)).rejects.toThrow();
			expect(mockMutateAsync).not.toHaveBeenCalled();
		});
	});

	describe("mutation 실패", () => {
		it("mutation이 실패하면 에러를 그대로 전파한다", async () => {
			mockMutateAsync.mockRejectedValue(new Error("서버 오류"));

			const { result } = renderHook(() => useUpload());

			await expect(result.current.upload(makeFile(1 * MB))).rejects.toThrow(
				"서버 오류",
			);
		});
	});
});
