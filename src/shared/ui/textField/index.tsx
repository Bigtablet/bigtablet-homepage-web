import "./style.scss";
import {TextFieldProps} from "src/shared/ui/textField/type";

const TextField = ({label, name, value, placeholder, type="text", onChange}: TextFieldProps) => {
    return (
        <div className="text-field">
            <p>{label}</p>
            <input type={type} name={name} value={value ?? ""} placeholder={placeholder} onChange={onChange} />
        </div>
    )
}

export default TextField;