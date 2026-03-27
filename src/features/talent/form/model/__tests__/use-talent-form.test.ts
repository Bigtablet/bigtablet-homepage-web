import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// --- mocks ---
const mockToast = { success: vi.fn(), error: vi.fn() };
vi.mock("@bigtablet/design-system", () => ({
	useToast: () => mockToast,
}));

const mockCreateTalent = vi.fn();
vi.mock("src/features/talent/mutation/talent.mutation", () => ({
	useTalentMutation: () => ({
		mutateAsync: mockCreateTalent,
		isPending: false,
	}),
}));

const mockUploadFile = vi.fn();
vi.mock("src/features/upload/mutation/upload.mutation", () => ({
	useUploadMutation: () => ({
		mutateAsync: mockUploadFile,
		isPending: false,
	}),
}));

import { useTalentForm } from "src/features/talent/form/model/use-talent-form";

const MB = 1024 * 1024;
const makeFile = (
	sizeBytes: number,
	type = "application/pdf",
	name = "portfolio.pdf",
) => new File([new ArrayBuffer(sizeBytes)], name, { type });

describe("useTalentForm", () => {
	const onClose = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("handleModeChange", () => {
		it("file 모드로 전환하면 portfolioUrl을 초기화한다", () => {
			const { result } = renderHook(() => useTalentForm({ onClose }));

			act(() => {
				result.current.form.setValue("portfolioUrl", "https://example.com");
				result.current.setPortfolioMode("file");
			});

			expect(result.current.form.getValues("portfolioUrl")).toBe("");
			expect(result.current.portfolioMode).toBe("file");
		});

		it("link 모드로 전환하면 portfolioMode만 변경된다", () => {
			const { result } = renderHook(() => useTalentForm({ onClose }));

			act(() => {
				result.current.setPortfolioMode("file");
				result.current.setPortfolioMode("link");
			});

			expect(result.current.portfolioMode).toBe("link");
		});
	});

	describe("handlePortfolioFile", () => {
		it("유효한 파일을 업로드하면 portfolioUrl에 URL이 설정된다", async () => {
			mockUploadFile.mockResolvedValue({
				data: "https://cdn.example.com/p.pdf",
			});

			const { result } = renderHook(() => useTalentForm({ onClose }));

			await act(async () => {
				await result.current.handlePortfolioFile(makeFile(1 * MB));
			});

			expect(result.current.form.getValues("portfolioUrl")).toBe(
				"https://cdn.example.com/p.pdf",
			);
		});

		it("파일 검증 실패 시 error 토스트를 표시하고 업로드하지 않는다", async () => {
			const { result } = renderHook(() => useTalentForm({ onClose }));

			await act(async () => {
				await result.current.handlePortfolioFile(
					makeFile(51 * MB, "video/mp4", "bad.mp4"),
				);
			});

			expect(mockToast.error).toHaveBeenCalled();
			expect(mockUploadFile).not.toHaveBeenCalled();
		});

		it("파일 업로드 실패 시 error 토스트를 표시하고 portfolioUrl을 초기화한다", async () => {
			mockUploadFile.mockRejectedValue(new Error("업로드 실패"));

			const { result } = renderHook(() => useTalentForm({ onClose }));
			act(() => {
				result.current.form.setValue("portfolioUrl", "https://old.com");
			});

			await act(async () => {
				await result.current.handlePortfolioFile(makeFile(1 * MB));
			});

			expect(mockToast.error).toHaveBeenCalledWith(
				"파일 업로드에 실패했습니다. 다시 시도해주세요.",
			);
			expect(result.current.form.getValues("portfolioUrl")).toBe("");
		});

		it("file이 null이면 아무것도 하지 않는다", async () => {
			const { result } = renderHook(() => useTalentForm({ onClose }));

			await act(async () => {
				await result.current.handlePortfolioFile(null);
			});

			expect(mockUploadFile).not.toHaveBeenCalled();
		});
	});

	describe("handleSubmit (ensureHttps + etcUrl 필터링)", () => {
		it("portfolioUrl에 프로토콜이 없으면 https://를 추가한다", async () => {
			mockCreateTalent.mockResolvedValue(undefined);

			const { result } = renderHook(() => useTalentForm({ onClose }));
			act(() => {
				result.current.form.setValue("email", "test@example.com");
				result.current.form.setValue("name", "홍길동");
				result.current.form.setValue("department", "개발팀");
				result.current.form.setValue("portfolioUrl", "example.com/portfolio");
				result.current.form.setValue("etcUrl", [""]);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			const payload = mockCreateTalent.mock.calls[0][0];
			expect(payload.portfolioUrl).toBe("https://example.com/portfolio");
		});

		it("이미 https://가 있는 URL은 그대로 유지한다", async () => {
			mockCreateTalent.mockResolvedValue(undefined);

			const { result } = renderHook(() => useTalentForm({ onClose }));
			act(() => {
				result.current.form.setValue("email", "test@example.com");
				result.current.form.setValue("name", "홍길동");
				result.current.form.setValue("department", "개발팀");
				result.current.form.setValue(
					"portfolioUrl",
					"https://example.com/portfolio",
				);
				result.current.form.setValue("etcUrl", [""]);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			const payload = mockCreateTalent.mock.calls[0][0];
			expect(payload.portfolioUrl).toBe("https://example.com/portfolio");
		});

		it("빈 etcUrl은 필터링되어 payload에 포함되지 않는다", async () => {
			mockCreateTalent.mockResolvedValue(undefined);

			const { result } = renderHook(() => useTalentForm({ onClose }));
			act(() => {
				result.current.form.setValue("email", "test@example.com");
				result.current.form.setValue("name", "홍길동");
				result.current.form.setValue("department", "개발팀");
				result.current.form.setValue("portfolioUrl", "https://example.com");
				result.current.form.setValue("etcUrl", ["", "  ", ""]);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			const payload = mockCreateTalent.mock.calls[0][0];
			expect(payload.etcUrl).toBeUndefined();
		});

		it("유효한 etcUrl은 필터링 없이 포함된다", async () => {
			mockCreateTalent.mockResolvedValue(undefined);

			const { result } = renderHook(() => useTalentForm({ onClose }));
			act(() => {
				result.current.form.setValue("email", "test@example.com");
				result.current.form.setValue("name", "홍길동");
				result.current.form.setValue("department", "개발팀");
				result.current.form.setValue("portfolioUrl", "https://example.com");
				result.current.form.setValue("etcUrl", ["github.com/user", ""]);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			const payload = mockCreateTalent.mock.calls[0][0];
			expect(payload.etcUrl).toEqual(["https://github.com/user"]);
		});

		it("제출 성공 시 success 토스트를 표시하고 폼을 초기화 후 onClose를 호출한다", async () => {
			mockCreateTalent.mockResolvedValue(undefined);

			const { result } = renderHook(() => useTalentForm({ onClose }));
			act(() => {
				result.current.form.setValue("email", "test@example.com");
				result.current.form.setValue("name", "홍길동");
				result.current.form.setValue("department", "개발팀");
				result.current.form.setValue("portfolioUrl", "https://example.com");
				result.current.form.setValue("etcUrl", [""]);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockToast.success).toHaveBeenCalledWith("등록이 완료되었습니다.");
			expect(onClose).toHaveBeenCalledOnce();
			expect(result.current.form.getValues("name")).toBe("");
		});

		it("제출 실패 시 error 토스트를 표시한다", async () => {
			mockCreateTalent.mockRejectedValue(new Error("서버 오류"));

			const { result } = renderHook(() => useTalentForm({ onClose }));
			act(() => {
				result.current.form.setValue("email", "test@example.com");
				result.current.form.setValue("name", "홍길동");
				result.current.form.setValue("department", "개발팀");
				result.current.form.setValue("portfolioUrl", "https://example.com");
				result.current.form.setValue("etcUrl", [""]);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockToast.error).toHaveBeenCalled();
			expect(onClose).not.toHaveBeenCalled();
		});
	});
});
