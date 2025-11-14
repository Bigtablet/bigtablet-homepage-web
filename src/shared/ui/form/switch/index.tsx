"use client"

import * as React from "react";
import "./style.scss";

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

export const Switch = ({ checked, defaultChecked, onChange, size = "md", disabled, className, ...props }: SwitchProps) => {
    const controlled = checked !== undefined;
    const [inner, setInner] = React.useState(!!defaultChecked);
    const on = controlled ? !!checked : inner;

    const toggle = () => {
        if (disabled) return;
        const next = !on;
        if (!controlled) setInner(next);
        onChange?.(next);
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            disabled={disabled}
            onClick={toggle}
            className={["switch", `switch--${size}`, on && "is-on", disabled && "is-disabled", className].filter(Boolean).join(" ")}
            {...props}
        >
            <span className="switch__thumb" />
        </button>
    );
};