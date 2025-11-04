export type Dir = "next" | "prev";

export interface ModalAnimVars {
    dx: number;
    dy: number;
    sx: number;
    sy: number;
}

export interface ModalItem {
    id: number;
    src: string;
}

export interface ModalProps {
    current: ModalItem,
    ghost: ModalItem | null,
    sliding: { dir: Dir } | null,
    animVars: ModalAnimVars | null,
    isEntering: boolean,
    blockBackdropClose: boolean,
    prev: () => void,
    next: () => void,
    close: () => void,
    scheduleClose?: (delay?: number) => void
}