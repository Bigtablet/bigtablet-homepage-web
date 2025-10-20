"use client";

import AdminLayout from "src/components/common/admin/layout";

const Main = () => {
    return (
        <AdminLayout>
            {/* 여기에 메인 콘텐츠를 넣으면 됩니다 */}
            <section className="page-section">
                {/* 예시 컨텐츠 */}
                <h1 className="page-title">Welcome to Admin</h1>
            </section>
        </AdminLayout>
    );
};

export default Main;