type FilePickerProps = {
    id: string;
    name: string;
    label: string;
    accept: string;
    fileName?: string;
    sub?: string;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    compact?: boolean;
};

const FilePicker = ({
                        id,
                        name,
                        label,
                        accept,
                        fileName,
                        sub,
                        required,
                        onChange,
                        compact,
                    }: FilePickerProps) => {
    return (
        <div className="field">
            <label>
                {label} {sub && <span className="sub">{sub}</span>}
            </label>
            <div className={`file${compact ? " row" : ""}`}>
                <input
                    id={id}
                    name={name}
                    type="file"
                    accept={accept}
                    className="visually-hidden"
                    onChange={onChange}
                    required={required}
                />
                <label htmlFor={id} className="file__trigger">
                    파일 선택
                </label>
                <span className="file__name">{fileName || "선택된 파일 없음"}</span>
            </div>
        </div>
    );
};

export default FilePicker;