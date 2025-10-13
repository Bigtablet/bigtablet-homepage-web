"use client";

import { useMemo } from "react";
import Image from "next/image";

type Props = {
    logos: string[];      
    speedSec?: number;
    minCards?: number;
};

const buildPattern = (logos: string[], need: number) => {
    if (!logos?.length) return [];
    const out: string[] = new Array(need);
    for (let i = 0; i < need; i++) {
        out[i] = logos[i % logos.length];
    }
    return out;
};

const Marquee = ({ logos, speedSec = 2, minCards = 100 }: Props) => {
    const need = Math.max(minCards, logos.length || 0);

    const base = useMemo(() => buildPattern(logos, need), [logos, need]);

    const loop = useMemo(() => (base.length ? [...base, ...base] : []), [base]);

    if (!base.length) return null;

    return (
        <section className="collabs" style={{ ["--marquee-speed" as any]: `${speedSec}s` }}>
            <h3 className="collabs__title">Collaborations</h3>
            <div className="collabs__viewport">
                <div className="collabs__track" aria-hidden="true">
                    {loop.map((src, i) => (
                        <div className="collabs__item" key={`${src}-${i}`}>
                            <div className="collabs__card">
                                <Image
                                    src={src}
                                    alt=""
                                    unoptimized
                                    width={260}
                                    height={92}
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    priority={i < 2}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Marquee;