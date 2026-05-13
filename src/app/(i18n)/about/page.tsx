import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import type { HistorySchema } from "src/entities/about/history/schema/history.schema";
import { resolveLocale } from "src/shared/libs/locale";
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
	const locale = resolveLocale(store.get("NEXT_LOCALE")?.value);

	let messages: Record<string, unknown> = {};
	let aboutHistory: unknown = {};
	try {
		messages = (await import(`../../../../messages/${locale}.json`)).default;
		const about = messages?.about as Record<string, unknown> | undefined;
		aboutHistory = about?.history ?? {};
	} catch {
		messages = {};
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
