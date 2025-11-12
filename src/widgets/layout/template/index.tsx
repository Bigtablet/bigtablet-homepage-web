"use client";

import Header from "src/widgets/layout/header";
import Footer from "src/widgets/layout/footer";
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