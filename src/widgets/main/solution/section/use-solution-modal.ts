"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "src/widgets/main/solution/model/video-sources";

type SlideState = { dir: "next" | "prev"; nextId: number } | null;
type AnimVars = { dx: number; dy: number; sx: number; sy: number } | null;

/** CSS .is_slide_next/.is_slide_prev transition duration과 일치 */
const SLIDE_DURATION_MS = 360;

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
	const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const cancelClose = useCallback(() => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
	}, []);

	const cancelSlide = useCallback(() => {
		if (slideTimer.current) {
			clearTimeout(slideTimer.current);
			slideTimer.current = null;
		}
	}, []);

	const closeNow = useCallback(() => {
		cancelClose();
		cancelSlide();
		setIsEntering(false);
		setActiveId(null);
		setAnimVars(null);
		setSliding(null);
		setBlockBackdropClose(false);
	}, [cancelClose, cancelSlide]);

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
			cancelSlide();
			slideTimer.current = setTimeout(() => {
				slideTimer.current = null;
				setActiveId(nextId);
				setSliding(null);
				setBlockBackdropClose(false);
			}, SLIDE_DURATION_MS);
		},
		[activeId, products, cancelSlide],
	);

	/* ESC로 닫기 + 좌/우 화살표 키로 슬라이드 이동 */
	useEffect(() => {
		if (!activeId) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeNow();
				return;
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				go("prev");
				return;
			}
			if (event.key === "ArrowRight") {
				event.preventDefault();
				go("next");
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [activeId, closeNow, go]);

	/* 모달 열림 동안 배경 스크롤 잠금 — position:fixed 로 body 를 고정한다.
	   (html overflow:hidden 은 backdrop-filter 의 배경 캡처를 깨 모달 뒷배경이
	   사라지는 버그가 있어 사용하지 않음. body 만 overflow:hidden 은 스크롤러가
	   <html> 이라 잠기지 않음.)
	   activeId 가 아니라 isOpen 으로 키잉 — 슬라이드(다음/이전)로 activeId 가
	   바뀔 때 scrollY 를 재캡처(=0)해 닫을 때 최상단으로 튀는 것을 방지. */
	const isOpen = activeId !== null;
	useEffect(() => {
		if (!isOpen) return;
		const body = document.body;
		const scrollY = window.scrollY;
		const prev = {
			position: body.style.position,
			top: body.style.top,
			left: body.style.left,
			right: body.style.right,
			width: body.style.width,
		};
		body.style.position = "fixed";
		body.style.top = `-${scrollY}px`;
		body.style.left = "0";
		body.style.right = "0";
		body.style.width = "100%";
		return () => {
			body.style.position = prev.position;
			body.style.top = prev.top;
			body.style.left = prev.left;
			body.style.right = prev.right;
			body.style.width = prev.width;
			window.scrollTo(0, scrollY);
		};
	}, [isOpen]);

	/* 언마운트 시 잔여 타이머 정리 — modal 닫힌 뒤에 setActiveId가 다시 깨우지 않도록 */
	useEffect(() => {
		return () => {
			cancelClose();
			cancelSlide();
		};
	}, [cancelClose, cancelSlide]);

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
