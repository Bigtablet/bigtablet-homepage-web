import dynamic from "next/dynamic";
import Banner from "src/widgets/main/banner";
import Problem from "src/widgets/main/problem";
import styles from "./style.module.scss";

/* below-fold 위젯은 dynamic import — initial JS payload 절감.
   Solution 은 modal/GSAP, Collaborations 는 로고 그리드. 둘 다 즉시 필요 없음. */
const Solution = dynamic(() => import("src/widgets/main/solution/section"));
const Collaborations = dynamic(() => import("src/widgets/main/collaborations"));

const MainPage = () => {
	return (
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
	);
};

export default MainPage;
