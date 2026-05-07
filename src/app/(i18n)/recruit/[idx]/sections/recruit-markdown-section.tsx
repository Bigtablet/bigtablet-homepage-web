/**
 * @description
 * Markdown content section component for recruit details.
 */

import dynamic from "next/dynamic";
import remarkBreaks from "remark-breaks";
import { markdownComponents } from "../markdown-components";
import styles from "../style.module.scss";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

/**
 * Props for RecruitMarkdownSection component.
 */
interface RecruitMarkdownSectionProps {
	/**
	 * Section title heading.
	 */
	title: string;

	/**
	 * Markdown content to render.
	 */
	content: string;
}

/**
 * Renders a section with markdown-formatted content.
 */
export const RecruitMarkdownSection = ({ title, content }: RecruitMarkdownSectionProps) => (
	<section className={styles.recruit_detail_section}>
		<h2>{title}</h2>
		<ReactMarkdown remarkPlugins={[remarkBreaks]} components={markdownComponents}>
			{content}
		</ReactMarkdown>
	</section>
);
