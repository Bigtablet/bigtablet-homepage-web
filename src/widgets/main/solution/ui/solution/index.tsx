"use client";

import "./style.scss";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { SOURCES, Product } from "../../model/sources";
import { buildInitialSelected } from "../../util/select";
import Card from "../card";
import Modal from "../modal";

type SlideState = { dir: "next" | "prev"; nextId: number } | null;
type AnimVars = { dx: number; dy: number; sx: number; sy: number } | null;

const Solution = () => {
    const t = useTranslations("main.solution");

    const [selected, setSelected] = useState<Record<number, string>>({});
    const [activeId, setActiveId] = useState<number | null>(null);
    const [animVars, setAnimVars] = useState<AnimVars>(null);
    const [isEntering, setIsEntering] = useState(false);
    const [sliding, setSliding] = useState<SlideState>(null);
    const [blockBackdropClose, setBlockBackdropClose] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 비디오 초기 선택
    useEffect(() => setSelected(buildInitialSelected()), []);

    const products: Product[] = useMemo(
        () =>
            Object.keys(SOURCES)
                .map(Number)
                .sort((a, b) => a - b)
                .map((id) => ({ id, src: selected[id] ?? SOURCES[id][0] })),
        [selected]
    );

    const idxOf = (id: number) => products.findIndex((p) => p.id === id);
    const current = activeId ? products.find((p) => p.id === activeId) ?? null : null;
    const ghost = sliding ? products.find((p) => p.id === sliding.nextId) ?? null : null;

    const cancelClose = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    };

    const closeNow = () => {
        cancelClose();
        setIsEntering(false);
        setActiveId(null);
        setAnimVars(null);
        setSliding(null);
        setBlockBackdropClose(false);
    };

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
        requestAnimationFrame(() => requestAnimationFrame(() => setIsEntering(true)));
    };

    const go = (dir: "next" | "prev") => {
        if (!activeId) return;
        const i = idxOf(activeId);
        const nextId =
            dir === "next"
                ? products[(i + 1) % products.length].id
                : products[(i - 1 + products.length) % products.length].id;
        setBlockBackdropClose(true);
        setSliding({ dir, nextId });
        setTimeout(() => {
            setActiveId(nextId);
            setSliding(null);
            setBlockBackdropClose(false);
        }, 360);
    };

    // Esc 키로 닫기
    useEffect(() => {
        if (!activeId) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeNow();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeId]);

    return (
        <section className="solution" role="region" aria-labelledby="solution__title">
            <p id="solution__title" className="solution__title">
                {t("title")}
            </p>

            <div className="solution__grid">
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

export default Solution;