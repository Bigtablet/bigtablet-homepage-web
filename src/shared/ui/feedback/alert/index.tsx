"use client"

import * as React from "react";
import "./style.scss";
import { X } from "lucide-react";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: AlertVariant;
    title?: React.ReactNode;
    icon?: React.ReactNode;
    closable?: boolean;
    onClose?: () => void;
}

export const Alert = ({
                   variant = "info",
                   title,
                   icon,
                   closable,
                   onClose,
                   className,
                   children,
                   ...props
               }: AlertProps) => {
    return (
        <div
            className={["alert", `alert--${variant}`, className].filter(Boolean).join(" ")}
            role="alert"
            aria-live="polite"
            {...props}
        >
            {icon && <span className="alert__icon" aria-hidden="true">{icon}</span>}

            <div className="alert__content">
                {title && <div className="alert__title">{title}</div>}
                {children && <div className="alert__desc">{children}</div>}
            </div>

            {closable && (
                <button
                    type="button"
                    className="alert__close"
                    aria-label="닫기"
                    onClick={onClose}
                >
                    <X size={16} aria-hidden="true" focusable="false" />
                </button>
            )}
        </div>
    );
};
