"use client";

import Header from "src/shared/ui/header";
import Footer from "src/shared/ui/footer";
import "./style.scss";

type Props = {
    children: React.ReactNode;
    align?: "top" | "center";
};

const Template = ({ children, align = "top" }: Props) => {
    return (
        <div className="template">
            <Header />
            <main className={`template_main template_main--${align}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Template;