/**
 * @description
 * react-markdown 공용 컴포넌트 매핑. 본문/리스트에 디자인 토큰 기반 스타일을 적용한다.
 */

import type React from "react";
import styles from "./style.module.scss";

export const markdownComponents = {
	p: (props: React.ComponentProps<"p">) => <p {...props} className={styles.markdown_text} />,
	ul: (props: React.ComponentProps<"ul">) => <ul {...props} className={styles.markdown_list} />,
	ol: (props: React.ComponentProps<"ol">) => <ol {...props} className={styles.markdown_list} />,
	li: (props: React.ComponentProps<"li">) => <li {...props} />,
};
