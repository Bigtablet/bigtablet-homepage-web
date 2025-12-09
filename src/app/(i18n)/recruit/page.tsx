"use client";

import { useState } from "react";
import Template from "src/widgets/layout/template";
import RecruitHeader from "src/widgets/recruit/main/header";
import RequestList from "src/widgets/recruit/main/list";
import "./style.scss";
import {RecruitSearchFilters} from "src/entities/recruit/api/recruit.api";

const RecruitPage = () => {
    const [filters, setFilters] = useState<RecruitSearchFilters>({
        keyword: "",
        job: "",
        education: "",
        career: "",
    });

    return (
        <Template>
            <section className="recruit-page">
                <RecruitHeader filters={filters} onChange={setFilters} />

                <div className="recruit-page__list">
                    <RequestList filters={filters} />
                </div>
            </section>
        </Template>
    );
};

export default RecruitPage;