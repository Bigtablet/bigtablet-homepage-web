/**
 * @description
 * 파일 업로드 검증 유틸리티
 *
 * - `validateFileSize`: 파일 크기 검증 (기본 50MB)
 * - `validateFileType`: 파일 MIME 타입 검증
 * - `validateFile`: 크기 + 타입 통합 검증
 */

/** 기본 최대 파일 크기 (50MB) */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/** 허용 파일 타입 */
export const ALLOWED_FILE_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.ms-powerpoint",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"application/zip",
	"application/x-zip-compressed",
] as const;

export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];

export interface FileValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * @description
 * 파일 크기 검증
 *
 * @param file - 검증할 파일
 * @param maxSize - 최대 크기 (기본 50MB)
 */
export const validateFileSize = (
	file: File,
	maxSize: number = MAX_FILE_SIZE,
): FileValidationResult => {
	if (file.size > maxSize) {
		const maxSizeMB = Math.round(maxSize / (1024 * 1024));
		return {
			valid: false,
			error: `파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`,
		};
	}
	return { valid: true };
};

/**
 * @description
 * 파일 타입 검증
 *
 * @param file - 검증할 파일
 * @param allowedTypes - 허용 타입 목록 (기본: ALLOWED_FILE_TYPES)
 */
export const validateFileType = (
	file: File,
	allowedTypes: readonly string[] = ALLOWED_FILE_TYPES,
): FileValidationResult => {
	if (!allowedTypes.includes(file.type)) {
		return {
			valid: false,
			error: "허용되지 않는 파일 형식입니다.",
		};
	}
	return { valid: true };
};

/**
 * @description
 * 파일 검증 (크기 + 타입)
 *
 * @param file - 검증할 파일
 * @param options - 검증 옵션
 */
export const validateFile = (
	file: File,
	options?: {
		maxSize?: number;
		allowedTypes?: readonly string[];
	},
): FileValidationResult => {
	const sizeResult = validateFileSize(file, options?.maxSize);
	if (!sizeResult.valid) return sizeResult;

	const typeResult = validateFileType(file, options?.allowedTypes);
	if (!typeResult.valid) return typeResult;

	return { valid: true };
};
