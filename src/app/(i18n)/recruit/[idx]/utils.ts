/**
 * @description
 * Utility functions for recruit detail page.
 */

/**
 * Converts unknown value to finite number index or null.
 * @param value - Unknown value to convert
 * @returns Finite number or null
 */
export const toIdx = (value: unknown): number | null => {
	if (value === null || value === undefined) return null;
	const numberValue = Number(value);
	return Number.isFinite(numberValue) ? numberValue : null;
};

/**
 * Formats date string to display format (YYYY.MM.DD).
 * @param dateString - Date string to format
 * @returns Formatted date string or empty string if invalid
 */
export const formatDate = (dateString?: string): string => {
	if (!dateString) return "";
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return dateString;
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}.${month}.${day}`;
};
