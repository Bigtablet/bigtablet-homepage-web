"use client";

import { useState } from "react";
import Frame from "src/widgets/layout/template";
import RecruitHeader from "src/widgets/recruit/header/ui";
import RequestList from "src/features/recruit/list/ui";
import type { RecruitSearchFilters } from "src/features/recruit/model/query/search/recruit.search.query";
import "./style.scss";

const RecruitPage = () => {
    const [filters, setFilters] = useState<RecruitSearchFilters>({
        keyword: "",
        job: "",
        education: "",
        career: "",
    });

    return (
        <Frame>
            <section className="recruit-page">
                <RecruitHeader filters={filters} onChange={setFilters} />

                <div className="recruit-page__list">
                    <RequestList filters={filters} />
                </div>
            </section>
        </Frame>
    );
};

export default RecruitPage;