/**
 * @description
 * Custom markdown components for recruit detail page.
 */

import type React from "react";
import styles from "./style.module.scss";

/**
 * Markdown component configuration for rendering recruit detail content.
 */
export const markdownComponents = {
	p: (props: React.ComponentProps<"p">) => (
		<p {...props} className={styles.recruit_detail_text} />
	),
	ul: (props: React.ComponentProps<"ul">) => (
		<ul {...props} className={styles.recruit_detail_list} />
	),
	ol: (props: React.ComponentProps<"ol">) => (
		<ol {...props} className={styles.recruit_detail_list} />
	),
	li: (props: React.ComponentProps<"li">) => <li {...props} />,
};
