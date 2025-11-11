"use client";

import "./style.scss";
import Frame from "src/widgets/layout/template";

import History from "src/widgets/about/history/ui";
import Team from "src/widgets/about/team";
import type { HistoryItemType } from "src/widgets/about/history/type";
import { useMessages } from "next-intl";
import Introduce from "src/widgets/about/introduce/ui";

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
        <Frame>
            <Introduce sectionKey="section1" />
            <Introduce sectionKey="section2" reverse />
            <History items={items} />
            <Team />
        </Frame>
    );
};

export default About;