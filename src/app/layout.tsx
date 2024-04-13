import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/SideBar";

import React from "react";

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
        <Header/>

        <div className="flex h-fit min-h-full">
          <div className="w-[280px] mt-[60px]">
            <Sidebar/>
          </div>
          <div className="mt-[60px] w-full bg-[#eff0f4]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
