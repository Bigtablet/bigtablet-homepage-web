"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";
import "./style.scss";

// 로고 이미지 추가는 여기서 해주세요
const logos = [
    "/images/collaborations/google.png",
    "/images/collaborations/nvdia.png",
];

const Collaborations = ({speed = 40}: { speed?: number }) => {
    return (
        <section className="collabs">
            <h3 className="collabs__title">Collaborations</h3>
            <div className="collabs__viewport">
                <Marquee gradient={false} speed={speed} autoFill>
                    {logos.map((src, i) => (
                        <div className="collabs__card" key={`${src}-${i}`}>
                            <Image
                                src={src}
                                alt=""
                                width={260}
                                height={80}
                                priority={i < 4}
                                draggable={false}
                            />
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default Collaborations;