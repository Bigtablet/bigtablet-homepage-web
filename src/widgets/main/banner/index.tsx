"use client";

import { useTranslations } from "next-intl";
import { Button } from "src/shared/ui/general/button";
import styles from "./style.module.scss";

const Banner = () => {
    const t = useTranslations("main.banner");

    return (
        <section className={styles.banner} role="region" aria-labelledby="banner_title">
            <div className={styles.banner_video}>
                <video
                    className={styles.banner_video_tag}
                    src="https://storage.googleapis.com/bigtablet-homepage/6122c823-e40e-4d29-8855-4a64f0c7d881"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                />
                <div className={styles.banner_overlay} />
            </div>

            <div className={styles.banner_content}>
                <h1 id="banner_title" className={styles.banner_title}>
                    {t("title")}
                </h1>
                <p className={styles.banner_description}>{t("description")}</p>

                <a
                    className={styles.banner_cta}
                    href="https://docs.google.com/forms/d/e/1FAIpQLSd0on7yADoLSWYFN0it0LtCii7ov1yLwIpM91lR66vtHtaEuQ/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="primary" size="lg">
                        {t("button")}
                    </Button>
                </a>
            </div>
        </section>
    );
};

export default Banner;