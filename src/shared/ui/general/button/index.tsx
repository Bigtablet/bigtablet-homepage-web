"use client"

import * as React from "react";
import "./style.scss";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    style?: React.CSSProperties;
}

export const Button = ({
                           variant = "primary",
                           size = "md",
                           className,
                            style,
                           ...props
                       }: ButtonProps) => {
    const classes = ["btn", `btn--${variant}`, `btn--${size}`, className]
        .filter(Boolean)
        .join(" ");

    return <button className={classes} {...props} />;
}