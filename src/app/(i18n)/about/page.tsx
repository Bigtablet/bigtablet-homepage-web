"use client";

import "./style.scss";
import Template from "src/components/common/template";
import Introduce from "src/components/about/introduce";
import History from "src/components/about/history";
import Team from "src/components/about/team";
import type { HistoryItemType } from "src/types/about/history.type";
import { useMessages } from "next-intl";

type HistoryRawItem =
    | string
    | { title: string; id?: string; description?: string; dateLabel?: string };

const About = () => {
    const messages = useMessages() as any;
    const historyByYear = (messages?.about?.history ?? {}) as Record<string, HistoryRawItem[]>;

    const items: HistoryItemType[] = Object.entries(historyByYear).flatMap(
        ([year, list]) =>
            (Array.isArray(list) ? list : []).map((it, idx) => {
                const obj = typeof it === "string" ? { title: it } : it;
                const id = obj.id ?? `${year}-${String(idx + 1).padStart(2, "0")}`;
                return {
                    id,
                    year: Number(year),
                    title: obj.title,
                    description: obj.description,
                    dateLabel: obj.dateLabel
                };
            })
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