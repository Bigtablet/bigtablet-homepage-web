import Header from "src/components/common/header";
import Banner from "src/components/main/banner";
import Problem from "src/components/main/problem";
import Solution from "src/components/main/solution";
import Collaborations from "src/components/main/collaborations";
import "./style.scss";

const Main = () => {
    return (
        <>
            <Header />
            <main className="main-content">
                <div className="snap">
                    <Banner />
                </div>

                <section className="gradient">
                    <div className="snap">
                        <Problem />
                    </div>
                    <div className="snap">
                        <Solution />
                    </div>
                </section>

                <section className="collab-bg">
                    <div className="snap">
                        <Collaborations />
                    </div>
                </section>
            </main>
        </>
    );
};

export default Main;