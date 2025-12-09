"use client";

import { memo, useState } from "react";
import {
    DEPARTMENTS,
    EDUCATIONS,
    RECRUIT_TYPES,
    departmentLabel,
    educationLabel,
    recruitTypeLabel,
} from "src/entities/recruit/model/constants/recruit.constants";
import styles from "./style.module.scss";
import type {
    DepartmentType,
    EducationType,
    RecruitType,
} from "src/entities/recruit/model/enum/recruit.enum";
import { RecruitSearchFilters } from "src/entities/recruit/api/recruit.api";
import { z } from "zod";
import TalentFormModal from "src/widgets/talent/form/modal";


type DepartmentCode = z.infer<typeof DepartmentType>;
type EducationCode = z.infer<typeof EducationType>;
type RecruitTypeCode = z.infer<typeof RecruitType>;

interface Props {
    filters: RecruitSearchFilters;
    onChange: (next: RecruitSearchFilters) => void;
}

const RecruitHeader = ({ filters, onChange }: Props) => {
    const patch = (p: Partial<RecruitSearchFilters>) => onChange({ ...filters, ...p });
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className={styles.recruit_header}>
                <div className={styles.recruit_header_text}>
                    <h2>픽셀 너머의 세상을 향해</h2>
                    <p>빅태블릿의 여정을 함께하실 파트너 분들을 모집합니다.</p>
                </div>

                <div className={styles.recruit_search}>
                    <input
                        type="text"
                        className={styles.recruit_search_input}
                        placeholder="직무 혹은 공고 이름으로 검색하실 수 있습니다."
                        value={filters.keyword ?? ""}
                        onChange={(e) => patch({ keyword: e.target.value })}
                    />

                    <select
                        className={styles.recruit_search_select}
                        value={filters.job ?? ""}
                        onChange={(e) => patch({ job: e.target.value })}
                    >
                        <option value="">직무</option>
                        {DEPARTMENTS.map((code: DepartmentCode) => (
                            <option key={code} value={code}>
                                {departmentLabel(code)}
                            </option>
                        ))}
                    </select>

                    <select
                        className={styles.recruit_search_select}
                        value={filters.education ?? ""}
                        onChange={(e) => patch({ education: e.target.value })}
                    >
                        <option value="">학력</option>
                        {EDUCATIONS.map((code: EducationCode) => (
                            <option key={code} value={code}>
                                {educationLabel(code)}
                            </option>
                        ))}
                    </select>

                    <select
                        className={styles.recruit_search_select}
                        value={filters.career ?? ""}
                        onChange={(e) => patch({ career: e.target.value })}
                    >
                        <option value="">고용형태</option>
                        {RECRUIT_TYPES.map((code: RecruitTypeCode) => (
                            <option key={code} value={code}>
                                {recruitTypeLabel(code)}
                            </option>
                        ))}
                    </select>

                    {/* 인재풀 등록 버튼 */}
                    <button
                        className={styles.recruit_register_button}
                        onClick={() => setOpen(true)}
                    >
                        인재풀 등록하기
                    </button>
                </div>

                <hr className={styles.recruit_divider} />
            </header>

            {/* 인재풀 등록 모달 */}
            <TalentFormModal open={open} onClose={() => setOpen(false)} />
        </>
    );
};

export default memo(RecruitHeader);