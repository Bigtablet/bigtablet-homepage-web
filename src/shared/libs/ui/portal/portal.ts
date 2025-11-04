"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
    children: React.ReactNode;
}

const Portal = ({ children }: PortalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const el = document.getElementById("modal");
    if (!el) return null;

    return ReactDOM.createPortal(children, el);
};

export default Portal;