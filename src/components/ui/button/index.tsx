import {ButtonType} from "src/types/ui/button/button.type";
import "./style.scss";

const Button = ({children, disabled, onClick, type = "button", style}: ButtonType) => {
    return (
        <button
            className="component-button"
            disabled={disabled}
            onClick={onClick}
            type={type}
            style={style}
        >{children}</button>
    )
}

export default Button;