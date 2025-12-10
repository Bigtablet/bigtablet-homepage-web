"use client";

import Link from "next/link";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
    underline?: boolean;
};

export const BigtabletLink = ({ underline = false, className, ...props }: Props) => {
    const merged = [
        "bt_link",
        underline && "bt_link--underline",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return <Link {...props} className={merged} />;
};