'use client'

import fetchData from "@/utils";
import { Spin, Table } from "antd";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from "react";
import type { TableColumnsType } from 'antd';
import TableColumns from "@/constants/tableColumns";
import { Schedule } from "@/types/schedule";

export default function HomePage() {
    dayjs.extend(utc)

    const [dataSchedule, setDataSchedule] = useState<Schedule[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData('/schedule/');
            setDataSchedule(fetchedData?.data.data);
        };

        getData().finally(() => setIsLoading(false));
    }, []);

    const columns: TableColumnsType = TableColumns.SCHEDULE_COLUMNS.map(({name, label, width}) => ({
        title: label,
        dataIndex: name,
        align: 'center' as const,
        width,
        className: 'text-lg',
    }))

    const dataSource = dataSchedule ? dataSchedule.map((item) => {
        return {
            key: item.date,
            date: (
                <>
                    <div>
                        {dayjs(item.date).format('DD/MM/YYYY')}
                    </div>
                    <div>
                        ({dayjs(item.date).format('dddd')})
                    </div>
                </>
            ),
            detail: (
                <div className="ml-[5%]">
                    <div className="flex">
                        <div className="font-medium w-24 flex">Morning:</div>
                        <div className="ml-2 max-w-[700px] w-[700px] text-left">
                            {item.detail[0].length ? item.detail[0].map(staff => {
                                return `${staff.name} (${staff.staffId})`
                            }).join(', ') : 'None'}
                        </div>
                        <div className="w-[140px] font-medium">{item.detail[0].length}/MAX</div>
                    </div>
                    <div className="flex">
                        <div className="font-medium w-24 flex">Afternoon:</div>
                        <div className="ml-2 max-w-[700px] w-[700px] text-left">
                            {item.detail[1].length ? item.detail[1].map(staff => {
                                return `${staff.name} (${staff.staffId})`
                            }).join(', ') : 'None'}
                        </div>
                        <div className="w-[140px] font-medium">{item.detail[1].length}/MAX</div>
                    </div>
                    <div className="flex">
                        <div className="font-medium w-24 flex">Evening:</div>
                        <div className="ml-2 max-w-[700px] w-[700px] text-left">
                            {item.detail[2].length ? item.detail[2].map(staff => {
                                return `${staff.name} (${staff.staffId})`
                            }).join(', ') : 'None'}
                        </div>
                        <div className="w-[140px] font-medium">{item.detail[2].length}/MAX</div>
                    </div>
                    <div className="flex">
                        <div className="font-medium w-24 flex">Night:</div>
                        <div className="ml-2 max-w-[700px] w-[700px] text-left">
                            {item.detail[3].length ? item.detail[3].map(staff => {
                                return `${staff.name} (${staff.staffId})`
                            }).join(', ') : 'None'}
                        </div>
                        <div className="w-[140px] font-medium">{item.detail[3].length}/MAX</div>
                    </div>
                </div>
            ),
        }
    }) : [];

    return (
        <Spin spinning={isLoading}>
            <div className='p-2 bg-white text-xl'>
                Home
            </div>

            <div className='p-4 flex justify-center text-xl font-bold'>
                Current schedule
            </div>

            <div className='px-4 h-fit'>
                <Table
                    bordered
                    scroll={{y: 450}}
                    loading={{ spinning: isLoading }}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </div>
        </ Spin>
    )
}