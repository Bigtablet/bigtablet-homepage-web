"use client";

import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./style.module.scss";
import { TextField } from "@bigtablet/design-system";

type Props = {
    label?: string;
    value?: string;
    onChange: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
};

const toDate = (value?: string) => {
    if (!value) return null;
    const [y, m] = value.split("-").map(Number);
    if (!y || !m) return null;
    return new Date(y, m - 1, 1);
};

const toValue = (date: Date | null): string => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
};

const MonthInput = forwardRef<
    HTMLInputElement,
    React.ComponentProps<typeof TextField>
>((props, ref) => <TextField {...props} ref={ref} readOnly />);
MonthInput.displayName = "MonthInput";

const MonthPickerField = ({
                              label,
                              value,
                              onChange,
                              placeholder,
                              disabled,
                              error,
                              helperText,
                          }: Props) => {
    return (
        <div className={styles.month_picker}>
            {label && (
                <label className={styles.month_picker_label}>{label}</label>
            )}

            <DatePicker
                selected={toDate(value)}
                onChange={(date) => onChange(toValue(date))}
                dateFormat="yyyy.MM"
                showMonthYearPicker
                locale={ko}
                disabled={disabled}
                customInput={
                    <MonthInput
                        placeholder={placeholder ?? "YYYY.MM"}
                        size="sm"
                        error={error}
                        helperText={helperText}
                    />
                }
                className={styles.month_picker_input}
                calendarClassName={styles.month_picker_popup}
            />
        </div>
    );
};

export default MonthPickerField;