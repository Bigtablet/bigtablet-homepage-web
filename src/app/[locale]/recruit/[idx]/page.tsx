"use client";

import { useParams } from "next/navigation";
import Template from "src/components/common/template";
import { useRecruitDetail } from "src/hooks/recruit/useRecruit";
import "./style.scss";
import Button from "src/components/ui/button";
import Link from "next/link";

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

const labelDept = (v: "BUSINESS_ADMINISTRATION" | "SALE" | "MARKETING" | "IT" | "DESIGN" | "RESEARCH_AND_DEVELOPMENT") =>
    v === "IT" ? "개발팀" :
        v === "BUSINESS_ADMINISTRATION" ? "경영관리" :
            v === "SALE" ? "영업" :
                v === "MARKETING" ? "마케팅" :
                    v === "DESIGN" ? "디자인" : "연구개발";

const labelRecruitType = (v: "FULL_TIME" | "CONTRACT" | "INTERN") =>
    v === "FULL_TIME" ? "정규직" : v === "CONTRACT" ? "계약직" : "인턴";
const labelLocation = (v: "SEOUL" | "DAEGU") => (v === "SEOUL" ? "서울" : "대구");
const labelEducation = (v: "HIGH_SCHOOL" | "ASSOCIATE" | "BACHELOR" | "NO_REQUIREMENT") =>
    v === "BACHELOR" ? "대졸" :
        v === "HIGH_SCHOOL" ? "고졸" :
            v === "ASSOCIATE" ? "전문학사" : "학력무관";

const BENEFITS: string[] = ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5", "Benefit 6"];
const HIRING_PROCESS: string[] = ["서류 전형", "1차 면접", "2차 면접 (필요시)", "처우 협의", "합류"];

const RecruitDetail = () => {
    const { locale, idx } = useParams<{ locale: string; idx: string }>();
    const idxNum = toIdx(idx);

    const { recruit: data, status, error } = useRecruitDetail(idxNum ?? -1, { enabled: idxNum !== null });

    return (
        <Template>
            <div className="recruit-detail">
                {status === "pending" && <div className="recruit-detail__loading">불러오는 중…</div>}
                {status === "error" && <div className="recruit-detail__error">불러오지 못했습니다. {(error as Error)?.message}</div>}

                {status === "success" && data && (
                    <>
                        <header className="recruit-detail__header">
                            <h1 className="recruit-detail__title">{data.title}</h1>

                            <div className="recruit-detail__meta">
                                <div className="recruit-detail__chips">
                                    <span className="chip">{labelDept(data.department)}</span>
                                    <span className="chip">{labelRecruitType(data.recruitType)}</span>
                                    <span className="chip">{labelLocation(data.location)}</span>
                                    <span className="chip">{labelEducation(data.education)}</span>
                                    {data.experiment && <span className="chip">{data.experiment}</span>}
                                </div>
                                <div className="recruit-detail__datebar">
                                    {formatDate(data.startDate)} - {data.endDate ? formatDate(data.endDate) : "상시"}
                                </div>
                            </div>
                        </header>

                        <section className="recruit-detail__section">
                            <h2>조직 소개</h2>
                            <p className="recruit-detail__text">{data.companyIntroduction}</p>
                        </section>

                        <section className="recruit-detail__section">
                            <h2>주요 업무</h2>
                            <p className="recruit-detail__text">{data.mainResponsibility}</p>
                        </section>

                        <section className="recruit-detail__section">
                            <h2>자격 요건</h2>
                            <p className="recruit-detail__text">{data.qualification}</p>
                        </section>

                        {data.preferredQualification && (
                            <section className="recruit-detail__section">
                                <h2>우대사항</h2>
                                <p className="recruit-detail__text">{data.preferredQualification}</p>
                            </section>
                        )}

                        {BENEFITS.length > 0 && (
                            <section className="recruit-detail__section">
                                <h2>복지 및 혜택</h2>
                                <ul className="recruit-detail__list">
                                    {BENEFITS.map((b, i) => <li key={`benefit-${i}`}>{b}</li>)}
                                </ul>
                            </section>
                        )}

                        {HIRING_PROCESS.length > 0 && (
                            <section className="recruit-detail__section">
                                <h2>채용 절차</h2>
                                <p className="recruit-detail__process">{HIRING_PROCESS.join(" → ")}</p>
                            </section>
                        )}

                        <section className="recruit-detail-request">
                            <Button>
                                <Link href={`/${locale}/recruit/${idx}/apply`}>지원하기</Link>
                            </Button>
                            <p>궁금하신 부분이나 기타 채용 관련 문의사항은 recruit@bigtablet.com 으로 연락 바랍니다</p>
                        </section>
                    </>
                )}
            </div>
        </Template>
    );
};

export default RecruitDetail;