"use client";

import "./style.scss";
import AdminLayout from "src/components/common/admin/layout";
import { getProfileQuery } from "src/queries/profile/profile.query";

const formatDateTime = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const ProfilePage = () => {
    const { data, isLoading, isError } = getProfileQuery();

    return (
        <AdminLayout>
            <main className="profile-page">
                <h1 className="profile-page__title">프로필</h1>

                {isLoading ? (
                    <div className="profile-card profile-card--loading">불러오는 중...</div>
                ) : isError || !data ? (
                    <div className="profile-card profile-card--error">정보를 불러오지 못했습니다.</div>
                ) : (
                    <section className="profile-card">
                        <div className="row">
                            <div className="label">이름</div>
                            <div className="value">{data.name}</div>
                        </div>
                        <div className="row">
                            <div className="label">이메일</div>
                            <div className="value">{data.email}</div>
                        </div>

                        <div className="divider" />

                        <div className="row">
                            <div className="label">가입일</div>
                            <div className="value">{formatDateTime(data.createdAt)}</div>
                        </div>
                        <div className="row">
                            <div className="label">수정일</div>
                            <div className="value">{formatDateTime(data.modifiedAt)}</div>
                        </div>
                    </section>
                )}
            </main>
        </AdminLayout>
    );
};

export default ProfilePage;