"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "src/shared/hooks/use-scroll-reveal";
import styles from "./style.module.scss";

interface AboutSchema {
	sectionKey: string;
	reverse?: boolean;
}

const Introduce = ({ sectionKey, reverse = false }: AboutSchema) => {
	const t = useTranslations("about.top");
	const sectionRef = useScrollReveal<HTMLElement>(undefined, {
		variant: reverse ? "slide-right" : "slide-left",
	});

	return (
		<section
			ref={sectionRef}
			className={clsx(styles.introduce, reverse && styles.introduce_reverse)}
		>
			<div className={styles.introduce_text}>
				<p className={styles.introduce_title}>{t(`${sectionKey}.title`)}</p>
				<p className={styles.introduce_desc}>
					{t(`${sectionKey}.description`)}
				</p>
			</div>
			<div className={styles.introduce_image} aria-hidden="true">
				<Image
					src="/images/logo/img.png"
alt="Bigtablet 로고"
					width={420}
					height={420}
					className={styles.introduce_img}
				/>
			</div>
		</section>
	);
};

export default Introduce;
