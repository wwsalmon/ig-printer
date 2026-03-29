import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "IG Printer",
    description: "Transform any Instagram post into a printable PDF",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
        >
            <body>{children}</body>
        </html>
    );
}
