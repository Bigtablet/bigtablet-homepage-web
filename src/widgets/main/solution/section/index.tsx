"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { buildInitialSelected } from "src/widgets/main/solution/model/select.util";
import { POSTERS, type Product, SOURCES } from "src/widgets/main/solution/model/video-sources";
import Card from "../card";
import Modal from "../modal";
import styles from "./style.module.scss";
import { useSolutionModal } from "./use-solution-modal";

/** SOURCES 키는 정적 — 렌더마다 재계산 불필요 */
const SORTED_IDS = Object.keys(SOURCES)
	.map(Number)
	.sort((a, b) => a - b);

/**
 * @component SolutionSection
 *
 * @description
 * 메인 페이지 솔루션 섹션. 제품 카드 그리드와 상세 모달을 렌더링하며
 * 모달 애니메이션/네비게이션은 useSolutionModal hook이 담당.
 *
 * @see {@link Modal} 제품 상세 모달
 * @see {@link Card} 제품 카드
 * @see {@link useSolutionModal} 모달 상태/애니메이션 hook
 */
const SolutionSection = () => {
	const t = useTranslations("main.solution");
	const [selected, setSelected] = useState<Record<number, string>>({});

	useEffect(() => setSelected(buildInitialSelected()), []);

	const products: Product[] = useMemo(
		() =>
			SORTED_IDS.map((id) => ({ id, src: selected[id] ?? SOURCES[id][0], poster: POSTERS[id] })),
		[selected],
	);

	const {
		activeId,
		current,
		ghost,
		sliding,
		animVars,
		isEntering,
		blockBackdropClose,
		openFromRect,
		closeNow,
		scheduleClose,
		go,
	} = useSolutionModal(products);

	return (
		<section className={styles.solution} aria-labelledby="solution_title">
			<p id="solution_title" className={styles.solution_title}>
				{t("title")}
			</p>

			<div className={styles.solution_grid}>
				{products.map(({ id, src, poster }) => (
					<Card
						key={id}
						id={id}
						src={src}
						poster={poster}
						label={t(`product.${id}.cardTitle`)}
						onOpen={openFromRect}
					/>
				))}
			</div>

			{activeId && current && (
				<Modal
					current={current}
					ghost={ghost}
					sliding={sliding ? { dir: sliding.dir } : null}
					animVars={animVars}
					isEntering={!!(animVars && isEntering)}
					blockBackdropClose={blockBackdropClose}
					prev={() => go("prev")}
					next={() => go("next")}
					close={closeNow}
					scheduleClose={scheduleClose}
				/>
			)}
		</section>
	);
};

export default SolutionSection;
