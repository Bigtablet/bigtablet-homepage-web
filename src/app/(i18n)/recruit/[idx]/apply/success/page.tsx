"use client";

import styles from "./style.module.scss";
import Template from "src/shared/ui/template";
import { Button } from "@bigtablet/design-system";
import {BigtabletRouter} from "src/shared/hooks/router";

const ApplySuccessPage = () => {
    const router = BigtabletRouter();

    return (
        <Template align="center">
            <div className={styles.success}>
                <h1 className={styles.success_title}>지원이 완료되었습니다.</h1>

                <p className={styles.success_text}>
                    빅태블릿에 관심을 가지고 지원해주셔서 감사합니다.<br />
                    최대한 빠르게 검토 후 지원해 주신 모든 분께<br />
                    안내 메일을 발송해 드리고 있으니 참고 바랍니다.
                </p>

                <p className={styles.success_text}>
                    기타 채용 관련 문의사항은{" "}
                    <a href="mailto:recruit@bigtablet.com">recruit@bigtablet.com</a> 으로 연락 바랍니다.
                </p>

                <Button size="lg" onClick={() => router.push("/")}>
                    메인으로 돌아가기
                </Button>
            </div>
        </Template>
    );
};

export default ApplySuccessPage;