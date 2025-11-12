"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ 추가
import "./style.scss";

export interface SidebarItem {
    href: string;
    label: React.ReactNode;
    icon?: React.ComponentType<{ size?: number }>;
}

type MatchMode = "startsWith" | "exact";

export interface SidebarProps {
    items?: SidebarItem[];
    activePath?: string;
    onItemSelect?: (href: string) => void;
    width?: number;
    className?: string;
    style?: React.CSSProperties;
    match?: MatchMode;
    brandHref?: string;          // ✅ (옵션) 로고 클릭 시 이동 경로
}

export const Sidebar = ({
                            items = [],
                            activePath,
                            onItemSelect,
                            width = 240,
                            className,
                            style,
                            match = "startsWith",
                            brandHref = "/main",
                        }: SidebarProps) => {
    const isActive = (href: string) => {
        if (!activePath) return false;
        return match === "exact" ? activePath === href : activePath.startsWith(href);
    };

    return (
        <aside
            className={["sidebar", className].filter(Boolean).join(" ")}
            style={{ width, ...style }}
        >
            {/* ✅ 상단 로고 영역 */}
            <div className="sidebar__brand">
                <Link href={brandHref} className="sidebar__brand-link" aria-label="Bigtablet 홈으로">
                    <Image
                        src="/assets/images/logo/bigtablet.png"
                        alt="Bigtablet"
                        width={200}
                        height={44}
                        priority
                        className="sidebar__brand-img"
                    />
                </Link>
            </div>

            <nav className="sidebar__nav">
                {items.map((it) => {
                    const active = isActive(it.href);
                    return (
                        <Link
                            key={it.href}
                            href={it.href}
                            className={["sidebar__item", active && "is-active"]
                                .filter(Boolean)
                                .join(" ")}
                            onClick={() => onItemSelect?.(it.href)}
                            title={typeof it.label === "string" ? it.label : undefined}
                        >
                            {it.icon && (
                                <span className="sidebar__icon">
                  {React.createElement(it.icon, { size: 16 })}
                </span>
                            )}
                            <span className="sidebar__label">{it.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};