import localFont from "next/font/local";
import "../globals.css";

const pretendard = localFont({
    src: "../../../public/fonts/Pretendard.woff2",
    variable: "--pretendard",
    display: "swap",
    weight: "100 200 300 400 500 600 700 800 900",
    preload: true
});

export default function EnLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
        <body className={pretendard.variable}>
        {children}
        </body>
        </html>
    );
}