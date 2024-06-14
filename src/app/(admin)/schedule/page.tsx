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
    const [maxDate, setMaxDate] = useState<dayjs.Dayjs>()

    const [isLoadingStaff, setIsLoadingStaff] = useState(true)
    const [isLoadingShift, setIsLoadingShift] = useState(true)
    const [isLoadingMaxDate, setIsLoadingMaxDate] = useState(true)

    const [rangeDate, setRangeDate] = useState<dayjs.Dayjs[]>([])

    const [isShowTable, setIsShowTable] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [totalByStaff, setTotalByStaff] = useState<number[][]>([]);
    const [totalByDate, setTotalByDate] = useState<number[][]>([]);

    const [formInit] = Form.useForm();
    const [formSchedule] = Form.useForm();

    useEffect(() => {
        const getDataStaff = async () => {
            const fetchedData = await fetchData('/staff');
            setDataStaff(fetchedData?.data.data);

            const initTotalByStaff: number[][] = [];
            fetchedData?.data?.data?.forEach(() => {
                initTotalByStaff.push([0, 0, 0, 0])
            })
            setTotalByStaff(initTotalByStaff)
        };

        const getDataShift = async () => {
            const fetchedData = await fetchData('/shift');
            setDataShift(fetchedData?.data.data);
        };

        const getMaxDate = async () => {
            const fetchedData = await fetchData('/history/max');
            setMaxDate(dayjs(fetchedData?.data.data.maxDate));
        };

        getDataStaff().finally(() => setIsLoadingStaff(false));
        getDataShift().finally(() => setIsLoadingShift(false));
        getMaxDate().finally(() => setIsLoadingMaxDate(false));
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

        const initTotalByStaff: number[][] = dataStaff?.map(() => [0, 0, 0, 0]) || [];
        setTotalByStaff(initTotalByStaff);

        const initTotalByDate: number[][] = newRangeDate?.map(() => [0, 0, 0, 0]) || [];
        setTotalByDate(initTotalByDate);
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

    const shiftOption: {value: number, label: string, disabled?: boolean}[] = [
        {value: -1, label: 'None'},
        {value: 0, label: 'Morning', disabled: true},
        {value: 1, label: 'Afternoon', disabled: true},
        {value: 2, label: 'Evening', disabled: true},
        {value: 3, label: 'Night', disabled: true},
    ]

    const listShiftOption = Array(7).fill('').map(() => shiftOption.map(option => ({ ...option })));

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

    const handleChangeSelect = (staffIndex: number, dateIndex: number, newValue: number, oldValue: number) => {
        const newTotalByStaff = totalByStaff.map((item, index) => {
            if (index === staffIndex) {
                const newItem = [...item];
                if (oldValue !== -1) {
                    newItem[oldValue] -= 1;
                }
                if (newValue !== -1) {
                    newItem[newValue] += 1;
                }
                return newItem;
            }
            return item;
        });
        setTotalByStaff(newTotalByStaff);

        const newTotalByDate = totalByDate.map((item, index) => {
            if (index === dateIndex) {
                const newItem = [...item];
                if (oldValue !== -1) {
                    newItem[oldValue] -= 1;
                }
                if (newValue !== -1) {
                    newItem[newValue] += 1;
                }
                return newItem;
            }
            return item;
        });
        setTotalByDate(newTotalByDate);
    }

    const dataSource = dataStaff ? dataStaff.map((staff, staffIndex) => {
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
                            <div>{totalByStaff[staffIndex][0]}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Afternoon:</div>
                            <div>{totalByStaff[staffIndex][1]}</div>
                        </div>
                    </div>
                    <div className="min-w-[75px]">
                        <div className="flex justify-between">
                            <div>Evening:</div>
                            <div>{totalByStaff[staffIndex][2]}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Night:</div>
                            <div>{totalByStaff[staffIndex][3]}</div>
                        </div>
                    </div>
                </div>
            )
        }

        rangeDate.map((item, index) => {
            const oldValue = formSchedule.getFieldValue(`${staff.id}-${index}`) ?? -1;
            result[index] = (
                <Form.Item name={`${staff.id}-${index}`} initialValue={-1} className="m-0">
                    <Select 
                        options={listShiftOption[item.day() === 0 ? 6 : item.day()-1]}
                        className="min-w-[105px] w-full"
                        onChange={(value) => handleChangeSelect(staffIndex, index, value, oldValue)}
                    />
                </Form.Item>
            )
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
            totalRow[index] = (
                <div className="min-w-[105px] text-base">
                    <div className="flex justify-between">
                        <div>Morning:</div>
                        <div>
                            {totalByDate[index][0]}/{listNumberStaffByDay[item.day() === 0 ? 6 : item.day()-1][0]}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>Afternoon:</div>
                        <div>
                            {totalByDate[index][1]}/{listNumberStaffByDay[item.day() === 0 ? 6 : item.day()-1][1]}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>Evening:</div>
                        <div>
                            {totalByDate[index][2]}/{listNumberStaffByDay[item.day() === 0 ? 6 : item.day()-1][2]}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>Night:</div>
                        <div>
                            {totalByDate[index][3]}/{listNumberStaffByDay[item.day() === 0 ? 6 : item.day()-1][3]}
                        </div>
                    </div>
                </div>
            )
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
        
        const response = await mutate('/schedule', 'post', dataSubmit);

        if (response.status === 201) {
            notification.success({message: 'Create schedule successful'});
            setIsModalOpen(false);
            setIsShowTable(false);
            setMaxDate(dayjs(startDate).add(length-1, 'day'));
            formInit.resetFields();
        }        
    }

    return (
        <Spin spinning={isLoadingStaff || isLoadingShift || isLoadingMaxDate}>
            <div className='p-2 bg-white text-xl'>
                Schedule management
            </div>

            <div className='p-4'>
                <Form form={formInit} layout='inline' className="flex justify-around schedule-init-form" size='large'>
                    <Form.Item label={`Schedule length:`} name="length" rules={[{ required: true, message: 'Please input the length' }]}>
                        <InputNumber min={7} max={30} className='w-32'/>
                    </Form.Item>
                    <Form.Item label={`Date start:`} name="startDate" rules={[{ required: true, message: 'Please input the date start' }]}>
                        <DatePicker 
                            className='w-40' 
                            disabledDate={(current) => {
                                if(!maxDate) return true
                                return current && (current < dayjs().startOf('day') || current <= maxDate.startOf('day'))
                            }}
                            placeholder=""
                            format="DD/MM/YYYY"
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
            </Modal>
        </ Spin>
    )
}