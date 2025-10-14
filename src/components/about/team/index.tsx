"use client";

import { useTranslations } from "next-intl";
import MemberCard from "src/components/about/team/card";
import type { MemberKey } from "src/types/member/member.type";
import "./style.scss";

const DEFAULT_ORDER: MemberKey[] = ["CEO", "CTO", "Manage", "PM", "BE", "FE"];

interface TeamProps {
    order?: MemberKey[];
}

const Team = ({ order = DEFAULT_ORDER }: TeamProps) => {
    const t = useTranslations("about.team");

    return (
        <section className="team">
            <div className="team__grid">
                {order.map((key) => (
                    <MemberCard key={key} memberKey={key} />
                ))}
            </div>
        </section>
    );
};

export default Team;