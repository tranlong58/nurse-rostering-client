'use client'

import { Shift } from "@/types/shift";
import { Staff } from "@/types/staff";
import fetchData from "@/utils";
import { InputNumber, Button, DatePicker, Form, Spin, Table, Select, Modal, notification } from "antd";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from "react";
import type { TableColumnsType } from 'antd';
import Consts from "@/constants";
import mutate from "@/utils/mutation";

export default function SchedulePage() {
    dayjs.extend(utc)

    const [dataStaff, setDataStaff] = useState<Staff[]>()
    const [dataShift, setDataShift] = useState<Shift[]>()

    const [isLoadingStaff, setIsLoadingStaff] = useState(true)
    const [isLoadingShift, setIsLoadingShift] = useState(true)

    const [rangeDate, setRangeDate] = useState<dayjs.Dayjs[]>([])

    const [isShowTable, setIsShowTable] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formInit] = Form.useForm();
    const [formSchedule] = Form.useForm();

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

    const createSchedule = async () => {
        const values = await formInit.validateFields();
        const length = values.length;
        const startDate = values.startDate;
        
        const newRangeDate: dayjs.Dayjs[] = [];

        for (let i = 0; i < length; i++) {
            const nextDate = startDate.add(i, 'day');
            newRangeDate.push(nextDate);
        }

        setRangeDate(newRangeDate);
        setIsShowTable(true);
        formSchedule.resetFields();
    }

    const columns: TableColumnsType = rangeDate.map((item, index) => ({
        title: (
            <>
                <div>
                    {item.format('DD/MM')}
                </div>
                <div className="text-sm">
                    ({item.format('dddd')})
                </div>
            </>
        ),
        dataIndex: index,
        align: 'center' as const,
        className: 'text-lg',
    }))

    columns.unshift({
        title: `Staff`,
        dataIndex: 'staff',
        align: 'center' as const,
        className: 'text-lg',
        fixed: 'left',
    })

    columns.push({
        title: `Total`,
        dataIndex: 'total',
        align: 'center' as const,
        className: 'text-lg',
        // fixed: 'right',
    })

    const listShiftOption: {value: number, label: string, disabled?: boolean}[][] = [
        [{value: -1, label: 'None'}, {value: 0, label: 'Morning', disabled: true}, {value: 1, label: 'Afternoon', disabled: true}, {value: 2, label: 'Evening', disabled: true}, {value: 3, label: 'Night', disabled: true}],
        [{value: -1, label: 'None'}, {value: 0, label: 'Morning', disabled: true}, {value: 1, label: 'Afternoon', disabled: true}, {value: 2, label: 'Evening', disabled: true}, {value: 3, label: 'Night', disabled: true}],
        [{value: -1, label: 'None'}, {value: 0, label: 'Morning', disabled: true}, {value: 1, label: 'Afternoon', disabled: true}, {value: 2, label: 'Evening', disabled: true}, {value: 3, label: 'Night', disabled: true}],
        [{value: -1, label: 'None'}, {value: 0, label: 'Morning', disabled: true}, {value: 1, label: 'Afternoon', disabled: true}, {value: 2, label: 'Evening', disabled: true}, {value: 3, label: 'Night', disabled: true}],
        [{value: -1, label: 'None'}, {value: 0, label: 'Morning', disabled: true}, {value: 1, label: 'Afternoon', disabled: true}, {value: 2, label: 'Evening', disabled: true}, {value: 3, label: 'Night', disabled: true}],
        [{value: -1, label: 'None'}, {value: 0, label: 'Morning', disabled: true}, {value: 1, label: 'Afternoon', disabled: true}, {value: 2, label: 'Evening', disabled: true}, {value: 3, label: 'Night', disabled: true}],
        [{value: -1, label: 'None'}, {value: 0, label: 'Morning', disabled: true}, {value: 1, label: 'Afternoon', disabled: true}, {value: 2, label: 'Evening', disabled: true}, {value: 3, label: 'Night', disabled: true}],
    ]

    dataShift?.forEach((item) => {
        listShiftOption[Consts.DAY[item.day]][Consts.KIND[item.kind]+1].disabled = false;
    });

    const listNumberStaffByDay: number[][] = [[], [], [], [], [], [], []]

    for(let i=0; i<=6; i++) {
        for(let j=0; j<=3; j++){
            listNumberStaffByDay[i][j] = 0
        }
    }

    dataShift?.forEach((item) => {
        listNumberStaffByDay[Consts.DAY[item.day]][Consts.KIND[item.kind]] = item.numberOfStaff
    });

    const dataSource = dataStaff ? dataStaff.map((staff) => {
        const result: any = {
            key: staff.id,
            staff: (
                <div className="min-w-[120px] text-base">
                    <div>{staff.name}</div>
                    <div>{staff.id}</div>
                </div>
            ),
            total: (
                <div className="min-w-[200px] text-base flex justify-between">
                    <div className="min-w-[90px]">
                        <div className="flex justify-between">
                            <div>Morning:</div>
                            <div>0</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Afternoon:</div>
                            <div>0</div>
                        </div>
                    </div>
                    <div className="min-w-[75px]">
                        <div className="flex justify-between">
                            <div>Evening:</div>
                            <div>0</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Night:</div>
                            <div>0</div>
                        </div>
                    </div>
                </div>
            )
        }

        rangeDate.map((item, index) => {
            if(item.day() === 0) { //Sunday
                result[index] = (
                    <Form.Item name={`${staff.id}-${index}`} initialValue={-1} className="m-0">
                        <Select 
                            options={listShiftOption[6]}
                            className="min-w-[105px] w-full"
                        />
                    </Form.Item>
                )
            }
            else {
                result[index] = (
                    <Form.Item name={`${staff.id}-${index}`} initialValue={-1} className="m-0">
                        <Select 
                            options={listShiftOption[item.day()-1]}
                            className="min-w-[105px] w-full"
                        />
                    </Form.Item>
                )
            }  
        })

        return result;
    }) : [];

    if(dataSource.length > 0) {
        const totalRow: any = {
            key: -1,
            staff: (
                <div className="min-w-[120px]">
                    <div>Total</div>
                </div>
            ),
            total: (
                <></>
            ),
        }

        rangeDate.map((item, index) => {
            if(item.day() === 0) { //Sunday
                totalRow[index] = (
                    <div className="min-w-[105px] text-base">
                        <div className="flex justify-between">
                            <div>Morning:</div>
                            <div>0/{listNumberStaffByDay[6][0]}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Afternoon:</div>
                            <div>0/{listNumberStaffByDay[6][1]}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Evening:</div>
                            <div>0/{listNumberStaffByDay[6][2]}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Night:</div>
                            <div>0/{listNumberStaffByDay[6][3]}</div>
                        </div>
                    </div>
                )
            }
            else {
                totalRow[index] = (
                    <div className="min-w-[105px] text-base">
                        <div className="flex justify-between">
                            <div>Morning:</div>
                            <div>0/{listNumberStaffByDay[item.day()-1][0]}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Afternoon:</div>
                            <div>0/{listNumberStaffByDay[item.day()-1][1]}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Evening:</div>
                            <div>0/{listNumberStaffByDay[item.day()-1][2]}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Night:</div>
                            <div>0/{listNumberStaffByDay[item.day()-1][3]}</div>
                        </div>
                    </div>
                )
            }  
        })

        dataSource.push(totalRow);
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = async () => {
        const length = formInit.getFieldValue('length');
        const startDate = formInit.getFieldValue('startDate');

        const dataRaw = formSchedule.getFieldsValue();
        const dataSchedule: {staffId: number, shiftList: number[]}[] = [];

        dataStaff?.forEach((staff) => {
            const schedule: {staffId: number, shiftList: number[]} = {
                staffId: staff.id,
                shiftList: [],
            }

            for(let i=0; i<length; i++) {
                schedule.shiftList.push(dataRaw[`${staff.id}-${i}`])
            }

            dataSchedule.push(schedule)
        })

        const dataSubmit = {
            length,
            startDate: dayjs(startDate).utc().format(),
            schedule: dataSchedule,
        }
        
        console.log(dataSubmit)
        const response = await mutate('/schedule/', 'post', dataSubmit);

        if (response.status === 201) {
            notification.success({message: 'Create schedule successful'});
            setIsModalOpen(false);
            setIsShowTable(false);
            formInit.resetFields();
        }        
    }

    return (
        <Spin spinning={isLoadingStaff || isLoadingShift}>
            <div className='p-2 bg-white text-xl'>
                Schedule management
            </div>

            <div className='p-4'>
                <Form form={formInit} layout='inline' className="flex justify-around" size='large'>
                    <Form.Item label={`Schedule length:`} name="length" rules={[{ required: true, message: 'Please input the length' }]}>
                        <InputNumber min={7} max={30} className='w-32'/>
                    </Form.Item>
                    <Form.Item label={`Start date:`} name="startDate" rules={[{ required: true, message: 'Please input the date start' }]}>
                        <DatePicker 
                            className='w-40' 
                            disabledDate={(current) => {
                                return current && current < dayjs().startOf('day')
                            }}
                            placeholder=""
                        />
                    </Form.Item>
                    <Button type="primary" className='w-32 bg-green-500 hover:!bg-green-400' onClick={createSchedule}>Create</Button>
                </Form>
            </div>

            <div className='px-4 h-fit'>
                <Form form={formSchedule}>
                    <Table
                        bordered
                        className={isShowTable ? '' : 'hidden'}
                        scroll={{ x: 'max-content', y: 400}}
                        loading={false}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </Form>
                <div className='flex justify-end mt-2 mr-28'>
                    <Button type="primary" size='large' className={isShowTable ? 'w-32' : 'w-32 hidden'} onClick={showModal}>Save</Button>
                </div>
            </div>

            <Modal title="Save schedule" className="mt-28" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
                <div>
                    Confirm save the new schedule?
                </div>
                <div>
                    This action will replace the old schedule.
                </div>
            </Modal>
        </ Spin>
    )
}