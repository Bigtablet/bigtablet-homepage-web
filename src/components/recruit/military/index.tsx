type Props = { required?: boolean };

const MilitarySelect = ({ required }: Props) => {
    return (
        <div className="field">
            <label>병역 사항{required ? "*" : ""}</label>
            <select name="military" defaultValue="" required={required}>
                <option value="" disabled>
                    병역 사항 선택
                </option>
                <option value="DONE">군필</option>
                <option value="PENDING">미필</option>
                <option value="EXEMPT">면제</option>
                <option value="NA">해당사항 없음(여성 등)</option>
            </select>
        </div>
    );
};

export default MilitarySelect;