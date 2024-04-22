'use client'

import Header from "@/components/Header";
import Sidebar from "@/components/SideBar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const [user, setUser] = useState('');

    useEffect(() => {
        if(localStorage.getItem('token') === null) {
            router.push('/login')
        }

        setUser(localStorage.getItem('user') ?? '');
    }, [router])

    return (
        <>
            <Header user={user}/>
            <div className="flex h-fit min-h-full">
                <div className="w-[200px] mt-[60px]">
                    <Sidebar/>
                </div>
                <div className="mt-[60px] w-[calc(100%-200px)] bg-[#eff0f4]">
                    {children}
                </div>
            </div>
        </>
    );
}
