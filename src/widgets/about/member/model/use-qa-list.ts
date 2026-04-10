import type { MemberKey } from "src/entities/about/util/member.util";

export interface QAItem {
	q: string;
	a: string;
}

export interface TranslationAccessor {
	get: (k: string) => string;
	has: (k: string) => boolean;
}

export const QaList = (t: TranslationAccessor, memberKey: MemberKey, max = 20): QAItem[] => {
	const base = `about.team.members.${memberKey}`;
	return Array.from({ length: max }, (_, i) => i + 1)
		.map((n) => ({ qKey: `${base}.qa${n}.q`, aKey: `${base}.qa${n}.a` }))
		.filter(({ qKey, aKey }) => t.has(qKey) && t.has(aKey))
		.map(({ qKey, aKey }) => ({ q: t.get(qKey), a: t.get(aKey) }));
};
