import Header from "src/components/common/header";
import Banner from "src/components/main/banner";
import Problem from "src/components/main/problem";
import Solution from "src/components/main/solution";
import "./style.scss";

const Main = async ({ params }: { params: Promise<{ locale: "ko" | "en" }> }) => {
    const { locale } = await params;

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="snap">
                    <Banner />
                </div>

                <div className="gradient">
                    <div className="snap">
                        <Problem />
                    </div>
                    <div className="snap">
                        <Solution />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Main;