import dynamic from "next/dynamic";
import Banner from "src/widgets/main/banner";
import Problem from "src/widgets/main/problem";
import Trust from "src/widgets/main/trust";
import styles from "./style.module.scss";

/* below-fold 위젯은 dynamic import — initial JS payload 절감.
   Solution 은 modal/GSAP, Moat/Proof/Company 는 스크롤 리빌, Collaborations 는 로고 그리드. */
const Solution = dynamic(() => import("src/widgets/main/solution/section"));
const Moat = dynamic(() => import("src/widgets/main/moat"));
const Proof = dynamic(() => import("src/widgets/main/proof"));
const Company = dynamic(() => import("src/widgets/main/company"));
const Collaborations = dynamic(() => import("src/widgets/main/collaborations"));

const MainPage = () => {
	return (
		<div className={styles.main_content}>
			<div className={styles.snap}>
				<Banner />
			</div>

			{/* 신뢰 띠 — 히어로 직후 흰 밴드. 검증된 딥테크임을 첫 화면에서 전달 */}
			<section className={styles.trust_bg}>
				<div className={styles.snap}>
					<Trust />
				</div>
			</section>

			<section className={styles.gradient}>
				<div className={styles.snap}>
					<Problem />
				</div>
				<div className={styles.snap}>
					<Solution />
				</div>
			</section>

			{/* 딥테크·트랙션·회사 클로징 액트 — navy 위 라이트 텍스트 */}
			<section className={styles.collab_bg}>
				<div className={styles.snap}>
					<Moat />
				</div>
				<div className={styles.snap}>
					<Proof />
				</div>
				<div className={styles.snap}>
					<Company />
				</div>
				<div className={styles.snap}>
					<Collaborations />
				</div>
			</section>
		</div>
	);
};

export default MainPage;
