"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./style.scss";

const NAV = [
    { href: "/admin/main",  label: "Main",  icon: "🏠" },
    { href: "/admin/jobs",       label: "Jobs",       icon: "💼" },
    { href: "/admin/blog",       label: "Blog",       icon: "✍️" },
    { href: "/admin/news",       label: "News",       icon: "📰" },
    { href: "/admin/profile",    label: "Profile",    icon: "👤" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const Item = ({ href, label, icon }: { href: string; label: string; icon: string }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
            <Link href={href} className={`sidebar__item ${active ? "is-active" : ""}`}>
                <span className="sidebar__item-icon" aria-hidden>{icon}</span>
                <span className="sidebar__item-label">{label}</span>
            </Link>
        );
    };

    return (
        <div className="admin">
            <aside className="sidebar" role="navigation" aria-label="Admin sidebar">
                <div className="sidebar__brand">
                    <Link href="/admin/main">Bigtablet Admin</Link>
                </div>

                <nav className="sidebar__nav">
                    {NAV.map(n => <Item key={n.href} {...n} />)}
                </nav>

                <div className="sidebar__quick">
                    <div className="sidebar__section-title">Quick actions</div>
                    <div className="sidebar__actions">
                        <Link href="/admin/jobs/new" className="btn btn--primary">+ New Job</Link>
                        <Link href="/admin/blog/new" className="btn btn--outline">+ New Blog</Link>
                        <Link href="/admin/news/new" className="btn btn--outline">+ New News</Link>
                    </div>
                </div>
            </aside>

            <main className="content">{children}</main>
        </div>
    );
};

export default AdminLayout;