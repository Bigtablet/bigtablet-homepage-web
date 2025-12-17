"use client";

import {useParams} from "next/navigation";
import Template from "src/shared/ui/template";
import {useRecruitDetailQuery} from "src/entities/recruit/query/recruit.query";
import type {RecruitCard} from "src/entities/recruit/model/schema/recruit.schema";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import styles from "./style.module.scss";
import {Button} from "@bigtablet/design-system";
import {BigtabletLink} from "src/shared/hooks/link";

const toIdx = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

const formatDate = (s?: string) => {
    if (!s) return "";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
};

const BENEFITS = [
    "업무에 필요한 장비 (Mac, Window, 키보드, 마우스, 모니터 등) 지원",
    "시차 출퇴근",
    "빵빵한 간식 창고",
    "수평적 구조, 상호 존중으로 ~님 호칭 사용",
    "필요한 AI툴 지원 (Chat GPT 5 기본 지원)",
    "점심 식대 지원, 야근 시 저녁 식대 지원"
];

const HIRING_PROCESS = [
    "서류 전형",
    "1차 인터뷰(직무/케이스 중심)",
    "2차 인터뷰(조직/문화 적합)",
    "처우 협의",
    "합류"
];

const markdownComponents = {
    p: ({node, ...props}: any) => (
        <p {...props} className={styles.recruit_detail_text}/>
    ),
    ul: ({node, ...props}: any) => (
        <ul {...props} className={styles.recruit_detail_list}/>
    ),
    ol: ({node, ...props}: any) => (
        <ol {...props} className={styles.recruit_detail_list}/>
    ),
    li: ({node, ...props}: any) => <li {...props} />
};

const RecruitDetail = () => {
    const {idx} = useParams<{ locale: string; idx: string }>();
    const idxNum = toIdx(idx);

    const {data, status, error} = useRecruitDetailQuery(idxNum ?? -1, {
        enabled: idxNum !== null
    });

    const recruit = data as RecruitCard | undefined;

    return (
        <Template>
            <div className={styles.recruit_detail}>
                {status === "pending" && (
                    <div className={styles.recruit_detail_loading}>불러오는 중…</div>
                )}

                {status === "error" && (
                    <div className={styles.recruit_detail_error}>
                        불러오지 못했습니다. {(error as Error)?.message}
                    </div>
                )}

                {status === "success" && recruit && (
                    <>
                        <header className={styles.recruit_detail_header}>
                            <h1 className={styles.recruit_detail_title}>{recruit.title}</h1>

                            <div className={styles.recruit_detail_meta}>
                                <div className={styles.recruit_detail_chips}>
                                    {recruit.tags.map((t, i) => (
                                        <span key={`tag-${i}`} className={styles.chip}>
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className={styles.recruit_detail_datebar}>
                                    {formatDate(recruit.startDate)} -{" "}
                                    {recruit.endDate ? formatDate(recruit.endDate) : "상시"}
                                </div>
                            </div>
                        </header>

                        <section className={styles.recruit_detail_section}>
                            <h2>조직 소개</h2>
                            <ReactMarkdown remarkPlugins={[remarkBreaks]} components={markdownComponents}>
                                {recruit.companyIntroduction}
                            </ReactMarkdown>
                        </section>

                        <section className={styles.recruit_detail_section}>
                            <h2>포지션 소개</h2>
                            <ReactMarkdown remarkPlugins={[remarkBreaks]} components={markdownComponents}>
                                {recruit.positionIntroduction}
                            </ReactMarkdown>
                        </section>

                        <section className={styles.recruit_detail_section}>
                            <h2>주요 업무</h2>
                            <ReactMarkdown remarkPlugins={[remarkBreaks]} components={markdownComponents}>
                                {recruit.mainResponsibility}
                            </ReactMarkdown>
                        </section>

                        <section className={styles.recruit_detail_section}>
                            <h2>자격 요건</h2>
                            <ReactMarkdown remarkPlugins={[remarkBreaks]} components={markdownComponents}>
                                {recruit.qualification}
                            </ReactMarkdown>
                        </section>

                        {recruit.preferredQualification && (
                            <section className={styles.recruit_detail_section}>
                                <h2>우대사항</h2>
                                <ReactMarkdown remarkPlugins={[remarkBreaks]} components={markdownComponents}>
                                    {recruit.preferredQualification}
                                </ReactMarkdown>
                            </section>
                        )}

                        <section className={styles.recruit_detail_section}>
                            <h2>복지 및 혜택</h2>
                            <ul className={styles.recruit_detail_list}>
                                {BENEFITS.map((b, i) => (
                                    <li key={`benefit-${i}`}>{b}</li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.recruit_detail_section}>
                            <h2>채용 절차</h2>
                            <p className={styles.recruit_detail_process}>
                                {HIRING_PROCESS.join(" → ")}
                            </p>
                            <p className={styles.recruit_detail_notice_text}>
                                경우에 따라 간단한 사전 과제 또는 레퍼런스 체크가 진행될 수 있습니다.
                            </p>
                        </section>

                        <section className={styles.recruit_detail_notice}>
                            <h2 className={styles.recruit_detail_notice_title}>유의 사항</h2>
                            <p className={styles.recruit_detail_notice_text}>
                                다음의 경우에 해당될 시, 채용 절차가 중단되거나 입사가 중단될 수 있습니다:
                            </p>
                            <ul className={styles.recruit_detail_notice_list}>
                                <li>지원자가 채용과 관련하여 부당한 청탁이나 부적절한 요청을 한 경우</li>
                                <li>지원자가 국내 취업 또는 해외 여행에 결격 사유가 있는 경우</li>
                                <li>회사 규정상 직무 수행에 지장을 줄 수 있는 징계 이력, 법 위반 사항 또는 기타 결격 사유가 발견된 경우</li>
                                <li>지원 과정에서 제출된 정보가 허위거나 증빙 불가하거나 고의 누락된 사실이 발견된 경우</li>
                                <li>사회통념상 고용 유지가 어려운 정당한 사유가 발생한 경우</li>
                            </ul>
                            <p className={styles.recruit_detail_notice_text}>
                                귀하가 지원서를 제출하는 경우, 개인정보 제3자 제공 및 당사의 개인정보처리방침에
                                동의한 것으로 간주됩니다.
                            </p>
                        </section>

                        <section className={styles.recruit_detail_request}>
                            <BigtabletLink className={styles.recruit_detail_request_button} href={`/recruit/${idx}/apply`}>
                                <Button>
                                    지원하기
                                </Button>
                            </BigtabletLink>
                            <p>
                                채용 관련 문의는{" "}
                                <a href="mailto:recruit@bigtablet.com">recruit@bigtablet.com</a>
                                으로 보내주시기 바랍니다.
                            </p>
                        </section>
                    </>
                )}
            </div>
        </Template>
    );
};

export default RecruitDetail;