'use client'
import {Table, Button, Modal, Form, Input, InputNumber, notification} from "antd";
import {useEffect, useState} from "react";
import fetchData from "@/utils";
import TableColumns from '@/constants/tableColumns'
import type { TableColumnsType } from 'antd';
import {Staff} from "@/types/staff";
import mutate from "@/utils/mutation";

export default function StaffPage() {
    const [data, setData] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData('/staff/');
            setData(fetchedData?.data.data);
        };

        getData().finally(() => setIsLoading(false));
    }, []);

    const dataSource = data ? data.map((item) => ({
        key: item.id,
        id: item.id,
        name: item.name,
        blank: (
            <div className='flex items-center justify-center gap-x-10'>
                <Button type="primary" size='large' className='w-20'>Edit</Button>
                <Button type="primary" size='large' className='w-20 bg-red-500 hover:!bg-red-400'>Delete</Button>
            </div>
        )
    })) : []

    const columns: TableColumnsType = TableColumns.STAFF_COLUMNS.map(({name, label, width}) => ({
        title: label,
        dataIndex: name,
        align: 'center' as const,
        width,
        className: 'text-lg',
    }))

    // Add modal
    const showAddModal = () => {
        setIsModalAddOpen(true);
        form.resetFields();
    };

    const handleAddCancel = () => {
        setIsModalAddOpen(false);
    };

    const handleAddOk = async () => {
        const values = await form.validateFields();
        const dataSubmit = {
            id: values.id,
            name: values.name.trim(),
        }
        const response = await mutate('/staff/', 'post', dataSubmit);

        if (response.status === 201) {
            notification.success({message: 'Add staff successful'});
            setIsModalAddOpen(false);

            const newData = await fetchData('/staff/');
            setData(newData?.data.data);
        }

        if(response.status === 400) {
            notification.error({message: response.data.message});
        }
    };

    return (
        <>
            <div className='p-4 bg-white text-2xl'>
                Staff management
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
                        pageSize: 8,
                        position: ['bottomCenter']
                    }}
                />
            </div>

            <Modal title="Add Staff" open={isModalAddOpen} onOk={handleAddOk} onCancel={handleAddCancel} >
                <Form form={form} layout="vertical">
                    <Form.Item label="ID" name="id" rules={[{ required: true, message: 'Please input the ID' }]}>
                        <InputNumber size='large' min={1000} className='w-full'/>
                    </Form.Item>

                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name' }]}>
                        <Input size='large'/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
