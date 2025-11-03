import "./style.scss";

import {ButtonProps} from "src/shared/ui/button/type";

const Button = ({children, disabled, onClick, type = "button", style}: ButtonProps) => {
    return (
        <button
            className="component__button"
            disabled={disabled}
            onClick={onClick}
            type={type}
            style={style}
        >{children}</button>
    )
}

export default Button;