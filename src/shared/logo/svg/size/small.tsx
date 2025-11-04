const SmallLogo = () => {
    const w = 180;
    const h = 58;

    return (
        <svg
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <clipPath id="logoClip">
                    <rect x="0" y="0" width={w} height={h} />
                </clipPath>
            </defs>

            <image
                href="/images/smalllogo.png"
                x="0"
                y="0"
                width={w}
                height={h}
                preserveAspectRatio="xMidYMid slice" // 비율 유지하며 꽉 채우기
                clipPath="url(#logoClip)"
            />
        </svg>
    );
};

export default SmallLogo;