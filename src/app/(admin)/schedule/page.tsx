'use client'

import { Shift } from "@/types/shift";
import { Staff } from "@/types/staff";
import fetchData from "@/utils";
import { InputNumber, Button, DatePicker, Form, Spin, Table, Select } from "antd";
import dayjs from 'dayjs'
import { useEffect, useState } from "react";
import type { TableColumnsType } from 'antd';
import Consts from "@/constants";

export default function SchedulePage() {
    const [dataStaff, setDataStaff] = useState<Staff[]>()
    const [dataShift, setDataShift] = useState<Shift[]>()

    const [isLoadingStaff, setIsLoadingStaff] = useState(true)
    const [isLoadingShift, setIsLoadingShift] = useState(true)

    const [rangeDate, setRangeDate] = useState<dayjs.Dayjs[]>([])

    const [isShowTable, setIsShowTable] = useState(false)

    useEffect(() => {
        const getDataStaff = async () => {
            const fetchedData = await fetchData('/staff/');
            setDataStaff(fetchedData?.data.data);
        };

        const getDataShift = async () => {
            const fetchedData = await fetchData('/shift/');
            setDataShift(fetchedData?.data.data);
        };

        getDataStaff().finally(() => setIsLoadingStaff(false));
        getDataShift().finally(() => setIsLoadingShift(false));
    }, []);
    
    const [form] = Form.useForm();

    const listShiftOption: {value: number, label: string}[][] = [
        [{value: -1, label: 'None'}],
        [{value: -1, label: 'None'}],
        [{value: -1, label: 'None'}],
        [{value: -1, label: 'None'}],
        [{value: -1, label: 'None'}],
        [{value: -1, label: 'None'}],
        [{value: -1, label: 'None'}],
    ]

    dataShift?.forEach((item) => {
        listShiftOption[Consts.DAY[item.day]].push({
            value: Consts.KIND[item.kind],
            label: item.kind,
        })
    });

    const createSchedule = async () => {
        const values = await form.validateFields();
        const length = values.length;
        const startDate = values.startDate;
        
        const newRangeDate: dayjs.Dayjs[] = [];

        for (let i = 0; i < length; i++) {
            const nextDate = startDate.add(i, 'day');
            newRangeDate.push(nextDate);
        }

        setRangeDate(newRangeDate)
        setIsShowTable(true)
    }

    const columns: TableColumnsType = rangeDate.map((item, index) => ({
        title: item.format('DD/MM'),
        dataIndex: index,
        align: 'center' as const,
        className: 'text-lg',
    }))

    columns.unshift({
        title: `Staff`,
        dataIndex: 'staff',
        align: 'center' as const,
        className: 'text-lg',
    })

    columns.push({
        title: `Total`,
        dataIndex: 'total',
        align: 'center' as const,
        className: 'text-lg',
    })

    const dataSource = dataStaff ? dataStaff.map((item) => {
        const obj: any = {
            key: item.id,
            staff: (
                <div className="min-w-[150px]">
                    <div>{item.name}</div>
                    <div>{item.id}</div>
                </div>
            ),
            total: (
                <div className="min-w-[100px] text-base">
                    <div className="flex justify-between">
                        <div>Morning:</div>
                        <div>0</div>
                    </div>
                    <div className="flex justify-between">
                        <div>Afternoon:</div>
                        <div>0</div>
                    </div>
                    <div className="flex justify-between">
                        <div>Evening:</div>
                        <div>0</div>
                    </div>
                    <div className="flex justify-between">
                        <div>Night:</div>
                        <div>0</div>
                    </div>
                </div>
            )
        }

        rangeDate.map((item, index) => {
            if(item.day() === 0) {
                obj[index] = (
                    <Select 
                        defaultValue={-1}
                        options={listShiftOption[6]}
                        className="min-w-[100px] w-full"
                    />
                )
            }
            else {
                obj[index] = (
                    <Select 
                        defaultValue={-1}
                        options={listShiftOption[item.day()-1]}
                        className="min-w-[100px] w-full"
                    />
                )
            }  
        })

        return obj;
    }) : [];

    return (
        <Spin spinning={isLoadingStaff || isLoadingShift}>
            <div className='p-4 bg-white text-2xl'>
                Schedule management
            </div>

            <div className='p-4'>
                <Form form={form} layout='inline' className="flex justify-around" size='large'>
                    <Form.Item label={`Schedule length:`} name="length" rules={[{ required: true, message: 'Please input the length' }]}>
                        <InputNumber min={7} max={30} className='w-32'/>
                    </Form.Item>
                    <Form.Item label={`Start date:`} name="startDate" rules={[{ required: true, message: 'Please input the date start' }]}>
                        <DatePicker 
                            className='w-40' 
                            disabledDate={(current) => {
                                return current && current < dayjs().startOf('day')
                            }}
                        />
                    </Form.Item>
                    <Button type="primary" className='w-32 bg-green-500 hover:!bg-green-400' onClick={createSchedule}>Create</Button>
                </Form>
            </div>

            <div className='px-4 h-fit'>
                <Table
                    bordered
                    className={isShowTable ? '' : 'hidden'}
                    scroll={{ x: 'max-content', y: 420}}
                    loading={false}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </div>
        </ Spin>
    )
}