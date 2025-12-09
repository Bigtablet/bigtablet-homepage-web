"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
    MEMBER_TO_SLUG,
    type MemberKey,
} from "src/entities/about/model/util/member.util";
import styles from "./style.module.scss";
import {BigtabletLink} from "src/shared/hooks/link";

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
        <BigtabletLink href={href} className={styles.member_card} aria-label={`${name} 상세보기`}>
            <div className={styles.member_card_image} aria-hidden>
                <Image
                    src={imageSrc}
                    alt={name}
                    width={240}
                    height={300}
                    sizes="(max-width:768px) 50vw, 240px"
                />
            </div>

            <p className={styles.member_card_position}>{position}</p>
            <h3 className={styles.member_card_name}>{name}</h3>
            <p className={styles.member_card_desc}>{description}</p>
        </BigtabletLink>
    );
};

export default MemberCard;