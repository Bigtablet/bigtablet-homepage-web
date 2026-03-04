"use client";

import { useState } from "react";
import RecruitHeader from "src/widgets/recruit/main/header";
import RequestList from "src/widgets/recruit/main/list";
import styles from "./style.module.scss";
import { RecruitSearchFilters } from "src/entities/recruit/api/recruit.api";

const RecruitPage = () => {
    const [filters, setFilters] = useState<RecruitSearchFilters>({
        keyword: "",
        job: "",
        education: "",
        career: "",
    });

    return (
        <section className={styles.recruit_page}>
            <RecruitHeader filters={filters} onChange={setFilters} />

            <div className={styles.recruit_page_list}>
                <RequestList filters={filters} />
            </div>
        </section>
    );
};

export default RecruitPage;
