"use client";

import "./style.scss";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";
import Portal from "src/shared/libs/ui/portal/portal";
import type { ModalProps, ModalItem } from "./type";

const CLOSE_INTENT_DELAY = 180;

const Modal = ({
                   current,
                   ghost,
                   sliding,
                   animVars,
                   isEntering,
                   blockBackdropClose,
                   prev,
                   next,
                   close,
                   scheduleClose
               }: ModalProps) => {
    const t = useTranslations("main.solution");
    const intentTimerRef = useRef<number | null>(null);

    // opening transform variables
    const styleVars = useMemo(() => {
        if (!animVars) return {};
        return {
            "--from-dx": `${animVars.dx}px`,
            "--from-dy": `${animVars.dy}px`,
            "--from-sx": animVars.sx,
            "--from-sy": animVars.sy,
        } as React.CSSProperties & Record<string, string | number>;
    }, [animVars]);

    const renderPanel = (item: ModalItem) => (
        <div className="solution-modal__panel">
            <div className="solution-modal__left">
                <h3 className="solution-modal__title">{t(`product.${item.id}.title`)}</h3>
                <p className="solution-modal__desc">{t(`product.${item.id}.description`)}</p>
            </div>
            <div className="solution-modal__right">
                <video
                    className="solution-modal__video"
                    src={item.src}
                    autoPlay
                    muted
                    playsInline
                    loop
                    preload="auto"
                />
            </div>
        </div>
    );

    const armCloseIntent = () => {
        if (blockBackdropClose) return;
        if (intentTimerRef.current) window.clearTimeout(intentTimerRef.current);
        intentTimerRef.current = window.setTimeout(() => {
            intentTimerRef.current = null;
            close();
        }, CLOSE_INTENT_DELAY);
    };

    const cancelCloseIntent = () => {
        if (intentTimerRef.current) {
            window.clearTimeout(intentTimerRef.current);
            intentTimerRef.current = null;
        }
    };

    // esc to close
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !blockBackdropClose) close();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [blockBackdropClose, close]);

    return (
        <Portal>
            <div
                className={`solution-modal__backdrop${blockBackdropClose ? " is-locked" : ""}`}
                onClick={blockBackdropClose ? undefined : close}
                onMouseLeave={(e) => {
                    const related = (e as React.MouseEvent).relatedTarget as Node | null;
                    if (!related) armCloseIntent();
                }}
                onMouseEnter={cancelCloseIntent}
                role="presentation"
            >
                <div
                    className={`solution-modal${isEntering ? " is-enter" : ""}`}
                    style={styleVars}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="solution-modal__nav solution-modal__nav--prev" onClick={prev} aria-label="previous">
                        ‹
                    </button>

                    <div className="solution-modal__content" role="dialog" aria-modal="true">
                        <div
                            className={`solution-modal__track${
                                sliding ? (sliding.dir === "next" ? " is-slide-next" : " is-slide-prev") : ""
                            }`}
                        >
                            {sliding?.dir === "prev" && ghost && renderPanel(ghost)}
                            {renderPanel(current)}
                            {sliding?.dir === "next" && ghost && renderPanel(ghost)}
                        </div>
                    </div>

                    <button className="solution-modal__nav solution-modal__nav--next" onClick={next} aria-label="next">
                        ›
                    </button>
                </div>
            </div>
        </Portal>
    );
};

export default Modal;