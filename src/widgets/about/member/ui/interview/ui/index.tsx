"use client";

import "./style.scss";
import {QAItem} from "../type";

const Interview = ({ items }: { items: QAItem[] }) => {
    return (
        <main className="interview" aria-label="Interview">
            <div className="interview__scroll">
                {items.length > 0 ? (
                    items.map((it, i) => (
                        <article className="qa" key={i}>
                            <h3 className="qa__q">{it.q}</h3>
                            <p className="qa__a">{it.a}</p>
                        </article>
                    ))
                ) : (
                    <p className="interview__empty">No interview data available.</p>
                )}
            </div>
        </main>
    );
};

export default Interview;