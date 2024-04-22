import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Nurse Rostering App",
    description: "Nurse rostering app by Tran Long",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="h-screen">
                {children}
            </body>
        </html>
    );
}
