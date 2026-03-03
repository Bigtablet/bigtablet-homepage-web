"use client";

import { Button, Select, TextField, type SelectOption } from "@bigtablet/design-system";
import { memo, useMemo, useState } from "react";
import {
	DEPARTMENTS,
	EDUCATIONS,
	RECRUIT_TYPES,
	departmentLabel,
	educationLabel,
	recruitTypeLabel,
} from "src/entities/recruit/constants/recruit.constants";
import styles from "./style.module.scss";
import type {
	DepartmentType,
	EducationType,
	RecruitType,
} from "src/entities/recruit/schema/recruit.enum";
import { RecruitSearchFilters } from "src/entities/recruit/api/recruit.api";
import { z } from "zod";
import TalentFormModal from "src/features/talent/form/modal";

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

	const departmentOptions: SelectOption[] = useMemo(
		() => DEPARTMENTS.map((code: DepartmentCode) => ({ value: code, label: departmentLabel(code) })),
		[],
	);

	const educationOptions: SelectOption[] = useMemo(
		() => EDUCATIONS.map((code: EducationCode) => ({ value: code, label: educationLabel(code) })),
		[],
	);

	const recruitTypeOptions: SelectOption[] = useMemo(
		() => RECRUIT_TYPES.map((code: RecruitTypeCode) => ({ value: code, label: recruitTypeLabel(code) })),
		[],
	);

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
						options={departmentOptions}
						value={filters.job ?? null}
						onChange={(value) => patch({ job: value ?? "" })}
						size="sm"
						className={styles.recruit_search_select}
					/>

					<Select
						placeholder="학력"
						options={educationOptions}
						value={filters.education ?? null}
						onChange={(value) => patch({ education: value ?? "" })}
						size="sm"
						className={styles.recruit_search_select}
					/>

					<Select
						placeholder="고용형태"
						options={recruitTypeOptions}
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
