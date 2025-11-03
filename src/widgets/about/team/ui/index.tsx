"use client";

import {useTranslations} from "next-intl";
import MemberCard from "src/widgets/about/member/ui/card";
import "./style.scss";
import {TeamProps} from "src/widgets/about/team/type";
import {MEMBER_DEFAULT_ORDER} from "src/entities/about/member/model/member.model";

const Team = ({order = MEMBER_DEFAULT_ORDER}: TeamProps) => {
    const t = useTranslations("about.team");

    return (
        <section id="team" className="team" aria-labelledby="team__title">
            <h2 className="team__title">{t("title")}</h2>
            <div className="team__grid">
                {order.map((key) => (
                    <MemberCard key={key} memberKey={key}/>
                ))}
            </div>
        </section>
    );
};

export default Team;