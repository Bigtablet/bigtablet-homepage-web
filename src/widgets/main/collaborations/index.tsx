"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";

const logos = ["/images/collaborations/google.webp", "/images/collaborations/nvdia.webp"];

/**
 * @component Collaborations
 *
 * @description
 * 메인 페이지 협력사 로고 마퀴 섹션.
 * CSS keyframe 애니메이션으로 무한 스크롤 구현 — react-fast-marquee 의존성 제거.
 */
const Collaborations = () => {
	const t = useTranslations("main.collaboration");

	// 무한 스크롤을 위해 로고 목록을 2배로 복제
	const items = [...logos, ...logos, ...logos, ...logos];

	return (
		<section className={styles.collabs}>
			<h3 className={styles.collabs_title}>{t("title")}</h3>
			<div className={styles.collabs_viewport}>
				<div className={styles.collabs_track}>
					{items.map((src, index) => (
						<div className={styles.collabs_item} key={`${src}-${index}`}>
							<div className={styles.collabs_card}>
								<Image
									src={src}
									alt=""
									width={260}
									height={60}
									sizes="160px"
									priority={index < 2}
									draggable={false}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Collaborations;
