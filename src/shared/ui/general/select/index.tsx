"use client"

import * as React from "react";
import "./style.scss";
import { ChevronDown, Check } from "lucide-react";

export type SelectSize = "sm" | "md" | "lg";
export type SelectVariant = "outline" | "filled" | "ghost";

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps {
    id?: string;
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: string | null;
    onChange?: (value: string | null, option?: SelectOption | null) => void;
    defaultValue?: string | null;
    disabled?: boolean;
    size?: SelectSize;
    variant?: SelectVariant;
    fullWidth?: boolean;
    className?: string;
}

export function Select({
                           id,
                           label,
                           placeholder = "Select…",
                           options,
                           value,
                           onChange,
                           defaultValue = null,
                           disabled,
                           size = "md",
                           variant = "outline",
                           fullWidth,
                           className
                       }: SelectProps) {
    const internalId = React.useId();
    const selectId = id ?? internalId;

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string | null>(defaultValue);
    const currentValue = isControlled ? (value ?? null) : internal;

    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState<number>(-1);

    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);

    const currentOption = React.useMemo(
        () => options.find(o => o.value === currentValue) ?? null,
        [options, currentValue]
    );

    const setValue = React.useCallback(
        (next: string | null) => {
            const opt = options.find(o => o.value === next) ?? null;
            if (!isControlled) setInternal(next);
            onChange?.(next, opt);
        },
        [isControlled, onChange, options]
    );

    // 외부 클릭 닫기
    React.useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    // 키보드
    const moveActive = (dir: 1 | -1) => {
        if (!open) { setOpen(true); return; }
        let i = activeIndex;
        const len = options.length;
        for (let step = 0; step < len; step++) {
            i = (i + dir + len) % len;
            if (!options[i].disabled) { setActiveIndex(i); break; }
        }
    };

    const commitActive = () => {
        if (activeIndex < 0 || activeIndex >= options.length) return;
        const opt = options[activeIndex];
        if (!opt.disabled) {
            setValue(opt.value);
            setOpen(false);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;
        switch (e.key) {
            case " ":
            case "Enter":
                e.preventDefault();
                if (!open) setOpen(true);
                else commitActive();
                break;
            case "ArrowDown":
                e.preventDefault();
                moveActive(1);
                break;
            case "ArrowUp":
                e.preventDefault();
                moveActive(-1);
                break;
            case "Home":
                e.preventDefault();
                setOpen(true);
                setActiveIndex(options.findIndex(o => !o.disabled));
                break;
            case "End":
                e.preventDefault();
                setOpen(true);
                for (let i = options.length - 1; i >= 0; i--) {
                    if (!options[i].disabled) { setActiveIndex(i); break; }
                }
                break;
            case "Escape":
                e.preventDefault();
                setOpen(false);
                break;
        }
    };

    // 열릴 때 현재값으로 active 설정
    React.useEffect(() => {
        if (open) {
            const idx = Math.max(0, options.findIndex(o => o.value === currentValue && !o.disabled));
            setActiveIndex(idx === -1 ? 0 : idx);
        }
    }, [open, options, currentValue]);

    return (
        <div
            ref={wrapperRef}
            className={`select${className ? ` ${className}` : ""}`}
            style={fullWidth ? { width: "100%" } : undefined}
        >
            {label && (
                <label htmlFor={selectId} className="select__label">
                    {label}
                </label>
            )}

            <button
                id={selectId}
                type="button"
                className={[
                    "select__control",
                    `select__control--${variant}`,
                    `select__control--${size}`,
                    open && "is-open",
                    disabled && "is-disabled"
                ]
                    .filter(Boolean)
                    .join(" ")}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={`${selectId}-listbox`}
                onClick={() => !disabled && setOpen(o => !o)}
                onKeyDown={onKeyDown}
                disabled={disabled}
            >
        <span className={currentOption ? "select__value" : "select__placeholder"}>
          {currentOption ? currentOption.label : placeholder}
        </span>
                <span className="select__icon" aria-hidden>
          <ChevronDown size={16} />
        </span>
            </button>

            {open && (
                <ul
                    ref={listRef}
                    id={`${selectId}-listbox`}
                    role="listbox"
                    className="select__list"
                >
                    {options.map((opt, i) => {
                        const selected = currentValue === opt.value;
                        const active = i === activeIndex;
                        return (
                            <li
                                key={opt.value}
                                role="option"
                                aria-selected={selected}
                                className={[
                                    "select__option",
                                    selected && "is-selected",
                                    active && "is-active",
                                    opt.disabled && "is-disabled"
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                                onClick={() => {
                                    if (opt.disabled) return;
                                    setValue(opt.value);
                                    setOpen(false);
                                }}
                            >
                                <span>{opt.label}</span>
                                {selected && <Check size={16} aria-hidden />}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}