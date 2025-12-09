"use client";

import { useTranslations } from "next-intl";
import MemberCard from "src/widgets/about/member/ui/card";
import styles from "./style.module.scss";
import type { MemberKey } from "src/entities/about/member/model/util/member.util";
import { MEMBER_DEFAULT_ORDER } from "src/entities/about/member/model/util/member.util";

interface TeamProps {
    order?: MemberKey[];
}

const Team = ({ order = MEMBER_DEFAULT_ORDER }: TeamProps) => {
    const t = useTranslations("about.team");

    return (
        <section id="team" className={styles.team} aria-labelledby="team__title">
            <h2 id="team__title" className={styles.team_title}>
                {t("title")}
            </h2>
            <div className={styles.team_grid}>
                {order.map((key) => (
                    <MemberCard key={key} memberKey={key} />
                ))}
            </div>
        </section>
    );
};

export default Team;