"use client"

import * as React from "react";
import "./style.scss";

export interface ModalProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    open: boolean;
    onClose?: () => void;
    closeOnOverlay?: boolean;
    width?: number | string;
    title?: React.ReactNode;
}

export const Modal = ({
                          open,
                          onClose,
                          closeOnOverlay = true,
                          width = 520,
                          title,
                          children,
                          ...props
                      }: ModalProps) => {
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={() => closeOnOverlay && onClose?.()}
        >
            <div
                className="modal__panel"
                style={{ width }}
                onClick={(e) => e.stopPropagation()}
                {...props}
            >
                {title && <div className="modal__header">{title}</div>}
                <div className="modal__body">{children}</div>
            </div>
        </div>
    );
};