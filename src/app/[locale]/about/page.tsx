"use client";

import "./style.scss";
import Template from "src/components/common/template";
import Introduce from "src/components/about/introduce";
import History from "src/components/about/history";
import Team from "src/components/about/team";
import type { HistoryItemType } from "src/types/about/history.type";
import { useMessages } from "next-intl";

type HistoryRaw = {
    id: string;
    title: string;
    description?: string;
    dateLabel?: string;
};

const About = () => {
    const messages = useMessages() as any;

    const historyByYear = (messages?.about?.history ?? {}) as Record<string, HistoryRaw[]>;

    const items: HistoryItemType[] = Object.entries(historyByYear).flatMap(
        ([year, list]) =>
            (Array.isArray(list) ? list : []).map((it) => ({
                id: it.id,
                year: Number(year),
                title: it.title,
                description: it.description,
                dateLabel: it.dateLabel,
            }))
    );

    return (
        <Template>
            <Introduce sectionKey="section1" />
            <Introduce sectionKey="section2" reverse />
            <History items={items} />
            <Team />
        </Template>
    );
};

export default About;