const BigLogo = () => {
    return (
        <svg width="460" height="118" viewBox="0 0 180 57" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="clip">
                    <rect width="460" height="118" rx="0" />
                </clipPath>
            </defs>
            <image
                href="/images/logo/biglogo.png"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#clip)"
            />
        </svg>
    );
};

export default BigLogo;