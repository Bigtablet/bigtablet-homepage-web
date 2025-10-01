import Header from "src/components/common/header";
import Banner from "src/components/main/banner";
import "./style.scss";
import Problem from "src/components/main/problem";

const Main = async ({ params }: { params: Promise<{ locale: "ko" | "en" }> }) => {
    const { locale } = await params;

    return (
        <>
            <Header />
            <main className="main-content">
                <Banner />
                <div className="gradient">
                    <Problem />
                </div>
            </main>
        </>
    );
};

export default Main;