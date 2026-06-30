import dynamic from "next/dynamic";
import Banner from "src/widgets/main/banner";
import Problem from "src/widgets/main/problem";
import Trust from "src/widgets/main/trust";
import styles from "./style.module.scss";

/* below-fold 위젯은 dynamic import — initial JS payload 절감.
   How/Solution/Moat/Proof/Company/Cta/Collaborations 는 스크롤 진입 후 등장. */
const How = dynamic(() => import("src/widgets/main/how"));
const Solution = dynamic(() => import("src/widgets/main/solution/section"));
const Moat = dynamic(() => import("src/widgets/main/moat"));
const Proof = dynamic(() => import("src/widgets/main/proof"));
const Company = dynamic(() => import("src/widgets/main/company"));
const Cta = dynamic(() => import("src/widgets/main/cta"));
const Collaborations = dynamic(() => import("src/widgets/main/collaborations"));

const MainPage = () => {
	return (
		<div className={styles.main_content}>
			{/* HERO — 다크, BgFx(vision) */}
			<Banner />

			{/* TRUST — 히어로 직후 다크 밴드 */}
			<section className={styles.trust_band}>
				<Trust />
			</section>

			{/* PROBLEM · HOW — 다크 그라운드 + 라이트 텍스트 + BgFx */}
			<section className={styles.dark_ground}>
				<Problem />
				<How />
			</section>

			{/* DEPLOYMENTS — 라이트 그라운드 (2카드) */}
			<section className={styles.light_ground}>
				<Solution />
			</section>

			{/* MOAT · VALIDATION · COMPANY — 다크 클로징 액트 */}
			<section className={styles.dark_ground}>
				<Moat />
				<Proof />
				<Company />
				<Collaborations />
			</section>

			{/* CTA — 다크 클로징, BgFx(capture/YOLO) */}
			<section className={styles.cta_band}>
				<Cta />
			</section>
		</div>
	);
};

export default MainPage;
