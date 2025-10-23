"use client";

import "./style.scss";
import { useTranslations } from "next-intl";
import type { AboutType } from "src/types/about/introduce.type";

const Introduce = ({ sectionKey, reverse = false }: AboutType) => {
    const t = useTranslations("about.top");

    return (
        <section className={`about ${reverse ? "about--reverse" : ""}`}>
            <div className="about__text">
                <p className="about__title">{t(`${sectionKey}.title`)}</p>
                <p className="about__desc">{t(`${sectionKey}.description`)}</p>
            </div>
            <div className="about__image" aria-hidden="true">
                <img src="/images/logo/img.png" alt="logo" />
            </div>
        </section>
    );
};

export default Introduce;