import {
	ALLOWED_FILE_TYPES,
	MAX_FILE_SIZE,
	validateFile,
	validateFileSize,
	validateFileType,
} from "src/shared/libs/file/validate";
import { describe, expect, it } from "vitest";

const makeFile = (sizeBytes: number, type: string, name = "test") =>
	new File([new ArrayBuffer(sizeBytes)], name, { type });

describe("validateFileSize", () => {
	it("크기 이하이면 valid: true", () => {
		const file = makeFile(1024, "application/pdf");
		expect(validateFileSize(file)).toEqual({ valid: true });
	});

	it("크기 초과이면 에러 메시지 반환", () => {
		const file = makeFile(MAX_FILE_SIZE + 1, "application/pdf");
		const result = validateFileSize(file);
		expect(result.valid).toBe(false);
		expect(result.error).toContain("MB");
	});

	it("커스텀 maxSize 적용", () => {
		const file = makeFile(1025, "application/pdf");
		const result = validateFileSize(file, 1024);
		expect(result.valid).toBe(false);
	});

	it("정확히 maxSize이면 valid: true", () => {
		const file = makeFile(MAX_FILE_SIZE, "application/pdf");
		expect(validateFileSize(file).valid).toBe(true);
	});
});

describe("validateFileType", () => {
	it("허용된 타입이면 valid: true", () => {
		const file = makeFile(100, "application/pdf");
		expect(validateFileType(file).valid).toBe(true);
	});

	it("허용되지 않는 타입이면 에러 반환", () => {
		const file = makeFile(100, "video/mp4");
		const result = validateFileType(file);
		expect(result.valid).toBe(false);
		expect(result.error).toBeTruthy();
	});

	it("커스텀 허용 타입 목록 적용", () => {
		const file = makeFile(100, "video/mp4");
		expect(validateFileType(file, ["video/mp4"]).valid).toBe(true);
	});

	it("ALLOWED_FILE_TYPES 목록 전체 허용 검증", () => {
		for (const type of ALLOWED_FILE_TYPES) {
			const file = makeFile(100, type);
			expect(validateFileType(file).valid).toBe(true);
		}
	});
});

describe("validateFile", () => {
	it("크기와 타입 모두 통과하면 valid: true", () => {
		const file = makeFile(1024, "application/pdf");
		expect(validateFile(file)).toEqual({ valid: true });
	});

	it("크기 초과 시 크기 에러 우선 반환", () => {
		const file = makeFile(MAX_FILE_SIZE + 1, "application/pdf");
		const result = validateFile(file);
		expect(result.valid).toBe(false);
		expect(result.error).toContain("MB");
	});

	it("타입 불일치 시 타입 에러 반환", () => {
		const file = makeFile(100, "video/mp4");
		const result = validateFile(file);
		expect(result.valid).toBe(false);
		expect(result.error).toBeTruthy();
	});

	it("options로 maxSize와 allowedTypes 동시 지정", () => {
		const file = makeFile(500, "video/mp4");
		const result = validateFile(file, {
			maxSize: 1000,
			allowedTypes: ["video/mp4"],
		});
		expect(result.valid).toBe(true);
	});
});
