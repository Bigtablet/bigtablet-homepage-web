import { getToastRef, setToastRef } from "src/shared/libs/api/toast/toast-bridge";
import { describe, expect, it, vi } from "vitest";

describe("toast-bridge", () => {
	it("setToastRef로 저장한 참조를 getToastRef로 그대로 가져온다", () => {
		const ref = { error: vi.fn(), success: vi.fn(), info: vi.fn() };
		setToastRef(ref);
		const fetched = getToastRef();
		expect(fetched).toBe(ref);

		fetched?.error("err");
		fetched?.success("ok");
		fetched?.info("info");
		expect(ref.error).toHaveBeenCalledWith("err");
		expect(ref.success).toHaveBeenCalledWith("ok");
		expect(ref.info).toHaveBeenCalledWith("info");
	});

	it("setToastRef 재호출 시 최신 참조로 덮어쓴다", () => {
		const first = { error: vi.fn(), success: vi.fn(), info: vi.fn() };
		const second = { error: vi.fn(), success: vi.fn(), info: vi.fn() };
		setToastRef(first);
		setToastRef(second);
		expect(getToastRef()).toBe(second);
	});
});
