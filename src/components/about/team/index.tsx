"use client";

import { useTranslations } from "next-intl";
import MemberCard, { MemberKey } from "src/components/about/team/card";
import "./style.scss";

const DEFAULT_ORDER: MemberKey[] = ["CEO", "CTO", "PM", "BE", "FE"];

interface TeamProps {
    order?: MemberKey[];
}

const Team = ({ order = DEFAULT_ORDER }: TeamProps) => {
    const t = useTranslations("about.team");

    return (
        <section className="team">
            <header className="team__head">
                <h2 className="team__title">{t("title")}</h2>
                {t.has("description") && <p className="team__desc">{t("description")}</p>}
            </header>

            <div className="team__grid">
                {order.map((key) => (
                    <MemberCard key={key} memberKey={key} />
                ))}
            </div>
        </section>
    );
};

export default Team;