"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";

/**
 * @component Problem
 *
 * @description
 * 메인 페이지 문제 제기 섹션.
 * IntersectionObserver 로 뷰포트 진입 감지 → is_visible 클래스 부여 → CSS 애니메이션 트리거.
 * GSAP scroll-reveal 의 가벼운 대체 — 라이브러리 의존성 없음, 초기 번들에 GSAP 포함 안 됨.
 */
const Problem = () => {
	const t = useTranslations("main.problem");
	const sectionRef = useRef<HTMLElement | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = sectionRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setVisible(true);
						observer.disconnect();
						break;
					}
				}
			},
			{ threshold: 0.15 },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return (
		<section
			ref={sectionRef}
			className={`${styles.problem} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="problem_title"
		>
			<h2 id="problem_title" className={styles.problem_title}>
				{t("title")}
			</h2>
			<p className={styles.problem_description}>{t("description")}</p>
		</section>
	);
};

export default Problem;
