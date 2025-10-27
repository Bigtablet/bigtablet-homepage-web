"use client";

import "./style.scss";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "src/components/main/modal";

type Product = { id: number; src: string };

const SOURCES: Record<number, string[]> = {
    1: ["https://storage.googleapis.com/bigtablet-homepage/e54c4886-77f5-4df2-b2e7-c721921845b9"],
    2: ["https://storage.googleapis.com/bigtablet-homepage/4125700b-ccda-42c8-9acb-705a3f93826b"],
    3: [
        "https://storage.googleapis.com/bigtablet-homepage/8fc089a3-eff8-4e5f-b1e1-c73ba56594ca",
        "https://storage.googleapis.com/bigtablet-homepage/a6d95be7-5ad5-4a70-b609-4ecbd40766b3",
        "https://storage.googleapis.com/bigtablet-homepage/f20d9b1f-b553-4797-8427-5f789191a761",
    ],
    4: [
        "https://storage.googleapis.com/bigtablet-homepage/312d580d-7de2-457c-8194-a05cd527f469",
        "https://storage.googleapis.com/bigtablet-homepage/4c261808-87d4-4031-b3c5-9851a4f0c540",
        "https://storage.googleapis.com/bigtablet-homepage/8a827489-8161-4269-9d09-737b2ac8ff20",
        "https://storage.googleapis.com/bigtablet-homepage/d9779906-9811-46d8-9149-56e01e7e5368",
    ],
    5: ["https://storage.googleapis.com/bigtablet-homepage/e5498153-4ebe-46de-aba3-b53ed5ddba7b"],
};

const pickOne = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const Solution = () => {
    const t = useTranslations("main.solution");

    const [selected, setSelected] = useState<Record<number, string>>({});
    const [activeId, setActiveId] = useState<number | null>(null);
    const [animVars, setAnimVars] = useState<{ dx: number; dy: number; sx: number; sy: number } | null>(null);
    const [isEntering, setIsEntering] = useState(false);
    const [sliding, setSliding] = useState<{ dir: "next" | "prev"; nextId: number } | null>(null);
    const [blockBackdropClose, setBlockBackdropClose] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const next: Record<number, string> = {};
        Object.entries(SOURCES).forEach(([k, urls]) => {
            const id = Number(k);
            next[id] = urls.length > 1 ? pickOne(urls) : urls[0];
        });
        setSelected(next);
    }, []);

    const products: Product[] = useMemo(
        () =>
            Object.keys(SOURCES)
                .map(n => Number(n))
                .sort((a, b) => a - b)
                .map(id => ({ id, src: selected[id] ?? SOURCES[id][0] })),
        [selected]
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
                        role="button"
                        tabIndex={0}
                        aria-label={t(`product.${id}.title`)}
                        onClick={(e) => {
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            openFromRect(id, rect);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                                openFromRect(id, rect);
                            }
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