"use client";

import "./style.scss";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import AdminLayout from "src/components/common/admin/layout";
import {
    useRecruitApplicantDetailQuery,
    useRecruitApplicantAcceptMutation,
    useRecruitApplicantRejectMutation,
} from "src/queries/recruit/recruit.query";
import {
    statusLabel,
    educationLabel,
    militaryLabel,
    departmentLabel,
} from "src/utils/job/label";
import { Toast } from "src/libs/toast/toast";

const formatDateTime = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const JobDetail = () => {
    const { idx } = useParams<{ idx: string }>();
    const n = Number(idx);
    if (!Number.isFinite(n)) notFound();

    const { data, isLoading, isError } = useRecruitApplicantDetailQuery(n);

    const accept = useRecruitApplicantAcceptMutation({
        onSuccess: () => Toast("success", "합격 처리되었습니다."),
        onError: () => Toast("error", "합격 처리에 실패했습니다."),
    });

    const reject = useRecruitApplicantRejectMutation({
        onSuccess: () => Toast("success", "불합격 처리되었습니다."),
        onError: () => Toast("error", "불합격 처리에 실패했습니다."),
    });

    const pending = accept.isPending || reject.isPending;

    return (
        <AdminLayout>
            <main className="applicant-detail">
                <header className="applicant-detail__header">
                    <h1 className="applicant-detail__title">지원자 상세</h1>

                    <div className="actions">
                        <button
                            className="btn"
                            disabled={!data || pending}
                            onClick={() => {
                                if (!data) return;
                                if (confirm("이 지원자를 불합격 처리하시겠습니까?")) {
                                    reject.mutate(n);
                                }
                            }}
                        >
                            {reject.isPending ? "불합격 처리 중…" : "불합격"}
                        </button>

                        <button
                            className="btn btn--primary"
                            disabled={!data || pending}
                            onClick={() => {
                                if (!data) return;
                                if (confirm("이 지원자를 합격 처리하시겠습니까?")) {
                                    accept.mutate(n);
                                }
                            }}
                        >
                            {accept.isPending ? "합격 처리 중…" : "합격"}
                        </button>

                        <Link href="/admin/applicants" className="btn">목록으로</Link>
                    </div>
                </header>

                {isLoading ? (
                    <div className="card card--muted">불러오는 중...</div>
                ) : isError || !data ? (
                    <div className="card card--muted">데이터를 불러오지 못했습니다.</div>
                ) : (
                    <>
                        <section className="card applicant-detail__profile">
                            <img src={data.profileImage} alt={data.name} className="applicant-detail__thumb" />
                            <div className="profile__info">
                                <div className="row"><div className="label">이름</div><div className="value">{data.name}</div></div>
                                <div className="row"><div className="label">이메일</div><div className="value">{data.email}</div></div>
                                <div className="row"><div className="label">전화번호</div><div className="value">{data.phoneNumber}</div></div>
                                <div className="row">
                                    <div className="label">지원상태</div>
                                    <div className={`value status status--${String(data.status).toLowerCase()}`}>{statusLabel(data.status)}</div>
                                </div>
                                <div className="row"><div className="label">등록일</div><div className="value">{formatDateTime(data.createdAt)}</div></div>
                                <div className="row"><div className="label">수정일</div><div className="value">{formatDateTime(data.modifiedAt)}</div></div>
                            </div>
                        </section>

                        <section className="card">
                            <div className="section-title">학력 / 병역</div>
                            <div className="grid">
                                <div className="row"><div className="label">학력</div><div className="value">{educationLabel(data.educationLevel)}</div></div>
                                <div className="row"><div className="label">학교</div><div className="value">{data.schoolName ?? "-"}</div></div>
                                <div className="row"><div className="label">전공</div><div className="value">{departmentLabel(data.department) || "-"}</div></div>
                                <div className="row"><div className="label">입학</div><div className="value">{data.admissionYear ?? "-"}</div></div>
                                <div className="row"><div className="label">졸업</div><div className="value">{data.graduationYear ?? "-"}</div></div>
                                <div className="row"><div className="label">병역</div><div className="value">{militaryLabel(data.military)}</div></div>
                            </div>
                        </section>

                        <section className="card">
                            <div className="section-title">주소</div>
                            <div className="grid">
                                <div className="row"><div className="label">기본주소</div><div className="value">{data.address}</div></div>
                                <div className="row"><div className="label">상세주소</div><div className="value">{data.addressDetail}</div></div>
                            </div>
                        </section>

                        <section className="card">
                            <div className="section-title">첨부 및 링크</div>
                            <div className="grid">
                                <div className="row">
                                    <div className="label">포트폴리오</div>
                                    <div className="value"><a href={data.portfolio} target="_blank" rel="noreferrer" className="link">{data.portfolio}</a></div>
                                </div>
                                <div className="row">
                                    <div className="label">첨부 1</div>
                                    <div className="value">{data.attachment1 ? <a className="link" href={data.attachment1} target="_blank" rel="noreferrer">{data.attachment1}</a> : "-"}</div>
                                </div>
                                <div className="row">
                                    <div className="label">첨부 2</div>
                                    <div className="value">{data.attachment2 ? <a className="link" href={data.attachment2} target="_blank" rel="noreferrer">{data.attachment2}</a> : "-"}</div>
                                </div>
                                <div className="row">
                                    <div className="label">첨부 3</div>
                                    <div className="value">{data.attachment3 ? <a className="link" href={data.attachment3} target="_blank" rel="noreferrer">{data.attachment3}</a> : "-"}</div>
                                </div>
                            </div>
                        </section>

                        <section className="card">
                            <div className="section-title">자기소개서</div>
                            <div className="cover-letter">{data.coverLetter || "-"}</div>
                        </section>
                    </>
                )}
            </main>
        </AdminLayout>
    );
}

export default JobDetail;