import {
	isMemberSlug,
	MEMBER_KEYS,
	MEMBER_ROLE,
} from "src/entities/about/util/member.util";
import { describe, expect, it } from "vitest";

describe("isMemberSlug", () => {
	it("유효한 멤버 슬러그는 true 반환", () => {
		for (const key of MEMBER_KEYS) {
			expect(isMemberSlug(key)).toBe(true);
		}
	});

	it("유효하지 않은 값은 false 반환", () => {
		expect(isMemberSlug("unknown")).toBe(false);
		expect(isMemberSlug("")).toBe(false);
		expect(isMemberSlug("admin")).toBe(false);
	});
});

describe("MEMBER_ROLE", () => {
	it("모든 MEMBER_KEYS에 대해 역할이 정의되어 있음", () => {
		for (const key of MEMBER_KEYS) {
			expect(MEMBER_ROLE[key]).toBeDefined();
		}
	});

	it("주요 역할 매핑 검증", () => {
		expect(MEMBER_ROLE.jiho).toBe("CEO");
		expect(MEMBER_ROLE.minho).toBe("CTO");
		expect(MEMBER_ROLE.sangmin).toBe("FE");
	});
});
