"use client";

import styles from "./style.module.scss";

interface QAItem {
	q: string;
	a: string;
}

/**
 * @component Interview
 *
 * @description
 * 멤버 상세 페이지 인터뷰 Q&A 목록.
 *
 * @param props.items - Q&A 항목 배열
 */
const Interview = ({ items }: { items: QAItem[] }) => {
	return (
		<main className={styles.interview} aria-label="Interview">
			<div className={styles.interview_scroll}>
				{items.length > 0 ? (
					items.map((qaItem) => (
						<article className={styles.qa} key={qaItem.q}>
							<h3 className={styles.qa_q}>{qaItem.q}</h3>
							<p className={styles.qa_a}>{qaItem.a}</p>
						</article>
					))
				) : (
					<p className={styles.interview_empty}>No interview data available.</p>
				)}
			</div>
		</main>
	);
};

export default Interview;
