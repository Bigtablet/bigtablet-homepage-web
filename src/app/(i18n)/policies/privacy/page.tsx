"use client";

import { useTranslations } from "next-intl";
import Template from "src/components/common/template";
import "../style.scss";

const Privacy = () => {
    const t = useTranslations("policies.privacy");

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

                <h2>{t("sections.7.title")}</h2>
                <p>{t("sections.7.content")}</p>

                <h2>{t("sections.8.title")}</h2>
                <p>{t("sections.8.content")}</p>

                <h2>{t("sections.9.title")}</h2>
                <p>{t("sections.9.content")}</p>

                <h2>{t("sections.10.title")}</h2>
                <p>{t("sections.10.content")}</p>

                <h2>{t("sections.11.title")}</h2>
                <p>{t("sections.11.content")}</p>

                <h2>{t("sections.12.title")}</h2>
                <p>{t("sections.12.content")}</p>
            </div>
        </Template>
    );
};

export default Privacy;