"use client";

import "./style.scss";
import {CardProps} from "./type";

const Card = ({ id, src, label, onOpen }: CardProps) => {
    const openFromTarget = (el: HTMLDivElement) => onOpen(id, el.getBoundingClientRect());

    return (
        <div
            className="solution-card"
            role="button"
            tabIndex={0}
            aria-label={label}
            onClick={(e) => openFromTarget(e.currentTarget as HTMLDivElement)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openFromTarget(e.currentTarget as HTMLDivElement);
                }
            }}
        >
            <video
                className="solution-card__video"
                src={src}
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
            />
            <div className="solution-card__overlay" />
            <p className="solution-card__title">{label}</p>
        </div>
    );
};

export default Card;