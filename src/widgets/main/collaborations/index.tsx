"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";

const logos = ["/images/collaborations/google.webp", "/images/collaborations/nvdia.webp"];

/** 무한 스크롤용 복제 — 와이드 화면(4K 등)에서 트랙 절반이 뷰포트를 덮도록 충분히 반복 */
const items = Array.from({ length: 12 }, () => logos).flat();

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
					{items.map((src, index) => (
						<div className={styles.collabs_item} key={`${src}-${index}`}>
							<div className={styles.collabs_card}>
								<Image
									src={src}
									alt=""
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
