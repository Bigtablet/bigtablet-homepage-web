"use client";

import "./style.scss";

export const SkeletonList = () => (
    <div className="request-item skeleton">
        <div className="request-item__left">
            <div className="skeleton__title" />
            <div className="request-item__tags">
                <span className="skeleton__tag" />
                <span className="skeleton__tag" />
                <span className="skeleton__tag" />
            </div>
        </div>
        <div className="request-item__dday">
            <span className="skeleton__dday" />
        </div>
    </div>
);