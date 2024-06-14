'use client'

import {Table, Button} from "antd";
import {useEffect, useState} from "react";
import fetchData from "@/utils";
import TableColumns from '@/constants/tableColumns'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import type { TableColumnsType } from 'antd';
import {History} from "@/types/history";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
    const router = useRouter();
    dayjs.extend(utc)

    const [data, setData] = useState<History[]>([]);
    const [isLoading, setIsLoading] = useState(true);   

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData('/history');
            setData(fetchedData?.data.data);
        };

        getData().finally(() => setIsLoading(false));
    }, []);

    const dataSource = data ? data.map((item) => ({
        key: item.id,
        id: item.id,
        start: dayjs(item.start).format('DD-MM-YYYY'),
        end: dayjs(item.end).format('DD-MM-YYYY'),
        blank: (
            <div className='flex items-center justify-center gap-x-10'>
                <Button type="primary" size='large' className='w-20' onClick={() => router.push(`/history/${item.id}`)}>Detail</Button>
            </div>
        )
    })) : []

    const columns: TableColumnsType = TableColumns.HISTORY_COLUMNS.map(({name, label, width}) => ({
        title: label,
        dataIndex: name,
        align: 'center' as const,
        width,
        className: 'text-lg',
    }))

    return (
        <>
            <div className='p-2 bg-white text-xl'>
                History management
            </div>

            <div className='px-4 pt-10 h-fit'>
                <Table
                    bordered
                    scroll={{ x: 700}}
                    loading={{ spinning: isLoading }}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        total: dataSource?.length,
                        pageSize: 5,
                        position: ['bottomCenter']
                    }}
                />
            </div>
        </>
    )
}
