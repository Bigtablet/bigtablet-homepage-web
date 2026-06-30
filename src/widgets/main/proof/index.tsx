"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "src/shared/hooks/use-reveal";
import BgFx from "src/shared/ui/bg-fx";
import Eyebrow from "src/shared/ui/eyebrow";
import styles from "./style.module.scss";

const TILE_IDS = ["1", "2", "3", "4"] as const;

/**
 * @component Proof (Validation & Momentum)
 *
 * @description
 * "검증 & 모멘텀" — 시드 단계 신호를 4타일로 보여준다(매출 막대 제거).
 * FIELD 현장실증 / BACKED Antler·Plug and Play / IP·STD / PROGRAMS.
 * 자본 효율성은 한 줄 노트로만. 다크 그라운드 위 BgFx(signals) 배경.
 */
const Proof = () => {
	const t = useTranslations("main.proof");
	const { ref, visible } = useReveal<HTMLElement>();

	return (
		<section
			ref={ref}
			className={`${styles.proof} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="proof_title"
		>
			<BgFx variant="signals" />

			<div className={styles.proof_inner}>
				<div className={styles.proof_head}>
					<Eyebrow>{t("eyebrow")}</Eyebrow>
					<h2 id="proof_title" className={styles.proof_title}>
						{t("title")}
					</h2>
				</div>

				<ol className={styles.proof_tiles}>
					{TILE_IDS.map((id) => (
						<li
							key={id}
							className={`${styles.proof_tile} ${id === "2" ? styles.proof_tile_key : ""}`}
						>
							<span className={styles.proof_tile_n}>{t(`tiles.${id}.n`)}</span>
							<h3 className={styles.proof_tile_title}>{t(`tiles.${id}.title`)}</h3>
							<p className={styles.proof_tile_desc}>{t(`tiles.${id}.description`)}</p>
						</li>
					))}
				</ol>

				<p className={styles.proof_note}>{t("note")}</p>
			</div>
		</section>
	);
};

export default Proof;
