"use client";

import styles from "./style.module.scss";

interface CardProps {
    id: number;
    src: string;
    label: string;
    onOpen: (id: number, rect: DOMRect) => void;
}

const Card = ({ id, src, label, onOpen }: CardProps) => {
    const openFromTarget = (el: HTMLDivElement) => onOpen(id, el.getBoundingClientRect());

    return (
        <div
            className={styles.solution_card}
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
                className={styles.solution_card_video}
                src={src}
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
            />
            <div className={styles.solution_card_overlay} />
            <p className={styles.solution_card_title}>{label}</p>
        </div>
    );
};

export default Card;