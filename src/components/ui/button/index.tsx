import {ButtonType} from "src/types/ui/button/button.type";
import "./style.scss";

const Button = ({children, disabled, onClick, type = "button"}: ButtonType) => {
    return (
        <button
            className="component-button"
            disabled={disabled}
            onClick={onClick}
            type={type}
        >{children}</button>
    )
}

export default Button;