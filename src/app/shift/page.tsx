'use client'
import {Table, Button} from "antd";
import {useEffect, useState} from "react";
import fetchData from "@/utils";
import TableColumns from '@/constants/tableColumns'
import type { TableColumnsType } from 'antd';

export default function ShiftPage() {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData('/shift/');
            setData(fetchedData?.data.data);
        };

        getData().finally(() => setIsLoading(false));
    }, []);

    const dataSource = data ? data.map((item) => ({
        key: item.id,
        id: item.id,
        day: item.day,
        kind: item.kind,
        numberOfStaff: item.numberOfStaff,
        blank: (
            <div className='flex items-center justify-center gap-x-10'>
                <Button type="primary" size='large' className='w-20'>Edit</Button>
                <Button type="primary" size='large' className='w-20 bg-red-500 hover:!bg-red-400'>Delete</Button>
            </div>
        )
    })) : []

    const columns: TableColumnsType = TableColumns.SHIFT_COLUMNS.map(({name, label, width}) => ({
        title: label,
        dataIndex: name,
        align: 'center' as const,
        width,
        className: 'text-lg',
    }))

    return (
        <>
            <div className='p-4 bg-white text-2xl'>
                Shift management
            </div>

            <div className='p-4 flex justify-end'>
                <Button type="primary" size='large' className='w-32 bg-green-500 hover:!bg-green-400'>Add</Button>
            </div>

            <div className='px-4'>
                <Table
                    bordered
                    scroll={{ x: 700}}
                    loading={{ spinning: isLoading }}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        total: dataSource?.length,
                        pageSize: 8,
                        position: ['bottomCenter']
                    }}
                />
            </div>
        </>
    )
}
