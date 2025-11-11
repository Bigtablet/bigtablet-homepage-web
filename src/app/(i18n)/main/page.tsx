import "./style.scss";
import Frame from "src/widgets/layout/template";
import Banner from "src/widgets/main/banner";
import Problem from "src/widgets/main/problem";
import Solution from "src/widgets/main/solution/solution";
import Collaborations from "src/widgets/main/collaborations";

const MainPage = () => {
    return (
        <Frame>
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
        </Frame>
    );
};

export default MainPage;