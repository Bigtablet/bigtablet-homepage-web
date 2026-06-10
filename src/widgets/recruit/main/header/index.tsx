"use client";

import { Button, Dropdown, type DropdownOption, TextField } from "@bigtablet/design-system";
import { useTranslations } from "next-intl";
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
	codes.map<DropdownOption>((code) => ({ value: code, label: getLabel(code) }));

const DEPARTMENT_OPTIONS = toOptions(DEPARTMENTS, departmentLabel);
const EDUCATION_OPTIONS = toOptions(EDUCATIONS, educationLabel);
const RECRUIT_TYPE_OPTIONS = toOptions(RECRUIT_TYPES, recruitTypeLabel);

interface Props {
	filters: RecruitSearchFilters;
	onChange: (next: RecruitSearchFilters) => void;
}

const RecruitHeader = ({ filters, onChange }: Props) => {
	const t = useTranslations("recruit");
	const patch = (partial: Partial<RecruitSearchFilters>) => onChange({ ...filters, ...partial });
	const [open, setOpen] = useState(false);

	return (
		<>
			<header className={styles.recruit_header}>
				<div className={styles.recruit_header_text}>
					<h2>{t("header.title")}</h2>
					<p>{t("header.description")}</p>
				</div>

				<div className={styles.recruit_search}>
					<TextField
						placeholder={t("header.searchPlaceholder")}
						value={filters.keyword ?? ""}
						onChangeAction={(value) => patch({ keyword: value })}
						size="sm"
						className={styles.recruit_search_field}
					/>

					<Dropdown
						placeholder={t("header.filterJob")}
						options={DEPARTMENT_OPTIONS}
						value={filters.job ?? null}
						onChange={(value) => patch({ job: value ?? "" })}
						size="sm"
						className={styles.recruit_search_select}
					/>

					<Dropdown
						placeholder={t("header.filterEducation")}
						options={EDUCATION_OPTIONS}
						value={filters.education ?? null}
						onChange={(value) => patch({ education: value ?? "" })}
						size="sm"
						className={styles.recruit_search_select}
					/>

					<Dropdown
						placeholder={t("header.filterCareer")}
						options={RECRUIT_TYPE_OPTIONS}
						value={filters.career ?? null}
						onChange={(value) => patch({ career: value ?? "" })}
						size="sm"
						className={styles.recruit_search_select}
					/>

					<Button
						variant="filled"
						size="sm"
						className={styles.recruit_search_button}
						onClick={() => setOpen(true)}
					>
						{t("header.registerTalent")}
					</Button>
				</div>

				<hr className={styles.recruit_divider} />
			</header>

			<TalentFormModal open={open} onClose={() => setOpen(false)} />
		</>
	);
};

export default memo(RecruitHeader);
