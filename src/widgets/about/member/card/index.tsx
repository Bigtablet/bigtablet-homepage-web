"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { MemberSlug } from "src/entities/about/model/util/member.util";
import styles from "./style.module.scss";
import { BigtabletLink } from "src/shared/hooks/link";

type MemberCardProps = { memberSlug: MemberSlug };

const MemberCard = ({ memberSlug }: MemberCardProps) => {
    const t = useTranslations("about.team.members");

    const name = t(`${memberSlug}.name`);
    const position = t(`${memberSlug}.position`);
    const description = t(`${memberSlug}.description`);
    const imageSrc = t(`${memberSlug}.image`);
    const href = `/about/${memberSlug}`;

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