import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { isMemberSlug } from "src/entities/about/util/member.util";
import MemberDetailClient from "./client";

type PageProps = {
	params: { id: string };
};

/** 멤버 상세 동적 메타데이터 */
export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { id } = params;
	if (!isMemberSlug(id)) return {};

	try {
		const messages = await getMessages();
		const about = (messages as Record<string, unknown>)?.about as
			| Record<string, unknown>
			| undefined;
		const team = about?.team as Record<string, unknown> | undefined;
		const members = team?.members as
			| Record<string, Record<string, unknown>>
			| undefined;
		const member = members?.[id];
		if (!member) return {};

		const name = member.name as string;
		const position = member.position as string;
		const description = member.description as string | undefined;
		const image = member.image as string | undefined;

		const title = `${name} - ${position} | Bigtablet`;

		return {
			title,
			description: description ?? `${name}, ${position} at Bigtablet`,
			openGraph: {
				title,
				description: description ?? `${name}, ${position} at Bigtablet`,
				type: "profile",
				...(image ? { images: [{ url: image }] } : {}),
			},
			twitter: {
				card: "summary",
				title,
				description: description ?? `${name}, ${position} at Bigtablet`,
				...(image ? { images: [image] } : {}),
			},
		};
	} catch {
		return {};
	}
};

const MemberDetailPage = async () => {
	return <MemberDetailClient />;
};

export default MemberDetailPage;
