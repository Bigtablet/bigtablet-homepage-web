"use client";

import "./style.scss";

const SkeletonCard = () => (
    <div className="card-skeleton">
        <div className="card-skeleton__thumb" />
        <div className="card-skeleton__text">
            <div className="card-skeleton__line short" />
            <div className="card-skeleton__line" />
        </div>
    </div>
);
export default SkeletonCard;