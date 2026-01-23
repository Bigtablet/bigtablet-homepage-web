export const recruitMutationKeys = {
	all: ["recruit"] as const,
	apply: () => [...recruitMutationKeys.all, "apply"] as const,
};
