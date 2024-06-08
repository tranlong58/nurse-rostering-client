'use client'

import fetchData from "@/utils";
import { Table, Button } from "antd";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from "react";
import type { TableColumnsType } from 'antd';
import TableColumns from "@/constants/tableColumns";
import { Schedule } from "@/types/schedule";
import { Shift } from "@/types/shift";
import Consts from "@/constants";
import { useRouter, useParams } from "next/navigation";

export default function HistoryDetailPage() {
    dayjs.extend(utc)
    
    const router = useRouter();
    const id = useParams().id;

    const [dataSchedule, setDataSchedule] = useState<Schedule>()
    const [dataShift, setDataShift] = useState<Shift[]>([]);
    
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(true)
    const [isLoadingShift, setIsLoadingShift] = useState(true)

    useEffect(() => {
        const getDataSchedule = async () => {
            const fetchedData = await fetchData(`/schedule/${id}`);
            setDataSchedule(fetchedData?.data.data);
        };

        const getDataShift = async () => {
            const fetchedData = await fetchData('/shift/');
            setDataShift(fetchedData?.data.data);
        };

        getDataSchedule().finally(() => setIsLoadingSchedule(false));
        getDataShift().finally(() => setIsLoadingShift(false));
    }, [id]);

    const listMaxStaff: {[key: string]: number[]} = {
        'Monday': [0, 0, 0, 0],
        'Tuesday': [0, 0, 0, 0],
        'Wednesday': [0, 0, 0, 0],
        'Thursday': [0, 0, 0, 0],
        'Friday': [0, 0, 0, 0],
        'Saturday': [0, 0, 0, 0],
        'Sunday': [0, 0, 0, 0],
    }

    dataShift?.forEach(item => {
        listMaxStaff[item.day][Consts.KIND[item.kind]] = item.numberOfStaff
    })

    const columns: TableColumnsType = TableColumns.SCHEDULE_COLUMNS.map(({name, label, width}) => ({
        title: label,
        dataIndex: name,
        align: 'center' as const,
        width,
        className: 'text-lg',
    }))

    const dataSource = dataSchedule?.schedules ? dataSchedule.schedules.map((item) => {
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
                            }).join(', ') : 'Empty'}
                        </div>
                        <div className="w-[140px] font-medium">
                            {item.detail[0].length}/{listMaxStaff[dayjs(item.date).format('dddd')][0]}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="font-medium w-24 flex">Afternoon:</div>
                        <div className="ml-2 max-w-[700px] w-[700px] text-left">
                            {item.detail[1].length ? item.detail[1].map(staff => {
                                return `${staff.name} (${staff.staffId})`
                            }).join(', ') : 'Empty'}
                        </div>
                        <div className="w-[140px] font-medium">
                            {item.detail[1].length}/{listMaxStaff[dayjs(item.date).format('dddd')][1]}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="font-medium w-24 flex">Evening:</div>
                        <div className="ml-2 max-w-[700px] w-[700px] text-left">
                            {item.detail[2].length ? item.detail[2].map(staff => {
                                return `${staff.name} (${staff.staffId})`
                            }).join(', ') : 'Empty'}
                        </div>
                        <div className="w-[140px] font-medium">
                            {item.detail[2].length}/{listMaxStaff[dayjs(item.date).format('dddd')][2]}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="font-medium w-24 flex">Night:</div>
                        <div className="ml-2 max-w-[700px] w-[700px] text-left">
                            {item.detail[3].length ? item.detail[3].map(staff => {
                                return `${staff.name} (${staff.staffId})`
                            }).join(', ') : 'Empty'}
                        </div>
                        <div className="w-[140px] font-medium">
                            {item.detail[3].length}/{listMaxStaff[dayjs(item.date).format('dddd')][3]}
                        </div>
                    </div>
                </div>
            ),
        }
    }) : [];

    return (
        <>
            <div className='p-2 bg-white text-xl'>
                Detail
            </div>

            <div className='p-4 flex justify-center text-2xl font-bold'>
                Schedule from {dayjs(dataSchedule?.startDate).format('DD/MM/YYYY')} to {dayjs(dataSchedule?.endDate).format('DD/MM/YYYY')}
            </div>

            <div className='px-4 h-fit'>
                <Table
                    bordered
                    scroll={{y: 400}}
                    loading={{ spinning: isLoadingSchedule || isLoadingShift }}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </div>

            <div className='p-4 flex justify-around'>
                <Button type="primary" size='large' className='w-32 bg-black hover:!bg-slate-600' onClick={() => router.push('/history')}>
                    Back
                </Button>
                <Button type="primary" size='large' className='w-32' onClick={() => router.push(`/schedule/${id}`)}>
                    Edit
                </Button>
            </div>
        </>
    )
}