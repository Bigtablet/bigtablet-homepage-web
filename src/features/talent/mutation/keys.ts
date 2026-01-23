export const talentMutationKeys = {
	all: ["talent"] as const,
	list: () => [...talentMutationKeys.all, "list"] as const,
	create: () => [...talentMutationKeys.all, "create"] as const,
};
