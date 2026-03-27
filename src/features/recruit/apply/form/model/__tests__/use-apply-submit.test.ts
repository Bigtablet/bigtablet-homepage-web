import { act, renderHook } from "@testing-library/react";
import type { FieldErrors, UseFormReturn } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// --- mocks ---
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

const mockToast = { warning: vi.fn(), success: vi.fn(), error: vi.fn() };
vi.mock("@bigtablet/design-system", () => ({
	useToast: () => mockToast,
}));

const mockMutateAsync = vi.fn();
vi.mock("src/features/recruit/mutation/recruit.mutation", () => ({
	useRecruitApplyMutation: () => ({
		mutateAsync: mockMutateAsync,
		isPending: false,
	}),
}));

import type { ApplyFormValues } from "src/features/recruit/apply/form/model/apply.schema";
import { useApplySubmit } from "src/features/recruit/apply/form/model/use-apply-submit";

/** 기본 폼 값 */
const baseValues: ApplyFormValues = {
	jobId: 1,
	name: "홍길동",
	phoneNumber: "010-1234-5678",
	email: "test@example.com",
	address: "서울시 강남구",
	addressDetail: "",
	portfolio: "https://portfolio.example.com",
	coverLetter: "",
	profileImage: "https://image.example.com/profile.jpg",
	educationLevel: "BACHELOR",
	schoolName: "한국대학교",
	admissionYear: "2020",
	graduationEnd: "2024",
	department: "컴퓨터공학과",
	military: "COMPLETED",
	attachment1: "",
	attachment2: "",
	attachment3: "",
};

/** mock form 헬퍼 — handleSubmit이 onValid / onInvalid를 즉시 호출 */
const makeMockForm = (
	overrides?: Partial<ApplyFormValues>,
	triggerInvalid?: FieldErrors<ApplyFormValues>,
) => {
	const values = { ...baseValues, ...overrides };
	return {
		handleSubmit:
			(
				onValid: (v: ApplyFormValues) => void,
				onInvalid?: (e: FieldErrors<ApplyFormValues>) => void,
			) =>
			async () => {
				if (triggerInvalid) {
					onInvalid?.(triggerInvalid);
				} else {
					await onValid(values);
				}
			},
		setValue: vi.fn(),
	} as unknown as UseFormReturn<ApplyFormValues>;
};

describe("useApplySubmit", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("onValid", () => {
		it("이메일 미인증 시 warning 토스트를 표시하고 mutation을 호출하지 않는다", async () => {
			const form = makeMockForm();
			const { result } = renderHook(() =>
				useApplySubmit({ form, jobId: 1, emailVerified: false }),
			);

			await act(() => result.current.onSubmit());

			expect(mockToast.warning).toHaveBeenCalledWith(
				"이메일 인증을 완료해주세요.",
			);
			expect(mockMutateAsync).not.toHaveBeenCalled();
		});

		it("검정고시(GED) 학력 선택 시 학교 관련 필드를 초기화한다", async () => {
			const gedValues = { ...baseValues, educationLevel: "GED" as const };
			let capturedValues: ApplyFormValues | null = null;

			const form = {
				handleSubmit: (onValid: (v: ApplyFormValues) => void) => async () => {
					await onValid(gedValues);
				},
				setValue: vi.fn(),
			} as unknown as UseFormReturn<ApplyFormValues>;

			mockMutateAsync.mockImplementation((payload: ApplyFormValues) => {
				capturedValues = payload;
				return Promise.resolve();
			});

			const { result } = renderHook(() =>
				useApplySubmit({ form, jobId: 1, emailVerified: true }),
			);

			await act(() => result.current.onSubmit());

			expect(capturedValues).not.toBeNull();
			expect((capturedValues as unknown as ApplyFormValues).schoolName).toBe(
				"",
			);
			expect((capturedValues as unknown as ApplyFormValues).graduationEnd).toBe(
				"",
			);
			expect((capturedValues as unknown as ApplyFormValues).department).toBe(
				"",
			);
		});

		it("mutation 성공 시 success 토스트를 표시하고 /recruit으로 이동한다", async () => {
			mockMutateAsync.mockResolvedValue(undefined);

			const form = makeMockForm();
			const { result } = renderHook(() =>
				useApplySubmit({ form, jobId: 42, emailVerified: true }),
			);

			await act(() => result.current.onSubmit());

			expect(mockToast.success).toHaveBeenCalledWith("지원이 완료되었습니다.");
			expect(mockPush).toHaveBeenCalledWith("/recruit");
		});

		it("mutation 실패 시 error 토스트를 표시한다", async () => {
			mockMutateAsync.mockRejectedValue(new Error("서버 오류"));

			const form = makeMockForm();
			const { result } = renderHook(() =>
				useApplySubmit({ form, jobId: 1, emailVerified: true }),
			);

			await act(() => result.current.onSubmit());

			expect(mockToast.error).toHaveBeenCalledWith(
				"지원 중 문제가 발생했습니다.",
			);
			expect(mockPush).not.toHaveBeenCalled();
		});
	});

	describe("onInvalid", () => {
		it("폼 에러가 있으면 첫 번째 에러 메시지를 error 토스트로 표시한다", async () => {
			const errors: FieldErrors<ApplyFormValues> = {
				name: { type: "required", message: "이름을 입력해주세요." },
			};
			const form = makeMockForm(undefined, errors);
			const { result } = renderHook(() =>
				useApplySubmit({ form, jobId: 1, emailVerified: true }),
			);

			await act(() => result.current.onSubmit());

			expect(mockToast.error).toHaveBeenCalledWith("이름을 입력해주세요.");
		});

		it("에러 메시지가 없으면 기본 메시지를 표시한다", async () => {
			const errors: FieldErrors<ApplyFormValues> = {
				name: { type: "required" },
			};
			const form = makeMockForm(undefined, errors);
			const { result } = renderHook(() =>
				useApplySubmit({ form, jobId: 1, emailVerified: true }),
			);

			await act(() => result.current.onSubmit());

			expect(mockToast.error).toHaveBeenCalledWith("입력값을 확인해주세요.");
		});
	});
});
