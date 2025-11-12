"use client"

import * as React from "react";
import "./style.scss";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: React.ReactNode;
    size?: "sm" | "md" | "lg";
}

export const Radio = ({ label, size = "md", className, ...props }: RadioProps) => {
    return (
        <label className={["radio", `radio--${size}`, className].filter(Boolean).join(" ")}>
            <input type="radio" className="radio__input" {...props} />
            <span className="radio__dot" aria-hidden />
            {label && <span className="radio__label">{label}</span>}
        </label>
    );
};