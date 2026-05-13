"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";

const logos = ["/images/collaborations/google.webp", "/images/collaborations/nvdia.webp"];

/** 무한 스크롤용 복제 — 4K(3840px) 폭까지 빈 공간 없이 채울 수 있는 8회 반복 (8 × 2 logos = 16 items). */
const items = Array.from({ length: 8 }, (_, repeatIdx) =>
	logos.map((src, logoIdx) => ({ src, key: `${repeatIdx}-${logoIdx}` })),
).flat();

/**
 * @component Collaborations
 *
 * @description
 * 메인 페이지 협력사 로고 마퀴 섹션.
 * CSS keyframe 애니메이션으로 무한 스크롤 구현 — react-fast-marquee 의존성 제거.
 */
const Collaborations = () => {
	const t = useTranslations("main.collaboration");

	return (
		<section className={styles.collabs}>
			<h3 className={styles.collabs_title}>{t("title")}</h3>
			<div className={styles.collabs_viewport}>
				<div className={styles.collabs_track}>
					{items.map(({ src, key }, index) => (
						<div className={styles.collabs_item} key={key}>
							<div className={styles.collabs_card}>
								<Image
									src={src}
									alt=""
									aria-hidden="true"
									width={260}
									height={60}
									sizes="(max-width: 768px) 180px, 280px"
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
