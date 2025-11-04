"use client";

import { memo } from "react";
import {
    DEPARTMENTS,
    EDUCATIONS,
    RECRUIT_TYPES,
    departmentLabel,
    educationLabel,
    recruitTypeLabel,
} from "src/entities/recruit/constants/recruit.constants";
import {
    DepartmentType,
    EducationType,
    RecruitType,
} from "src/entities/recruit/model/schema/recruit.schema";
import type { RecruitSearchFilters } from "src/features/recruit/model/query/search/recruit.search.query";
import "./style.scss";

interface Props {
    filters: RecruitSearchFilters;
    onChange: (next: RecruitSearchFilters) => void;
}

const RecruitHeader = ({ filters, onChange }: Props) => {
    const patch = (p: Partial<RecruitSearchFilters>) => onChange({ ...filters, ...p });

    return (
        <header className="recruit-header">
            <div className="recruit-header__text">
                <h2>픽셀 너머의 세상을 향해</h2>
                <p>빅태블릿의 여정을 함께하실 파트너 분들을 모집합니다.</p>
            </div>

            <div className="recruit-search">
                <input
                    type="text"
                    className="recruit-search__input"
                    placeholder="직무 혹은 공고 이름으로 검색하실 수 있습니다."
                    value={filters.keyword ?? ""}
                    onChange={(e) => patch({ keyword: e.target.value })}
                />

                <select
                    className="recruit-search__select"
                    value={filters.job ?? ""}
                    onChange={(e) => patch({ job: e.target.value })}
                >
                    <option value="">직무</option>
                    {DEPARTMENTS.map((code: typeof DepartmentType._type) => (
                        <option key={code} value={code}>
                            {departmentLabel(code)}
                        </option>
                    ))}
                </select>

                <select
                    className="recruit-search__select"
                    value={filters.education ?? ""}
                    onChange={(e) => patch({ education: e.target.value })}
                >
                    <option value="">학력</option>
                    {EDUCATIONS.map((code: typeof EducationType._type) => (
                        <option key={code} value={code}>
                            {educationLabel(code)}
                        </option>
                    ))}
                </select>

                <select
                    className="recruit-search__select"
                    value={filters.career ?? ""}
                    onChange={(e) => patch({ career: e.target.value })}
                >
                    <option value="">고용형태</option>
                    {RECRUIT_TYPES.map((code: typeof RecruitType._type) => (
                        <option key={code} value={code}>
                            {recruitTypeLabel(code)}
                        </option>
                    ))}
                </select>
            </div>
        </header>
    );
};

export default memo(RecruitHeader);