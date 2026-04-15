"use client";

import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BackLink from "src/shared/ui/back-link";
import styles from "./style.module.scss";

interface Props {
	content: string;
}

/** 정책 페이지 마크다운 렌더링 컴포넌트 */
const PolicyContent = ({ content }: Props) => {
	const t = useTranslations("common");

	return (
		<div className={styles.policy}>
			<BackLink href="/main" label={t("backToHome")} />
			<div className={styles.policy_body}>
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
			</div>
		</div>
	);
};

export default PolicyContent;
