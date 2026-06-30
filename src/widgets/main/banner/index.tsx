import { Button } from "@bigtablet/design-system";
import { useTranslations } from "next-intl";
import BgFx from "src/shared/ui/bg-fx";
import Eyebrow from "src/shared/ui/eyebrow";
import styles from "./style.module.scss";

const SPEC_IDS = ["1", "2", "3", "4"] as const;

/**
 * @component Banner
 *
 * @description
 * 메인 페이지 상단 히어로 배너. 임시 디자인 풀 이식 —
 * 동영상 대신 BgFx(vision) 캔버스 모션그래픽을 배경에 깔고, 그 위에 히어로 카피를 올린다.
 * eyebrow + 하이라이트 헤드라인 + 서브 + 스펙 칩.
 */
const Banner = () => {
	const t = useTranslations("main.banner");
	const title = t("title");
	const highlight = t("titleHighlight");
	const [before, after] = title.includes(highlight)
		? [
				title.slice(0, title.indexOf(highlight)),
				title.slice(title.indexOf(highlight) + highlight.length),
			]
		: [title, ""];

	return (
		<section className={styles.banner} aria-labelledby="banner_title">
			<BgFx variant="vision" opacity={0.95} className={styles.banner_fx} />

			<div className={styles.banner_content}>
				<Eyebrow>{t("eyebrow")}</Eyebrow>

				<h1 id="banner_title" className={styles.banner_title}>
					{before}
					<span className={styles.banner_title_hl}>{highlight}</span>
					{after}
				</h1>

				<p className={styles.banner_description}>{t("description")}</p>

				<div className={styles.banner_cta}>
					<a
						href="https://docs.google.com/forms/d/e/1FAIpQLSd0on7yADoLSWYFN0it0LtCii7ov1yLwIpM91lR66vtHtaEuQ/viewform"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button variant="filled" size="lg">
							{t("button")}
						</Button>
					</a>
					<a className={styles.banner_secondary} href="#how">
						{t("secondary")}
					</a>
				</div>

				<ul className={styles.banner_specs}>
					{SPEC_IDS.map((id) => (
						<li key={id} className={styles.banner_spec}>
							{t(`specs.${id}.label`)} <b>{t(`specs.${id}.value`)}</b>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default Banner;
