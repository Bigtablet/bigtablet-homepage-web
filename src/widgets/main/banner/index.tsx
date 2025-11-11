"use client";

import { useTranslations } from "next-intl";
import Button from "src/shared/ui/button";
import "./style.scss";

const Banner = () => {
    const t = useTranslations("main.banner");

    return (
        <section className="banner" role="region" aria-labelledby="banner__title">
            {/* 배경 영상 */}
            <div className="banner__video">
                <video
                    className="banner__video-tag"
                    src="https://storage.googleapis.com/bigtablet-homepage/6122c823-e40e-4d29-8855-4a64f0c7d881"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                />
                <div className="banner__overlay" />
            </div>

            {/* 콘텐츠 영역 */}
            <div className="banner__content">
                <h1 id="banner__title" className="banner__title">
                    {t("title")}
                </h1>
                <p className="banner__description">{t("description")}</p>

                <a
                    className="banner__cta"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSd0on7yADoLSWYFN0it0LtCii7ov1yLwIpM91lR66vtHtaEuQ/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button>{t("button")}</Button>
                </a>
            </div>
        </section>
    );
};

export default Banner;