"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import ImageThumb from "src/shared/ui/image-thumb";
import styles from "./style.module.scss";

interface AboutSchema {
	sectionKey: string;
	reverse?: boolean;
}

const Introduce = ({ sectionKey, reverse = false }: AboutSchema) => {
	const t = useTranslations("about.top");

	return (
		<section className={clsx(styles.introduce, reverse && styles.introduce_reverse)}>
			<div className={styles.introduce_text}>
				<p className={styles.introduce_title}>{t(`${sectionKey}.title`)}</p>
				<p className={styles.introduce_desc}>{t(`${sectionKey}.description`)}</p>
			</div>
			<div className={styles.introduce_image} aria-hidden="true">
				{/* ImageThumb 가 loading shimmer + 공간 예약. 이전엔 raw Image 가 .introduce_img 의
				    width:auto / height:auto 와 충돌해 로드 전 0 size 로 붕괴 → layout shift 발생.
				    container 의 aspect-ratio 가 슬롯을 고정한다. */}
				<ImageThumb
					src="/images/logo/img.webp"
					alt="Bigtablet 로고"
					sizes="(max-width: 768px) 280px, 420px"
					className={styles.introduce_img}
				/>
			</div>
		</section>
	);
};

export default Introduce;
