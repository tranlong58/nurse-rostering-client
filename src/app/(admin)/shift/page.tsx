'use client'

import {Table, Button, Modal, Form, Input, InputNumber, notification, Select} from "antd";
import {useEffect, useState} from "react";
import fetchData from "@/utils";
import TableColumns from '@/constants/tableColumns'
import type { TableColumnsType } from 'antd';
import { Shift } from "@/types/shift";
import mutate from "@/utils/mutation";
import Consts from "@/constants";

export default function ShiftPage() {
    const [data, setData] = useState<Shift[]>([]);
    const [isLoading, setIsLoading] = useState(true);    

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [formAdd] = Form.useForm();
    const [formEdit] = Form.useForm();

    // Add modal
    const showAddModal = () => {
        setIsModalAddOpen(true);
        formAdd.resetFields();
    };

    const handleAddCancel = () => {
        setIsModalAddOpen(false);
    };

    const handleAddOk = async () => {
        const values = await formAdd.validateFields();
        const dataSubmit = {
            day: values.day,
            numberOfStaff: [values.numberOfMorningStaff, values.numberOfAfternoonStaff, values.numberOfEveningStaff, values.numberOfNightStaff],
        }
        const response = await mutate('/shift', 'post', dataSubmit);

        if (response.status === 201) {
            notification.success({message: 'Add shift successful'});
            setIsModalAddOpen(false);

            const newData = await fetchData('/shift');
            setData(newData?.data.data);
        }

        if(response.status === 400) {
            notification.error({message: response.data.message});
        }
    };

    // Edit modal
    const showEditModal = (index: number) => {
        setIsModalEditOpen(true);
        formEdit.setFieldsValue({
            day: Consts.DAY[dataSource[index].day],
            kind: Consts.KIND[dataSource[index].kind],
            numberOfStaff: dataSource[index].numberOfStaff,
            id: dataSource[index].id,
        })
    };

    const handleEditCancel = () => {
        setIsModalEditOpen(false);
    };

    const handleEditOk = async () => {
        const values = await formEdit.validateFields();
        const dataSubmit = {
            day: values.day,
            kind: values.kind,
            numberOfStaff: values.numberOfStaff,
        }
        const response = await mutate(`/shift/${values.id}`, 'patch', dataSubmit);

        if (response.status === 200) {
            notification.success({message: 'Edit shift successful'});
            setIsModalEditOpen(false);

            const newData = await fetchData('/shift');
            setData(newData?.data.data);
        }

        if(response.status === 400) {
            notification.error({message: response.data.message});
        }
    };

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData('/shift');
            setData(fetchedData?.data.data);
        };

        getData().finally(() => setIsLoading(false));
    }, []);

    const dataSource = data ? data.map((item, index) => ({
        key: item.id,
        id: item.id,
        day: item.day,
        kind: item.kind,
        numberOfStaff: item.numberOfStaff,
        blank: (
            <div className='flex items-center justify-center gap-x-10'>
                <Button type="primary" size='large' className='w-20' onClick={() => showEditModal(index)}>Edit</Button>
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
            <div className='p-2 bg-white text-xl'>
                Shift management
            </div>

            <div className='p-4 flex justify-end'>
                <Button type="primary" size='large' className='w-32 bg-green-500 hover:!bg-green-400' onClick={showAddModal}>Add</Button>
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
                        pageSize: 5,
                        position: ['bottomCenter']
                    }}
                />
            </div>

            <Modal title="Add Shift" open={isModalAddOpen} onOk={handleAddOk} onCancel={handleAddCancel} >
                <Form form={formAdd} layout="vertical">
                    <Form.Item label="Day" name="day" rules={[{ required: true, message: 'Please input the day' }]}>
                        <Select options={Consts.DAY_OPTIONS}/>
                    </Form.Item>

                    <div>
                        Number of staff
                    </div>
                    <div className="flex gap-5">
                        <Form.Item label="Morning" name="numberOfMorningStaff" rules={[{ required: true, message: 'Please input the number of staff' }]}>
                            <InputNumber size='large' min={0} className='w-full'/>
                        </Form.Item>
                        <Form.Item label="Afternoon" name="numberOfAfternoonStaff" rules={[{ required: true, message: 'Please input the number of staff' }]}>
                            <InputNumber size='large' min={0} className='w-full'/>
                        </Form.Item>

                        <Form.Item label="Evening" name="numberOfEveningStaff" rules={[{ required: true, message: 'Please input the number of staff' }]}>
                            <InputNumber size='large' min={0} className='w-full'/>
                        </Form.Item>

                        <Form.Item label="Night" name="numberOfNightStaff" rules={[{ required: true, message: 'Please input the number of staff' }]}>
                            <InputNumber size='large' min={0} className='w-full'/>
                        </Form.Item>
                    </div>

                </Form>
            </Modal>

            <Modal title="Edit Shift" open={isModalEditOpen} onOk={handleEditOk} onCancel={handleEditCancel} >
                <Form form={formEdit} layout="vertical">
                    <Form.Item label="Day" name="day" rules={[{ required: true, message: 'Please input the day' }]}>
                        <Select disabled options={Consts.DAY_OPTIONS} suffixIcon={null}/>
                    </Form.Item>

                    <Form.Item label="Kind" name="kind" rules={[{ required: true, message: 'Please input the kind' }]}>
                        <Select disabled options={Consts.KIND_OPTIONS} suffixIcon={null}/>
                    </Form.Item>

                    <Form.Item label="Number of staff" name="numberOfStaff" rules={[{ required: true, message: 'Please input the number of staff' }]}>
                        <InputNumber size='large' min={0} className='w-full'/>
                    </Form.Item>

                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
