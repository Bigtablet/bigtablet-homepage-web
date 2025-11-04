export interface CardProps {
    id: number;
    src: string;
    label: string;
    onOpen: (id: number, rect: DOMRect) => void;
};