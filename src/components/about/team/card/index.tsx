"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { MEMBER_SLUG_MAP, type MemberKey } from "src/types/member/member.type";
import "./style.scss";

interface MemberCardProps { memberKey: MemberKey }

const MemberCard = ({ memberKey }: MemberCardProps) => {
    const t = useTranslations("about.team.members");
    const router = useRouter();
    const locale = useLocale();

    const slug = MEMBER_SLUG_MAP[memberKey];

    return (
        <div className="member-card" onClick={() => router.push(`/about/${slug}`)}>
            <div className="member-card__image">
                <img src={`/images/member/${slug}.png`} alt={t(`${memberKey}.name`)} />
            </div>
            <p className="member-card__position">{t(`${memberKey}.position`)}</p>
            <h3 className="member-card__name">{t(`${memberKey}.name`)}</h3>
            <p className="member-card__desc">{t(`${memberKey}.description`)}</p>
        </div>
    );
};

export default MemberCard;