'use client'

import { Shift } from "@/types/shift";
import { Staff } from "@/types/staff";
import { Schedule, ScheduleType } from "@/types/schedule";
import fetchData from "@/utils";
import { Button, Form, Spin, Table, Select, Modal, notification } from "antd";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from "react";
import type { TableColumnsType } from 'antd';
import Consts from "@/constants";
import mutate from "@/utils/mutation";
import { useRouter, useParams } from "next/navigation";

export default function ScheduleEditPage() {
    dayjs.extend(utc)

    const router = useRouter();
    const id = useParams().id;

    const [dataStaff, setDataStaff] = useState<Staff[]>()
    const [dataShift, setDataShift] = useState<Shift[]>()
    const [dataSchedule, setDataSchedule] = useState<Schedule>()

    const [isLoading, setIsLoading] = useState(true)

    const [rangeDate, setRangeDate] = useState<dayjs.Dayjs[]>([])

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [totalByStaff, setTotalByStaff] = useState<number[][]>([]);
    const [totalByDate, setTotalByDate] = useState<number[][]>([]);

    const [formSchedule] = Form.useForm();

    useEffect(() => {
        const getData = async () => {
            const fetchedDataShift = await fetchData('/shift');
            setDataShift(fetchedDataShift?.data.data);
            
            const fetchedDataSchedule = await fetchData(`/schedule/${id}`);
            setDataSchedule(fetchedDataSchedule?.data?.data);
            
            const schedules = fetchedDataSchedule?.data?.data?.schedules;
            const startDate = dayjs(fetchedDataSchedule?.data?.data?.startDate);
            const endDate = dayjs(fetchedDataSchedule?.data?.data?.endDate);
            const length = endDate.diff(startDate, 'day') ? endDate.diff(startDate, 'day') + 1 : 0;

            const newRangeDate: dayjs.Dayjs[] = [];
            for (let i = 0; i < length; i++) {
                const nextDate = startDate.add(i, 'day');
                newRangeDate.push(nextDate);
            }
    
            setRangeDate(newRangeDate);

            const initTotalByDate: number[][] = newRangeDate?.map((item) => {
                const res: number[] = []
                schedules?.forEach((schedule: ScheduleType) => {
                    if(item.isSame(dayjs(schedule.date))) {
                        res.push(schedule.detail[0].length)
                        res.push(schedule.detail[1].length)
                        res.push(schedule.detail[2].length)
                        res.push(schedule.detail[3].length)
                    }
                })

                return res.length ? res : [0, 0, 0, 0]
            }) || [];

            setTotalByDate(initTotalByDate);

            const fetchedDataStaff = await fetchData('/staff');
            setDataStaff(fetchedDataStaff?.data.data);
            const staffs = fetchedDataStaff?.data.data;

            const initTotalByStaff: number[][] = staffs?.map(() => [0, 0, 0, 0]) || [];
            const dataFormSchedule: any = {};
            
            schedules?.forEach((schedule: ScheduleType) => {
                const dateIndex = dayjs(schedule.date).diff(startDate, 'day');
                schedule.detail.forEach((item, index) => {
                    item.forEach((staff) => {
                        const staffIndex = staffs?.findIndex((dataStaff: Staff) => dataStaff.id === staff.staffId);
                        if (staffIndex !== -1) {
                            initTotalByStaff[staffIndex][index]++;
                            dataFormSchedule[`${staff.staffId}-${dateIndex}`] = index;
                        }
                    })
                })
            })

            setTotalByStaff(initTotalByStaff);

            formSchedule.setFieldsValue(dataFormSchedule);
        };

        getData().finally(() => setIsLoading(false));
    }, [formSchedule, id]);

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
            const isExpired = rangeDate[index].isBefore(dayjs(), 'day');
            result[index] = (
                <Form.Item name={`${staff.id}-${index}`} initialValue={-1} className="m-0">
                    <Select 
                        options={listShiftOption[item.day() === 0 ? 6 : item.day()-1]}
                        className="min-w-[105px] w-full"
                        disabled = {isExpired}
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
        const length = rangeDate.length;
        const startDate = dayjs(dataSchedule?.startDate);

        const dataRaw = formSchedule.getFieldsValue();
        const dataSchedules: {staffId: number, shiftList: number[]}[] = [];

        dataStaff?.forEach((staff) => {
            const schedule: {staffId: number, shiftList: number[]} = {
                staffId: staff.id,
                shiftList: [],
            }

            for(let i=0; i<length; i++) {
                schedule.shiftList.push(dataRaw[`${staff.id}-${i}`])
            }

            dataSchedules.push(schedule)
        })

        const dataSubmit = {
            length,
            startDate: dayjs(startDate).utc().format(),
            schedule: dataSchedules,
        }
        
        const response = await mutate(`/schedule/${id}`, 'post', dataSubmit);

        if (response.status === 201) {
            notification.success({message: 'Update schedule successful'});
            setIsModalOpen(false);
        }        
    }

    return (
        <Spin spinning={isLoading}>
            <div className='p-2 bg-white text-xl'>
                Schedule update
            </div>

            <div className='px-4 pt-10 h-fit'>
                <Form form={formSchedule}>
                    <Table
                        bordered
                        scroll={{ x: 'max-content', y: 400}}
                        loading={false}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </Form>
                <div className='p-4 flex justify-around'>
                    <Button type="primary" size='large' className='w-32 bg-black hover:!bg-slate-600' onClick={() => router.push(`/history/${id}`)}>
                        Back
                    </Button>
                    <Button type="primary" size='large' className='w-32' onClick={showModal}>Save</Button>
                </div>
            </div>

            <Modal title="Update schedule" className="mt-28" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
                <div>
                    Confirm update the schedule?
                </div>
            </Modal>
        </ Spin>
    )
}