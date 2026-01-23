export const uploadMutationKeys = {
	all: ["upload"] as const,
	gcp: () => [...uploadMutationKeys.all, "gcp"] as const,
};
