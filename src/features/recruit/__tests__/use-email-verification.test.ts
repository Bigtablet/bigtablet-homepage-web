import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockSendEmailApi = vi.fn();
const mockCheckEmailApi = vi.fn();
vi.mock("src/features/recruit/apply/form/email/api/email.api", () => ({
	sendEmailApi: (...args: unknown[]) => mockSendEmailApi(...args),
	checkEmailApi: (...args: unknown[]) => mockCheckEmailApi(...args),
}));

const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn() };
vi.mock("@bigtablet/design-system", () => ({
	useToast: () => mockToast,
}));

import useEmailVerification from "src/features/recruit/apply/form/email/use-email-verification";

const EMAIL = "test@example.com";

describe("useEmailVerification", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("초기 상태가 올바르다", () => {
		const { result } = renderHook(() => useEmailVerification({ email: EMAIL }));

		expect(result.current.authCode).toBe("");
		expect(result.current.resendSec).toBe(0);
		expect(result.current.sendLoading).toBe(false);
		expect(result.current.checkLoading).toBe(false);
		expect(result.current.emailSent).toBe(false);
		expect(result.current.emailVerified).toBe(false);
	});

	describe("send", () => {
		it("이메일이 비어있으면 에러 토스트를 표시한다", async () => {
			const { result } = renderHook(() => useEmailVerification({ email: "" }));

			await act(() => result.current.send());

			expect(mockSendEmailApi).not.toHaveBeenCalled();
			expect(mockToast.error).toHaveBeenCalledWith("이메일을 입력해주세요.");
		});

		it("인증 메일 전송 성공 시 상태를 업데이트한다", async () => {
			mockSendEmailApi.mockResolvedValue({});

			const { result } = renderHook(() =>
				useEmailVerification({ email: EMAIL }),
			);

			await act(() => result.current.send());

			expect(mockSendEmailApi).toHaveBeenCalledWith(EMAIL);
			expect(result.current.emailSent).toBe(true);
			expect(result.current.resendSec).toBe(60);
			expect(mockToast.success).toHaveBeenCalledWith(
				"인증 코드가 전송되었습니다. 메일함을 확인해주세요.",
			);
		});

		it("재전송 쿨다운 중에는 warning 토스트를 표시한다", async () => {
			mockSendEmailApi.mockResolvedValue({});

			const { result } = renderHook(() =>
				useEmailVerification({ email: EMAIL }),
			);

			await act(() => result.current.send());
			expect(result.current.resendSec).toBe(60);

			await act(() => result.current.send());

			expect(mockSendEmailApi).toHaveBeenCalledTimes(1);
			expect(mockToast.warning).toHaveBeenCalled();
		});

		it("전송 실패 시 에러 토스트를 표시한다", async () => {
			mockSendEmailApi.mockRejectedValue(new Error("서버 오류"));

			const { result } = renderHook(() =>
				useEmailVerification({ email: EMAIL }),
			);

			await act(() => result.current.send());

			expect(result.current.emailSent).toBe(false);
			expect(mockToast.error).toHaveBeenCalledWith("서버 오류");
		});

		it("커스텀 cooldownSec를 적용한다", async () => {
			mockSendEmailApi.mockResolvedValue({});

			const { result } = renderHook(() =>
				useEmailVerification({ email: EMAIL, cooldownSec: 30 }),
			);

			await act(() => result.current.send());

			expect(result.current.resendSec).toBe(30);
		});
	});

	describe("verify", () => {
		it("인증코드가 비어있으면 warning 토스트를 표시한다", async () => {
			const { result } = renderHook(() =>
				useEmailVerification({ email: EMAIL }),
			);

			await act(() => result.current.verify());

			expect(mockCheckEmailApi).not.toHaveBeenCalled();
			expect(mockToast.warning).toHaveBeenCalledWith(
				"이메일과 인증 코드를 입력해주세요.",
			);
		});

		it("인증 성공 시 emailVerified를 true로 설정한다", async () => {
			mockCheckEmailApi.mockResolvedValue({});

			const { result } = renderHook(() =>
				useEmailVerification({ email: EMAIL }),
			);

			act(() => result.current.setAuthCode("123456"));
			await act(() => result.current.verify());

			expect(mockCheckEmailApi).toHaveBeenCalledWith(EMAIL, "123456");
			expect(result.current.emailVerified).toBe(true);
			expect(mockToast.success).toHaveBeenCalledWith(
				"이메일 인증이 완료되었습니다.",
			);
		});

		it("인증 실패 시 emailVerified를 false로 유지하고 에러 토스트를 표시한다", async () => {
			mockCheckEmailApi.mockRejectedValue(new Error("잘못된 코드"));

			const { result } = renderHook(() =>
				useEmailVerification({ email: EMAIL }),
			);

			act(() => result.current.setAuthCode("wrong"));
			await act(() => result.current.verify());

			expect(result.current.emailVerified).toBe(false);
			expect(mockToast.error).toHaveBeenCalledWith("잘못된 코드");
		});
	});

	describe("이메일 변경 시 상태 리셋", () => {
		it("이메일이 변경되면 인증 상태가 초기화된다", async () => {
			mockCheckEmailApi.mockResolvedValue({});
			mockSendEmailApi.mockResolvedValue({});

			const { result, rerender } = renderHook(
				({ email }: { email: string }) => useEmailVerification({ email }),
				{ initialProps: { email: "a@test.com" } },
			);

			await act(() => result.current.send());
			act(() => result.current.setAuthCode("123456"));
			await act(() => result.current.verify());

			expect(result.current.emailVerified).toBe(true);
			expect(result.current.emailSent).toBe(true);

			rerender({ email: "b@test.com" });

			expect(result.current.emailVerified).toBe(false);
			expect(result.current.emailSent).toBe(false);
			expect(result.current.authCode).toBe("");
			expect(result.current.resendSec).toBe(0);
		});
	});

	describe("resendSec 카운트다운", () => {
		it("1초마다 resendSec가 감소한다", async () => {
			mockSendEmailApi.mockResolvedValue({});

			const { result } = renderHook(() =>
				useEmailVerification({ email: EMAIL, cooldownSec: 3 }),
			);

			await act(() => result.current.send());
			expect(result.current.resendSec).toBe(3);

			await act(() => {
				vi.advanceTimersByTime(1000);
			});
			expect(result.current.resendSec).toBe(2);

			await act(() => {
				vi.advanceTimersByTime(2000);
			});
			expect(result.current.resendSec).toBe(0);
		});
	});
});
