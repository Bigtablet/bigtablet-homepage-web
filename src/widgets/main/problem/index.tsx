"use client";

import { useTranslations } from "next-intl";
import "./style.scss";

const Problem = () => {
    const t = useTranslations("main.problem");

    return (
        <section className="problem" role="region" aria-labelledby="problem__title">
            <h2 id="problem__title" className="problem__title">
                {t("title")}
            </h2>
            <p className="problem__description">
                {t("description")}
            </p>
        </section>
    );
};

export default Problem;