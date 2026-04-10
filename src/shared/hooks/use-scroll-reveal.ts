"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useReducedMotion } from "src/shared/hooks/use-reduced-motion";
import { gsap } from "src/shared/libs/gsap";

type Variant = "fade-up" | "fade-in" | "slide-left" | "slide-right";

interface ScrollRevealOptions {
	variant?: Variant;
	duration?: number;
	delay?: number;
	stagger?: number;
	start?: string;
	once?: boolean;
}

const VARIANT_FROM: Record<Variant, gsap.TweenVars> = {
	"fade-up": { opacity: 0, y: 40 },
	"fade-in": { opacity: 0 },
	"slide-left": { opacity: 0, x: -60 },
	"slide-right": { opacity: 0, x: 60 },
};

const VARIANT_TO: Record<Variant, gsap.TweenVars> = {
	"fade-up": { opacity: 1, y: 0 },
	"fade-in": { opacity: 1 },
	"slide-left": { opacity: 1, x: 0 },
	"slide-right": { opacity: 1, x: 0 },
};

/**
 * ScrollTrigger 기반 공통 reveal 애니메이션 훅
 * prefers-reduced-motion 활성화 시 애니메이션 없이 즉시 표시
 * @param selector - 컨테이너 내부에서 애니메이션할 요소의 CSS 셀렉터 (없으면 컨테이너 자체)
 */
export const useScrollReveal = <T extends HTMLElement = HTMLDivElement>(
	selector?: string,
	options: ScrollRevealOptions = {},
) => {
	const containerRef = useRef<T>(null);
	const prefersReduced = useReducedMotion();

	const {
		variant = "fade-up",
		duration = 0.7,
		delay = 0,
		stagger = 0.12,
		start = "top 85%",
		once = true,
	} = options;

	useGSAP(
		() => {
			if (!containerRef.current) return;

			const targets = selector
				? containerRef.current.querySelectorAll(selector)
				: containerRef.current;

			/** reduced motion → 애니메이션 스킵, 즉시 최종 상태 적용 */
			if (prefersReduced) {
				gsap.set(targets, VARIANT_TO[variant]);
				return;
			}

			gsap.fromTo(targets, VARIANT_FROM[variant], {
				...VARIANT_TO[variant],
				duration,
				delay,
				stagger: selector ? stagger : 0,
				ease: "power2.out",
				scrollTrigger: {
					trigger: containerRef.current,
					start,
					toggleActions: once ? "play none none none" : "play none none reverse",
				},
			});
		},
		{
			scope: containerRef,
			dependencies: [variant, duration, delay, stagger, start, once, prefersReduced],
		},
	);

	return containerRef;
};
