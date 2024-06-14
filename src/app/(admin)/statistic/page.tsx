'use client'

import {Table} from "antd";
import {useEffect, useState} from "react";
import fetchData from "@/utils";
import TableColumns from '@/constants/tableColumns'
import type { TableColumnsType } from 'antd';
import { Statistic } from "@/types/statistic";

export default function StatisticPage() {
    const [dataStatistic, setDataStatistic] = useState<Statistic[]>([]);
    const [isLoadingStatistic, setIsLoadingStatistic] = useState(true);

    useEffect(() => {
        const getDataStatistic = async () => {
            const fetchedDataStatistic = await fetchData('/schedule/statistic');
            setDataStatistic(fetchedDataStatistic?.data.data);
        }

        getDataStatistic().finally(() => setIsLoadingStatistic(false));
    }, []);

    const dataSource = dataStatistic ? dataStatistic.map((item, index) => ({
        key: item.staffId,
        staff: (
            <div className="min-w-[120px]">
                <div>{item.staffName}</div>
                <div>{item.staffId}</div>
            </div>
        ),
        completed: (
            <div className="min-w-[200px] flex justify-around px-20">
                <div className="min-w-[100px]">
                    <div className="flex justify-between">
                        <div>Morning:</div>
                        <div>{item.completed[0]}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>Afternoon:</div>
                        <div>{item.completed[1]}</div>
                    </div>
                </div>
                <div className="min-w-[85px]">
                    <div className="flex justify-between">
                        <div>Evening:</div>
                        <div>{item.completed[2]}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>Night:</div>
                        <div>{item.completed[3]}</div>
                    </div>
                </div>
            </div>
        ),
        total: (
            <div className="min-w-[200px] flex justify-around px-20">
                <div className="min-w-[100px]">
                    <div className="flex justify-between">
                        <div>Morning:</div>
                        <div>{item.total[0]}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>Afternoon:</div>
                        <div>{item.total[1]}</div>
                    </div>
                </div>
                <div className="min-w-[85px]">
                    <div className="flex justify-between">
                        <div>Evening:</div>
                        <div>{item.total[2]}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>Night:</div>
                        <div>{item.total[3]}</div>
                    </div>
                </div>
            </div>
        )
        
    })) : []

    const columns: TableColumnsType = TableColumns.STATISTIC_COLUMNS.map(({name, label, width}) => ({
        title: label,
        dataIndex: name,
        align: 'center' as const,
        width,
        className: 'text-lg',
    }))

    return (
        <>
            <div className='p-2 bg-white text-xl'>
                Statistic
            </div>

            <div className='px-4 pt-8 h-fit'>
                <Table
                    bordered
                    scroll={{ x: 700}}
                    loading={{ spinning: isLoadingStatistic }}
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
