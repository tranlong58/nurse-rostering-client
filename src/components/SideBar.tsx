'use client'

import { Menu } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
    const currentRoute = usePathname()

    const SIDEBAR_MENU = [
        {
            label: 'Home',
            path: '/',
        },
        {
            label: 'Staff',
            path: '/staff',
        },
        {
            label: 'Shift',
            path: '/shift',
        },
        {
            label: 'Schedule',
            path: '/schedule',
        },
        {
            label: 'History',
            path: '/history',
        },
    ]

    const items = SIDEBAR_MENU.map(({ label, path }) => ({
        label: (
            <div className='flex justify-between select-none'>
                <Link href={path}>{label}</Link>
            </div>
        ),
        key: path
    }))

    return (
        <div className='h-full w-[180px] bg-[#F5F6F8]'>
            <Menu
                theme='dark'
                mode='inline'
                items={items}
                className='sidebar !bg-[#F5F6F8]'
                selectedKeys={[`${currentRoute}`]}
            />
        </div>
    )
}
