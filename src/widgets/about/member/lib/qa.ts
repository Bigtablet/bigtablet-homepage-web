import {MemberKey} from "src/entities/about/member/model/member.model";


export interface QAItem { q: string; a: string }

export const QaList = (
    t: { (k: string): string; has: (k: string) => boolean },
    memberKey: MemberKey,
    max = 20
): QAItem[] => {
    const base = `about.team.members.${memberKey}`;
    return Array.from({ length: max }, (_, i) => i + 1)
        .map(n => ({ qKey: `${base}.qa${n}.q`, aKey: `${base}.qa${n}.a` }))
        .filter(({ qKey, aKey }) => t.has(qKey) && t.has(aKey))
        .map(({ qKey, aKey }) => ({ q: t(qKey), a: t(aKey) }));
};