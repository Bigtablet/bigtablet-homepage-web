export interface TextFieldProps {
    label?: string;
    placeholder:string;
    name: string;
    value: string;
    type?: "text" | "password";
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}