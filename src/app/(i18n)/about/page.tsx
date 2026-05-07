import { cookies } from "next/headers";
import type { HistorySchema } from "src/entities/about/history/schema/history.schema";
import History from "src/widgets/about/history";
import Introduce from "src/widgets/about/introduce";
import Team from "src/widgets/about/team";
import { z } from "zod";

const historyItemSchema = z.union([
	z.string(),
	z.object({
		title: z.string(),
		id: z.string().optional(),
		description: z.string().optional(),
		dateLabel: z.string().optional(),
	}),
]);

const historyByYearSchema = z.record(z.string(), z.array(historyItemSchema));

const About = async () => {
	/**
	 * (i18n) layout과 동일하게 NEXT_LOCALE 쿠키 기반으로 직접 import.
	 * getMessages()는 middleware가 next-intl routing을 안 쓰는 환경에서
	 * defaultLocale로 fallback되는 문제가 있음.
	 */
	const store = await cookies();
	const localeValue = store.get("NEXT_LOCALE")?.value?.toLowerCase();
	const locale = localeValue?.startsWith("en") ? "en" : "ko";

	let aboutHistory: unknown = {};
	try {
		const messages = (await import(`../../../../messages/${locale}.json`)).default;
		aboutHistory = messages?.about?.history ?? {};
	} catch {
		aboutHistory = {};
	}

	const parsed = historyByYearSchema.safeParse(aboutHistory);
	const historyByYear = parsed.success ? parsed.data : {};

	const items: HistorySchema[] = Object.entries(historyByYear).flatMap(([year, list]) =>
		list.map((entry, idx) => {
			const obj = typeof entry === "string" ? { title: entry } : entry;
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
