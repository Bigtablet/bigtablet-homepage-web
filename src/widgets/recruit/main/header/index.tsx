"use client";

import { Button, Select, type SelectOption, TextField } from "@bigtablet/design-system";
import { memo, useState } from "react";
import type { RecruitSearchFilters } from "src/entities/recruit/api/recruit.api";
import {
	DEPARTMENTS,
	departmentLabel,
	EDUCATIONS,
	educationLabel,
	RECRUIT_TYPES,
	recruitTypeLabel,
} from "src/entities/recruit/constants/recruit.constants";
import TalentFormModal from "src/features/talent/form/modal";

import styles from "./style.module.scss";

/* 정적 옵션 — 매 렌더 재생성 방지 위해 모듈 스코프 상수로 */
const toOptions = <T extends string>(codes: readonly T[], getLabel: (code: T) => string) =>
	codes.map<SelectOption>((code) => ({ value: code, label: getLabel(code) }));

const DEPARTMENT_OPTIONS = toOptions(DEPARTMENTS, departmentLabel);
const EDUCATION_OPTIONS = toOptions(EDUCATIONS, educationLabel);
const RECRUIT_TYPE_OPTIONS = toOptions(RECRUIT_TYPES, recruitTypeLabel);

interface Props {
	filters: RecruitSearchFilters;
	onChange: (next: RecruitSearchFilters) => void;
}

const RecruitHeader = ({ filters, onChange }: Props) => {
	const patch = (partial: Partial<RecruitSearchFilters>) => onChange({ ...filters, ...partial });
	const [open, setOpen] = useState(false);

	return (
		<>
			<header className={styles.recruit_header}>
				<div className={styles.recruit_header_text}>
					<h2>픽셀 너머의 세상을 향해</h2>
					<p>빅태블릿의 여정을 함께하실 파트너 분들을 모집합니다.</p>
				</div>

				<div className={styles.recruit_search}>
					<TextField
						placeholder="직무 혹은 공고 이름으로 검색하실 수 있습니다."
						value={filters.keyword ?? ""}
						onChangeAction={(value) => patch({ keyword: value })}
						size="sm"
						className={styles.recruit_search_field}
					/>

					<Select
						placeholder="직무"
						options={DEPARTMENT_OPTIONS}
						value={filters.job ?? null}
						onChange={(value) => patch({ job: value ?? "" })}
						size="sm"
						className={styles.recruit_search_select}
					/>

					<Select
						placeholder="학력"
						options={EDUCATION_OPTIONS}
						value={filters.education ?? null}
						onChange={(value) => patch({ education: value ?? "" })}
						size="sm"
						className={styles.recruit_search_select}
					/>

					<Select
						placeholder="고용형태"
						options={RECRUIT_TYPE_OPTIONS}
						value={filters.career ?? null}
						onChange={(value) => patch({ career: value ?? "" })}
						size="sm"
						className={styles.recruit_search_select}
					/>

					<Button variant="primary" size="sm" width="auto" onClick={() => setOpen(true)}>
						인재풀 등록하기
					</Button>
				</div>

				<hr className={styles.recruit_divider} />
			</header>

			<TalentFormModal open={open} onClose={() => setOpen(false)} />
		</>
	);
};

export default memo(RecruitHeader);
