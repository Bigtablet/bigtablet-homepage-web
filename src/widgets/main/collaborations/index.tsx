"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import styles from "./style.module.scss";

const logos = [
	"/images/collaborations/google.png",
	"/images/collaborations/nvdia.png",
];

const GAP = 24;
const CARD_W = 260;

const Collaborations = ({ speed = 40 }: { speed?: number }) => {
	const t = useTranslations("main.collaboration");
	const ref = useRef<HTMLDivElement | null>(null);
	const [repeat, setRepeat] = useState(6);

	useEffect(() => {
		const calc = () => {
			const w = ref.current?.offsetWidth ?? 1200;
			const unit = CARD_W + GAP;
			const need = Math.max(4, Math.ceil((w * 2) / (logos.length * unit)));
			setRepeat(need);
		};
		calc();
		window.addEventListener("resize", calc);
		return () => window.removeEventListener("resize", calc);
	}, []);

	const items = useMemo(
		() => Array.from({ length: repeat }).flatMap(() => logos),
		[repeat],
	);

	return (
		<section className={styles.collabs}>
			<h3 className={styles.collabs_title}>{t("title")}</h3>
			<div
				className={styles.collabs_viewport}
				ref={ref}
				style={{ "--gap": `${GAP}px` } as React.CSSProperties}
			>
				<Marquee gradient={false} speed={speed}>
					{items.map((src) => (
						<div className={styles.collabs_item} key={src}>
							<div className={styles.collabs_card}>
								<Image
									src={src}
									alt=""
									width={260}
									height={60}
									sizes="160px"
									priority={i < 4}
									draggable={false}
								/>
							</div>
						</div>
					))}
				</Marquee>
			</div>
		</section>
	);
};

export default Collaborations;
