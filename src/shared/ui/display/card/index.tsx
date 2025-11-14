"use client"

import * as React from "react";
import "./style.scss";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    shadow?: "none" | "sm" | "md" | "lg";
    padding?: "none" | "sm" | "md" | "lg";
    bordered?: boolean;
}

export const Card = ({ shadow = "sm", padding = "md", bordered, className, ...props }: CardProps) => {
    const cls = ["card", `card--shadow-${shadow}`, `card--p-${padding}`, bordered && "card--bordered", className]
        .filter(Boolean)
        .join(" ");
    return <div className={cls} {...props} />;
};