import React from "react";
import "../style.scss";
import {CompanyTextFieldProps} from "src/types/ui/textField/company/companyTextField.type";

const CompanyViewField = ({ label, name, value }: CompanyTextFieldProps) => {
    return (
        <div className="company-textfield company-textfield--view" data-name={name}>
            <p className="company-textfield__label">{label}</p>
            <p className="company-textfield__value">{value}</p>
        </div>
    );
};

export default CompanyViewField;