"use client";

import { useMessages } from "next-intl";
import type { HistorySchema } from "src/entities/about/history/schema/history.schema";
import History from "src/widgets/about/history";
import Introduce from "src/widgets/about/introduce";
import Team from "src/widgets/about/team";

type HistoryRawItem =
	| string
	| { title: string; id?: string; description?: string; dateLabel?: string };

const About = () => {
	const messages = useMessages() as Record<string, Record<string, unknown>>;
	const historyByYear = ((messages?.about as Record<string, unknown>)
		?.history ?? {}) as Record<string, HistoryRawItem[]>;

	const items: HistorySchema[] = Object.entries(historyByYear).flatMap(
		([year, list]) =>
			(Array.isArray(list) ? list : []).map((it, idx) => {
				const obj = typeof it === "string" ? { title: it } : it;
				const id = obj.id ?? `${year}-${String(idx + 1).padStart(2, "0")}`;
				return {
					id,
					year: Number(year),
					title: obj.title,
					description: obj.description,
					dateLabel: obj.dateLabel,
				};
			}),
	);

	return (
		<>
			<Introduce sectionKey="section1" />
			<Introduce sectionKey="section2" reverse />
			<History items={items} />
			<Team />
		</>
	);
};

export default About;
