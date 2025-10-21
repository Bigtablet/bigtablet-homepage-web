export interface ButtonType {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    style?: React.CSSProperties;
}