"use client";

import { useTranslations } from "next-intl";
import "./style.scss";
import Button from "src/components/ui/button";

const Banner = () => {
    const t = useTranslations("main.banner");

    return (
        <section className="banner">
            <div className="video-wrapper">
                <video src="https://storage.googleapis.com/bigtablet-homepage/6122c823-e40e-4d29-8855-4a64f0c7d881" autoPlay loop muted playsInline />
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