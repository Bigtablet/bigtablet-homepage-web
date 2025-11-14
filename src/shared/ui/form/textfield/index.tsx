"use client";

import * as React from "react";
import "./style.scss";

export type TextFieldVariant = "outline" | "filled" | "ghost";
export type TextFieldSize = "sm" | "md" | "lg";

export interface TextFieldProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
    label?: string;
    helperText?: string;
    error?: boolean;
    success?: boolean;
    variant?: TextFieldVariant;
    size?: TextFieldSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    onChangeAction?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            id,
            label,
            helperText,
            error,
            success,
            variant = "outline",
            size = "md",
            leftIcon,
            rightIcon,
            fullWidth,
            className,
            onChangeAction,
            ...props
        },
        ref
    ) => {
        const inputId = id ?? React.useId();
        const helperId = helperText ? `${inputId}-help` : undefined;

        const classNames = [
            "tf__input",
            `tf__input--${variant}`,
            `tf__input--${size}`,
            leftIcon && "tf__input--with-left",
            rightIcon && "tf__input--with-right",
            error && "tf__input--error",
            success && "tf__input--success",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <div className="tf" style={fullWidth ? { width: "100%" } : undefined}>
                {label && (
                    <label className="tf__label" htmlFor={inputId}>
                        {label}
                    </label>
                )}

                <div className="tf__wrapper">
                    {leftIcon && <span className="tf__icon tf__icon--left">{leftIcon}</span>}

                    <input
                        id={inputId}
                        ref={ref}
                        className={classNames}
                        aria-invalid={!!error}
                        aria-describedby={helperId}
                        {...props}
                        onChange={onChangeAction}
                    />

                    {rightIcon && <span className="tf__icon tf__icon--right">{rightIcon}</span>}
                </div>

                {helperText && (
                    <div
                        id={helperId}
                        className={`tf__helper ${error ? "tf__helper--error" : ""}`}
                    >
                        {helperText}
                    </div>
                )}
            </div>
        );
    }
);