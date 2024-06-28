'use client'

import fetchData from "@/utils";
import { Table } from "antd";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from "react";
import type { TableColumnsType } from 'antd';
import TableColumns from "@/constants/tableColumns";
import { ScheduleToday } from "@/types/schedule";
import Consts from "@/constants";

export default function HomePage() {
    dayjs.extend(utc)

    const [data, setData] = useState<ScheduleToday>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData(`/schedule/today`);
            setData(fetchedData?.data.data);
        };

        getData().finally(() => setIsLoading(false));
    }, []);

    const columns: TableColumnsType = TableColumns.SCHEDULE_TODAY_COLUMNS.map(({name, label, width}) => ({
        title: label,
        dataIndex: name,
        align: 'center' as const,
        width,
        className: 'text-lg',
    }))

    const kindName = ['Morning', 'Afternoon', 'Evening', 'Night'];

    const dataSource = data ? data.detail.map((item, index) => {
        return {
            key: data.id[index],
            kind: kindName[index],
            staff: (
                <div className="flex ml-5 text-left">
                    {item.length ? item.map(staff => {
                        return `${staff.name} (${staff.staffId})`
                    }).join(', ') : 'Empty'}
                </div>
            ),
            total: (
                <div className="font-medium">
                    {item.length}/{data.listMaxStaff[index]}
                </div>
            )
        }
    }) : [];

    return (
        <>
            <div className='p-2 bg-white text-xl'>
                Home
            </div>

            <div className='p-4 flex justify-center text-2xl font-bold'>
                Today Schedule ({dayjs().format('DD/MM/YYYY')})
            </div>

            <div className='px-4 h-fit'>
                <Table
                    bordered
                    scroll={{x: 700}}
                    loading={{ spinning: isLoading }}
                    columns={columns}
                    rowClassName='h-[100px]'
                    dataSource={dataSource}
                    pagination={false}
                />
            </div>
        </>
    )
}