"use client";

import { ko } from "date-fns/locale";
import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TextField } from "@bigtablet/design-system";
import styles from "./style.module.scss";

type Props = {
	label?: string;
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: boolean;
	supportingText?: string;
};

const toDate = (value?: string) => {
	if (!value) return null;
	const [year, month] = value.split("-").map(Number);
	if (!year || !month) return null;
	return new Date(year, month - 1, 1);
};

const toValue = (date: Date | null): string => {
	if (!date) return "";
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	return `${year}-${month}`;
};

const MonthInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof TextField>>(
	(props, ref) => <TextField {...props} ref={ref} readOnly />,
);
MonthInput.displayName = "MonthInput";

/**
 * @component MonthPickerField
 *
 * @description
 * 연-월 선택 날짜 피커 컴포넌트.
 * react-datepicker 기반으로 "YYYY.MM" 형식을 사용한다.
 *
 * @param props.value - "YYYY-MM" 형식 문자열
 * @param props.onChange - 선택 변경 콜백 ("YYYY-MM" 문자열 전달)
 */
const MonthPickerField = ({
	label,
	value,
	onChange,
	placeholder,
	disabled,
	error,
	supportingText,
}: Props) => {
	return (
		<div className={styles.month_picker}>
			{label && <span className={styles.month_picker_label}>{label}</span>}

			<DatePicker
				selected={toDate(value)}
				onChange={(date: Date | null) => onChange(toValue(date))}
				dateFormat="yyyy.MM"
				showMonthYearPicker
				locale={ko}
				disabled={disabled}
				customInput={
					<MonthInput
						placeholder={placeholder ?? "YYYY.MM"}
						error={error}
						supportingText={supportingText}
					/>
				}
				className={styles.month_picker_input}
				calendarClassName={styles.month_picker_popup}
			/>
		</div>
	);
};

export default MonthPickerField;
