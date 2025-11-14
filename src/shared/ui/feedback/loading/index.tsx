import * as React from "react";
import "./style.scss";

export const Loading = ({ size = 24 }: { size?: number }) => {
    return <span className="loading" style={{ width: size, height: size }} aria-label="Loading" />;
};