import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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
	/* i18n/request.ts 가 NEXT_LOCALE 쿠키 기반으로 locale 결정 → getMessages 가 올바른 messages 반환. */
	const locale = await getLocale();
	const messages = (await getMessages()) as Record<string, unknown>;
	const about = messages?.about as Record<string, unknown> | undefined;
	const aboutHistory = about?.history ?? {};

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
		/* layout 에서 `about` namespace 를 제외했으므로 about 페이지에서만 full messages 로 다시 wrap.
		   이 nested provider 의 children 에서 useTranslations("about.*") 가 동작. */
		<NextIntlClientProvider locale={locale} messages={messages}>
			<Introduce sectionKey="section1" />
			<Introduce sectionKey="section2" reverse />
			<History items={items} />
			<Team />
		</NextIntlClientProvider>
	);
};

export default About;
