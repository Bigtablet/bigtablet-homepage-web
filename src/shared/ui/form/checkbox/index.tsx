"use client"

import * as React from "react";
import "./style.scss";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: React.ReactNode;
    size?: "sm" | "md" | "lg";
    indeterminate?: boolean;
}

export const Checkbox = ({ label, size = "md", indeterminate, className, ...props }: CheckboxProps) => {
    const ref = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);

    return (
        <label className={["checkbox", `checkbox--${size}`, className].filter(Boolean).join(" ")}>
            <input ref={ref} type="checkbox" className="checkbox__input" {...props} />
            <span className="checkbox__box" aria-hidden />
            {label && <span className="checkbox__label">{label}</span>}
        </label>
    );
};