export interface Option {
    label: string;
    value: string;
}

export interface SearchFilters {
    keyword: string;
    job: string;
    education: string;
    career: string;
}

export interface SearchBarProps extends SearchFilters {
    jobOptions: Option[];
    educationOptions: Option[];
    careerOptions: Option[];
    onChange: (next: Partial<SearchFilters>) => void;
}