"use client";

import { useTranslations } from "next-intl";
import Template from "src/widgets/layout/frame";
import "../style.scss";

const Accessibility = () => {
    const t = useTranslations("policies.accessibility");

    return (
        <Template>
            <div className="TermsOfUse">
                <h1>{t("title")}</h1>
                <h4>{t("effectiveDate")}</h4>
                <p>{t("intro")}</p>

                <h2>{t("sections.1.title")}</h2>
                <p>{t("sections.1.content")}</p>

                <h2>{t("sections.2.title")}</h2>
                <p>{t("sections.2.content")}</p>

                <h2>{t("sections.3.title")}</h2>
                <p>{t("sections.3.content")}</p>

                <h2>{t("sections.4.title")}</h2>
                <p>{t("sections.4.content")}</p>

                <h2>{t("sections.5.title")}</h2>
                <p>{t("sections.5.content")}</p>

                <h2>{t("sections.6.title")}</h2>
                <p>{t("sections.6.content")}</p>
            </div>
        </Template>
    );
};

export default Accessibility;