"use client";

import Header from "src/shared/ui/header";
import Footer from "src/shared/ui/footer";
import "./style.scss";

type Props = { children: React.ReactNode };

const Template = ({ children }: Props) => {
    return (
        <div className="template">
            <Header />
            <main className="template__main">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Template;