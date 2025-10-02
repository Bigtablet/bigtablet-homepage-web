"use client";

import "./style.scss";
import {useTranslations} from "next-intl";
import {usePathname} from "next/navigation";

const Problem = () => {
    const t = useTranslations("main.problem");
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "en";

    return (
        <div className="problem">
            <span>{t("title")}</span>
            <span>{t("description")}</span>
        </div>
    )
}

export default Problem;