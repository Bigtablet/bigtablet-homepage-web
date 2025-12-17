"use client";

import Header from "src/shared/ui/header";
import Footer from "src/shared/ui/footer";
import styles from "./style.module.scss";

type Props = {
    children: React.ReactNode;
    align?: "top" | "center";
};

const Template = ({ children, align = "top" }: Props) => {
    return (
        <div className={styles.template}>
            <Header />

            <main
                className={[
                    styles.template_main,
                    align === "top" && styles.template_main_top,
                    align === "center" && styles.template_main_center,
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Template;