/**
 * @description
 * react-markdown 공용 컴포넌트 매핑. 본문/리스트에 디자인 토큰 기반 스타일을 적용한다.
 */

import type React from "react";
import styles from "./style.module.scss";

/** 주입된 className 을 잃지 않도록 스타일 클래스와 병합한다. */
const cx = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" ");

export const markdownComponents = {
	p: ({ className, ...props }: React.ComponentProps<"p">) => (
		<p {...props} className={cx(styles.markdown_text, className)} />
	),
	ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
		<ul {...props} className={cx(styles.markdown_list, className)} />
	),
	ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
		<ol {...props} className={cx(styles.markdown_list, className)} />
	),
	li: (props: React.ComponentProps<"li">) => <li {...props} />,
};
