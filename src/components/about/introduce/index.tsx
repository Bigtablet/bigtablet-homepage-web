"use client";

import React from "react";
import { useTranslations } from "next-intl";
import type { AboutType } from "src/types/about/introduce.type";
import "./style.scss";

const Introduce = ({ sectionKey, reverse = false }: AboutType) => {
    const t = useTranslations("about.top");

    return (
        <div className="about">
            {!reverse && (
                <>
                    <div className="about__text">
                        <p className="title">{t(`${sectionKey}.title`)}</p>
                        <p className="description">{t(`${sectionKey}.description`)}</p>
                    </div>
                    <div className="about__image">
                        <img src="/images/logo/logo.png" alt="logo" />
                    </div>
                </>
            )}

            {reverse && (
                <>
                    <div className="about__image">
                        <img src="/images/logo/logo.png" alt="logo" />
                    </div>
                    <div className="about__text about__text--reverse">
                        <p className="title">{t(`${sectionKey}.title`)}</p>
                        <p className="description">{t(`${sectionKey}.description`)}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Introduce;