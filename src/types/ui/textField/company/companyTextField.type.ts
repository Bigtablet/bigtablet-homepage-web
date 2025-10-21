export interface CompanyTextFieldProps {
    label: string;
    name?: string;
    value: string;
    placeholder?: string;
    editable?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
};