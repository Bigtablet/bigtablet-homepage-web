"use client";

import "./style.scss";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "src/components/main/modal";

type Product = { id: number; src: string };

const getRandomSrc = (id: number, count: number) => {
    const rand = Math.floor(Math.random() * count) + 1;
    return `/videos/solution/${id}/solution${id}-${rand}.mp4`;
};

const Solution = () => {
    const t = useTranslations("main.solution");

    const [randomSrc, setRandomSrc] = useState<{ [key: number]: string }>({});
    const [activeId, setActiveId] = useState<number | null>(null);
    const [animVars, setAnimVars] = useState<{ dx: number; dy: number; sx: number; sy: number } | null>(null);
    const [isEntering, setIsEntering] = useState(false);
    const [sliding, setSliding] = useState<{ dir: "next" | "prev"; nextId: number } | null>(null);
    const [blockBackdropClose, setBlockBackdropClose] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setRandomSrc({
            3: getRandomSrc(3, 4),
            4: getRandomSrc(4, 3),
        });
    }, []);

    const products: Product[] = useMemo(
        () => [
            { id: 1, src: `/videos/solution/1/solution1.mp4` },
            { id: 2, src: `/videos/solution/2/solution2.mp4` },
            { id: 3, src: randomSrc[3] ?? `/videos/solution/3/solution3-1.mp4` },
            { id: 4, src: randomSrc[4] ?? `/videos/solution/4/solution4-1.mp4` },
            { id: 5, src: `/videos/solution/5/solution5.mp4` },
        ],
        [randomSrc]
    );

    const scheduleClose = (delay = 120) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => {
            setIsEntering(false);
            setActiveId(null);
            setAnimVars(null);
            setSliding(null);
            setBlockBackdropClose(false);
        }, delay);
    };

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

    const openFromRect = (id: number, rect: DOMRect) => {
        cancelClose();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const targetW = Math.min(1120, vw * 0.94);
        const targetH = Math.min(660, vh * 0.78);
        const cardCx = rect.left + rect.width / 2;
        const cardCy = rect.top + rect.height / 2;
        const viewCx = vw / 2;
        const viewCy = vh / 2;
        const dx = cardCx - viewCx;
        const dy = cardCy - viewCy;
        const sx = Math.max(0.01, rect.width / targetW);
        const sy = Math.max(0.01, rect.height / targetH);
        setAnimVars({ dx, dy, sx, sy });
        setActiveId(id);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsEntering(true));
        });
    };

    const idxOf = (id: number) => products.findIndex(p => p.id === id);
    const current = activeId ? products.find(p => p.id === activeId) : null;
    const ghost = sliding ? products.find(p => p.id === sliding.nextId) ?? null : null;

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

    const prev = () => go("prev");
    const next = () => go("next");

    useEffect(() => {
        if (!activeId) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeNow();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeId]);

    return (
        <div className="solution">
            <p className="title">{t("title")}</p>

            <div className="card-section">
                {products.map(({ id, src }) => (
                    <div
                        key={id}
                        className="card"
                        onMouseEnter={e => {
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            openFromRect(id, rect);
                        }}
                    >
                        <video className="video" src={src} autoPlay muted playsInline loop preload="auto" />
                        <div className="overlay" />
                        <p className="title">{t(`product.${id}.title`)}</p>
                    </div>
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
                    prev={prev}
                    next={next}
                    close={closeNow}
                />
            )}
        </div>
    );
};

export default Solution;