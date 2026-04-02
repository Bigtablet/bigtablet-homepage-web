"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildInitialSelected } from "src/widgets/main/solution/model/select.util";
import {
	type Product,
	SOURCES,
} from "src/widgets/main/solution/model/video-sources";
import Card from "../card";
import Modal from "../modal";
import styles from "./style.module.scss";

type SlideState = { dir: "next" | "prev"; nextId: number } | null;
type AnimVars = { dx: number; dy: number; sx: number; sy: number } | null;

/**
 * @component SolutionSection
 *
 * @description
 * 메인 페이지 솔루션 섹션.
 * 제품 카드 그리드와 상세 모달 열기/닫기 애니메이션을 관리한다.
 *
 * @see {@link Modal} 제품 상세 모달
 * @see {@link Card} 제품 카드
 */
const SolutionSection = () => {
	const t = useTranslations("main.solution");

	const [selected, setSelected] = useState<Record<number, string>>({});
	const [activeId, setActiveId] = useState<number | null>(null);
	const [animVars, setAnimVars] = useState<AnimVars>(null);
	const [isEntering, setIsEntering] = useState(false);
	const [sliding, setSliding] = useState<SlideState>(null);
	const [blockBackdropClose, setBlockBackdropClose] = useState(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => setSelected(buildInitialSelected()), []);

	const products: Product[] = useMemo(
		() =>
			Object.keys(SOURCES)
				.map(Number)
				.sort((a, b) => a - b)
				.map((id) => ({ id, src: selected[id] ?? SOURCES[id][0] })),
		[selected],
	);

	const indexOfProduct = (id: number) =>
		products.findIndex((product) => product.id === id);
	const current = activeId
		? (products.find((product) => product.id === activeId) ?? null)
		: null;
	const ghost = sliding
		? (products.find((product) => product.id === sliding.nextId) ?? null)
		: null;

	const cancelClose = () => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
	};

	const closeNow = useCallback(() => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
		setIsEntering(false);
		setActiveId(null);
		setAnimVars(null);
		setSliding(null);
		setBlockBackdropClose(false);
	}, []);

	const scheduleClose = (delay = 120) => {
		cancelClose();
		closeTimer.current = setTimeout(closeNow, delay);
	};

	const openFromRect = (id: number, rect: DOMRect) => {
		cancelClose();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const targetW = Math.min(1120, vw * 0.94);
		const targetH = Math.min(660, vh * 0.78);
		const dx = rect.left + rect.width / 2 - vw / 2;
		const dy = rect.top + rect.height / 2 - vh / 2;
		const sx = Math.max(0.01, rect.width / targetW);
		const sy = Math.max(0.01, rect.height / targetH);
		setAnimVars({ dx, dy, sx, sy });
		setActiveId(id);
		requestAnimationFrame(() =>
			requestAnimationFrame(() => setIsEntering(true)),
		);
	};

	const go = (dir: "next" | "prev") => {
		if (!activeId) return;
		const currentIndex = indexOfProduct(activeId);
		const nextId =
			dir === "next"
				? products[(currentIndex + 1) % products.length].id
				: products[(currentIndex - 1 + products.length) % products.length].id;
		setBlockBackdropClose(true);
		setSliding({ dir, nextId });
		setTimeout(() => {
			setActiveId(nextId);
			setSliding(null);
			setBlockBackdropClose(false);
		}, 360);
	};

	useEffect(() => {
		if (!activeId) return;
		const onKey = (event: KeyboardEvent) =>
			event.key === "Escape" && closeNow();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [activeId, closeNow]);

	return (
		<section className={styles.solution} aria-labelledby="solution_title">
			<p id="solution_title" className={styles.solution_title}>
				{t("title")}
			</p>

			<div className={styles.solution_grid}>
				{products.map(({ id, src }) => (
					<Card
						key={id}
						id={id}
						src={src}
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
