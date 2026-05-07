"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "src/widgets/main/solution/model/video-sources";

type SlideState = { dir: "next" | "prev"; nextId: number } | null;
type AnimVars = { dx: number; dy: number; sx: number; sy: number } | null;

/**
 * @description
 * 솔루션 카드 모달의 열기/닫기/슬라이드 애니메이션 상태를 관리하는 hook.
 * 카드 위치(rect) 기반 원점 transform 계산, ESC 종료, 슬라이드 전환을 캡슐화.
 */
export const useSolutionModal = (products: Product[]) => {
	const [activeId, setActiveId] = useState<number | null>(null);
	const [animVars, setAnimVars] = useState<AnimVars>(null);
	const [isEntering, setIsEntering] = useState(false);
	const [sliding, setSliding] = useState<SlideState>(null);
	const [blockBackdropClose, setBlockBackdropClose] = useState(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const cancelClose = useCallback(() => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
	}, []);

	const closeNow = useCallback(() => {
		cancelClose();
		setIsEntering(false);
		setActiveId(null);
		setAnimVars(null);
		setSliding(null);
		setBlockBackdropClose(false);
	}, [cancelClose]);

	const scheduleClose = useCallback(
		(delay = 120) => {
			cancelClose();
			closeTimer.current = setTimeout(closeNow, delay);
		},
		[cancelClose, closeNow],
	);

	const openFromRect = useCallback(
		(id: number, rect: DOMRect) => {
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
			requestAnimationFrame(() => requestAnimationFrame(() => setIsEntering(true)));
		},
		[cancelClose],
	);

	const go = useCallback(
		(dir: "next" | "prev") => {
			if (!activeId) return;
			const currentIndex = products.findIndex((p) => p.id === activeId);
			if (currentIndex === -1) return;
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
		},
		[activeId, products],
	);

	/* ESC로 닫기 */
	useEffect(() => {
		if (!activeId) return;
		const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeNow();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [activeId, closeNow]);

	const current = activeId ? (products.find((p) => p.id === activeId) ?? null) : null;
	const ghost = sliding ? (products.find((p) => p.id === sliding.nextId) ?? null) : null;

	return {
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
	};
};
