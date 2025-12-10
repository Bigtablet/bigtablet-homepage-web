"use client";

import styles from "./style.module.scss";
import Template from "src/shared/ui/template";
import Banner from "src/widgets/main/banner";
import Problem from "src/widgets/main/problem";
import Solution from "src/widgets/main/solution/section";
import Collaborations from "src/widgets/main/collaborations";

const MainPage = () => {
    return (
        <Template>
            <div className={styles.main_content}>
                <div className={styles.snap}>
                    <Banner />
                </div>

                <section className={styles.gradient}>
                    <div className={styles.snap}>
                        <Problem />
                    </div>
                    <div className={styles.snap}>
                        <Solution />
                    </div>
                </section>

                <section className={styles.collab_bg}>
                    <div className={styles.snap}>
                         <Collaborations />
                    </div>
                </section>
            </div>
        </Template>
    );
};

export default MainPage;