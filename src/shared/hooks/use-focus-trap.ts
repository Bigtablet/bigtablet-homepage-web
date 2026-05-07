"use client";

import { type RefObject, useEffect } from "react";

const FOCUSABLE_SELECTOR =
	'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * @description
 * 포커스를 컨테이너 내부에서만 순환시키는 hook (modal/dialog용).
 * 활성화 시 첫 포커스 요소로 이동, Tab/Shift+Tab 순환 트랩.
 * 동적으로 추가/제거되는 요소에 대응하도록 매 Tab 이벤트마다 재조회.
 *
 * @param ref - 포커스 트랩을 적용할 컨테이너 ref
 * @param active - 트랩 활성 여부 (모달 open 등)
 */
export const useFocusTrap = (ref: RefObject<HTMLElement | null>, active: boolean) => {
	useEffect(() => {
		if (!active) return;
		const container = ref.current;
		if (!container) return;

		const getFocusable = () =>
			Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

		const initial = getFocusable();
		if (initial.length > 0) initial[0].focus();

		const onKey = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;
			const focusable = getFocusable();
			if (!focusable.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [ref, active]);
};
