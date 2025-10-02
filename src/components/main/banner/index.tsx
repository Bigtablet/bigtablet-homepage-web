"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import "./style.scss";
import Button from "src/components/ui/button";

const Banner = () => {
    const t = useTranslations("main.banner");
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "ko";

    return (
        <section className="banner">
            <div className="video-wrapper">
                <video src="/videos/main/main.mp4" autoPlay loop muted playsInline />
                <div className="overlay" />
            </div>

            <div className="content">
                <h1 className="title">{t("title")}</h1>
                <p className="description">{t("description")}</p>
                <Button>{t("button")}</Button>
            </div>
        </section>
    );
};

export default Banner;