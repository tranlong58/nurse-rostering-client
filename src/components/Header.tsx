'use client'
import Link from "next/link";
import {UserOutlined} from "@ant-design/icons";
import {useState} from "react";

export default function Header() {
    const [isShowLogout, setIsShowLogout] = useState(false)

    const logout = () => {
        setIsShowLogout((prev) => !prev)
    }

    return (
        <div className='bg-[#2f3f4e] pl-4 pr-6 py-2 flex items-center gap-4 fixed w-full z-10 h-[60px]'>
            <div className='flex justify-between items-center w-full'>
                <Link href='/' className="flex justify-between items-center text-white text-4xl">
                    Nurse rostering app
                </Link>

                <div className='flex justify-center items-center'>
                    <div className='space-x-4 flex'>
                        <div className='!text-white text-xl'>
                            long.tt194102
                        </div>

                        <div className='relative'>
                            <div
                                onClick={() => setIsShowLogout((prev) => !prev)}
                                className='w-6 h-6 bg-white rounded-full flex items-center justify-center'
                            >
                                <UserOutlined className='cursor-pointer'/>
                            </div>

                            {isShowLogout && (
                                <div
                                    onClick={() => logout()}
                                    className='absolute bg-[#2f3f4e] top-8 text-white right-0 w-28 text-sm font-bold h-10 p-2 text-center
                             z-999 cursor-pointer border-[0.5px] border-solid border-slate-50 border-opacity-30'
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