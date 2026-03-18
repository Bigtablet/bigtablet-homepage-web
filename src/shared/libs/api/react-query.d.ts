/**
 * @description
 * React Query module augmentation for mutation metadata type safety.
 * Allows mutations to include custom meta properties for error/success handling.
 */

import "@tanstack/react-query";

declare module "@tanstack/react-query" {
	interface Register {
		mutationMeta: {
			/**
			 * Error message displayed in toast on mutation failure.
			 * Server error message takes precedence over this fallback.
			 */
			errorMessage?: string;

			/**
			 * Success message displayed in toast on mutation completion.
			 */
			successMessage?: string;

			/**
			 * Skip automatic global error toast handling.
			 */
			skipGlobalErrorToast?: boolean;
		};
	}
}
