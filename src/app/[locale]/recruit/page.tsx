"use client";

import { useState } from "react";
import Template from "src/components/common/template";
import RequestList from "src/components/recruit/list";
import "./style.scss";

const Recruit = () => {
    const [filters, setFilters] = useState({
        keyword: "",
        job: "",
        education: "",
        career: "",
    });

    const handleChange = (next: Partial<typeof filters>) =>
        setFilters((prev) => ({ ...prev, ...next }));

    return (
        <Template>
            <div className="recruit-header">
                <div className="recruit-header__text">
                    <h2>픽셀 너머의 세상을 향해</h2>
                    <p>빅태블릿의 여정에 함께하실 파트너 분들을 모집합니다.</p>
                </div>

                <div className="recruit-search">
                    <input
                        type="text"
                        className="recruit-search__input"
                        placeholder="직무 혹은 공고 이름으로 검색하실 수 있습니다."
                        value={filters.keyword}
                        onChange={(e) => handleChange({ keyword: e.target.value })}
                    />

                    <select
                        className="recruit-search__select"
                        value={filters.job}
                        onChange={(e) => handleChange({ job: e.target.value })}
                    >
                        <option value="">직무</option>
                        <option value="dev">개발</option>
                        <option value="design">디자인</option>
                        <option value="pm">기획</option>
                    </select>

                    <select
                        className="recruit-search__select"
                        value={filters.education}
                        onChange={(e) => handleChange({ education: e.target.value })}
                    >
                        <option value="">학력</option>
                        <option value="high">고졸</option>
                        <option value="bachelor">대졸</option>
                        <option value="master">석사 이상</option>
                    </select>

                    <select
                        className="recruit-search__select"
                        value={filters.career}
                        onChange={(e) => handleChange({ career: e.target.value })}
                    >
                        <option value="">경력</option>
                        <option value="junior">신입</option>
                        <option value="senior">경력</option>
                    </select>
                </div>
                <div id="divider" />
            </div>

            <div className="request-list">
                <RequestList />
            </div>
        </Template>
    );
};

export default Recruit;