import React from "react";
import "../style.scss";
import {CompanyTextFieldProps} from "src/types/ui/textField/company/companyTextField.type";

const CompanyTextField = ({ label, name, value, placeholder, onChange }: CompanyTextFieldProps) => {
    return (
        <div className="company-textfield">
            <label className="company-textfield__label" htmlFor={name}>
                {label}
            </label>
            <input
                id={name}
                name={name}
                className="company-textfield__input"
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    );
};

export default CompanyTextField;