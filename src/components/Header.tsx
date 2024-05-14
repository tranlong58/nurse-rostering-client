'use client'

import Link from "next/link";
import {UserOutlined} from "@ant-design/icons";
import {useState} from "react";
import { useRouter } from "next/navigation";

type ChildProps = {
    user: string
}

export default function Header({user}: ChildProps) {
    const router = useRouter()
    const [isShowLogout, setIsShowLogout] = useState(false)

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    }

    return (
        <div className='bg-[#2f3f4e] pl-4 pr-6 flex items-center fixed w-full z-10 h-[50px]'>
            <div className='flex justify-between items-center w-full'>
                <Link href='/' className="flex justify-between items-center text-white text-2xl">
                    Nurse rostering app
                </Link>

                <div className='flex justify-center items-center'>
                    <div className='space-x-4 flex'>
                        <div className='!text-white text-lg'>
                            {user ? user.split('@')[0] : 'Admin'}
                        </div>

                        <div className='relative'>
                            <div
                                onClick={() => setIsShowLogout((prev) => !prev)}
                                className='w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer'
                            >
                                <UserOutlined/>
                            </div>

                            {isShowLogout && (
                                <div
                                    onClick={handleLogout}
                                    className='absolute bg-[#2f3f4e] top-7 text-white right-0 w-28 text-base font-medium h-11 p-2 text-center
                             z-10 cursor-pointer border-[0.5px] border-solid border-slate-50 border-opacity-30 hover:bg-[#435b71]'
                                >
                                    Logout
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}