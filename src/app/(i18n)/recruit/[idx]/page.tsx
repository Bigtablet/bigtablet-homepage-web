"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Template from "src/widgets/layout/template";
import {useRecruitDetailQuery} from "src/features/recruit/model/query/recruit.query";
import type { RecruitCard } from "src/entities/recruit/model/schema/recruit.schema";
import "./style.scss";
import {Button} from "src/shared/ui/general/button";

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

const BENEFITS: string[] = ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5", "Benefit 6"];
const HIRING_PROCESS: string[] = ["서류 전형", "1차 면접", "2차 면접 (필요시)", "처우 협의", "합류"];

const RecruitDetail = () => {
    const { idx } = useParams<{ locale: string; idx: string }>();
    const idxNum = toIdx(idx);

    const { data, status, error } = useRecruitDetailQuery(idxNum ?? -1, {
        enabled: idxNum !== null,
    });

    const recruit = data as RecruitCard | undefined;

    return (
        <Template>
            <div className="recruit-detail">
                {status === "pending" && (
                    <div className="recruit-detail__loading">불러오는 중…</div>
                )}

                {status === "error" && (
                    <div className="recruit-detail__error">
                        불러오지 못했습니다. {(error as Error)?.message}
                    </div>
                )}

                {status === "success" && recruit && (
                    <>
                        <header className="recruit-detail__header">
                            <h1 className="recruit-detail__title">{recruit.title}</h1>

                            <div className="recruit-detail__meta">
                                <div className="recruit-detail__chips">
                                    {recruit.tags.map((t, i) => (
                                        <span key={`tag-${i}`} className="chip">
                      {t}
                    </span>
                                    ))}
                                </div>

                                <div className="recruit-detail__datebar">
                                    {formatDate(recruit.startDate)} -{" "}
                                    {recruit.endDate ? formatDate(recruit.endDate) : "상시"}
                                </div>
                            </div>
                        </header>

                        <section className="recruit-detail__section">
                            <h2>조직 소개</h2>
                            <p className="recruit-detail__text">{recruit.companyIntroduction}</p>
                        </section>

                        <section className="recruit-detail__section">
                            <h2>주요 업무</h2>
                            <p className="recruit-detail__text">{recruit.mainResponsibility}</p>
                        </section>

                        <section className="recruit-detail__section">
                            <h2>자격 요건</h2>
                            <p className="recruit-detail__text">{recruit.qualification}</p>
                        </section>

                        {recruit.preferredQualification && (
                            <section className="recruit-detail__section">
                                <h2>우대사항</h2>
                                <p className="recruit-detail__text">
                                    {recruit.preferredQualification}
                                </p>
                            </section>
                        )}

                        {BENEFITS.length > 0 && (
                            <section className="recruit-detail__section">
                                <h2>복지 및 혜택</h2>
                                <ul className="recruit-detail__list">
                                    {BENEFITS.map((b, i) => (
                                        <li key={`benefit-${i}`}>{b}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {HIRING_PROCESS.length > 0 && (
                            <section className="recruit-detail__section">
                                <h2>채용 절차</h2>
                                <p className="recruit-detail__process">
                                    {HIRING_PROCESS.join(" → ")}
                                </p>
                            </section>
                        )}

                        <section className="recruit-detail-request">
                            <Button>
                                <Link href={`/recruit/${idx}/apply`}>지원하기</Link>
                            </Button>
                            <p>
                                궁금하신 부분이나 기타 채용 관련 문의사항은 recruit@bigtablet.com 으로 연락 바랍니다
                            </p>
                        </section>
                    </>
                )}
            </div>
        </Template>
    );
}

export default RecruitDetail;