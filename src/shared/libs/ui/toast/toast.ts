import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = (type: "success" | "error" | "info", message: string) => {
    const progressColorClass = `progress-${type}`;

    toast(message, {
        type,
        className: "toast-container",
        progressClassName: progressColorClass,
    });
};

Toast.success = (message: string) => Toast("success", message);
Toast.error = (message: string) => Toast("error", message);
Toast.info = (message: string) => Toast("info", message);

export { Toast };