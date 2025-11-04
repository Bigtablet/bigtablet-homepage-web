"use client";

import "./style.scss";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
    MEMBER_TO_SLUG,
    type MemberKey,
} from "src/entities/about/member/model/member.model";

type MemberCardProps = { memberKey: MemberKey };

const MemberCard = ({ memberKey }: MemberCardProps) => {
    const t = useTranslations("about.team.members");

    const slug = MEMBER_TO_SLUG[memberKey];
    const name = t(`${memberKey}.name`);
    const position = t(`${memberKey}.position`);
    const description = t(`${memberKey}.description`);
    const imageSrc = `/images/member/${slug}.png`;

    const href = `/about/${slug}`;

    return (
        <Link href={href} className="member-card" aria-label={`${name} 상세보기`}>
            <div className="member-card__image" aria-hidden>
                <Image
                    src={imageSrc}
                    alt={name}
                    width={240}
                    height={300}
                    sizes="(max-width:768px) 50vw, 240px"
                />
            </div>

            <p className="member-card__position">{position}</p>
            <h3 className="member-card__name">{name}</h3>
            <p className="member-card__desc">{description}</p>
        </Link>
    );
};

export default MemberCard;