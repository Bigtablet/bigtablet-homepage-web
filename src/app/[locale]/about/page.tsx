"use client";

import "./style.scss";
import Template from "src/components/common/template";
import Introduce from "src/components/about/introduce";
import {HistoryItemType} from "src/types/about/history.type";
import History from "src/components/about/history";
import Team from "src/components/about/team";

const SAMPLE: HistoryItemType[] = [
    { id: "2025-03", year: 2025, title: "Opened new R&D Center", dateLabel: "Mar 2025" },
    { id: "2024-11", year: 2024, title: "Series A Funding", description: "Global VC participation", dateLabel: "Nov 2024" },
    { id: "2024-06", year: 2024, title: "Launched v2 Platform", dateLabel: "Jun 2024" },
    { id: "2023-08", year: 2023, title: "Reached 1M MAU", dateLabel: "Aug 2023" },
    { id: "2022-01", year: 2022, title: "Company Founded", description: "Seoul, Korea", dateLabel: "Jan 2022" },
];

const About = () => {
    return (
        <Template>
            <Introduce sectionKey="section1" />
            <Introduce sectionKey="section2" reverse />
            <History items={SAMPLE} />
            <Team />
        </Template>
    )
}

export default About;