'use client'

import {Table, Button, Modal, Form, Input, InputNumber, notification} from "antd";
import {useEffect, useState} from "react";
import fetchData from "@/utils";
import mutate from "@/utils/mutation";
import TableColumns from '@/constants/tableColumns'
import type { TableColumnsType } from 'antd';
import {Staff} from "@/types/staff";

export default function StaffPage() {
    const [data, setData] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteID, setDeleteID] = useState(0);    

    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

    const [formAdd] = Form.useForm();
    const [formEdit] = Form.useForm();
    const [formDelete] = Form.useForm();

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

    // Edit modal
    const showEditModal = (index: number) => {
        setIsModalEditOpen(true);
        formEdit.setFieldsValue({
            id: dataSource[index].id,
            name: dataSource[index].name,
            oldId: dataSource[index].id,
        })
    };

    const handleEditCancel = () => {
        setIsModalEditOpen(false);
    };

    const handleEditOk = async () => {
        const values = await formEdit.validateFields();
        const dataSubmit = {
            id: values.id,
            name: values.name.trim(),
        }
        const response = await mutate(`/staff/${values.oldId}`, 'patch', dataSubmit);

        if (response.status === 200) {
            notification.success({message: 'Edit staff successful'});
            setIsModalEditOpen(false);

            const newData = await fetchData('/staff/');
            setData(newData?.data.data);
        }

        if(response.status === 400) {
            notification.error({message: response.data.message});
        }
    };

    // Delete modal
    const showDeleteModal = (index: number) => {
        setIsModalDeleteOpen(true);
        formDelete.setFieldsValue({
            id: dataSource[index].id,
        })
        setDeleteID(dataSource[index].id)
    };

    const handleDeleteCancel = () => {
        setIsModalDeleteOpen(false);
    };

    const handleDeleteOk = async () => {
        const values = await formDelete.validateFields();
        const response = await mutate(`/staff/${values.id}`, 'delete');

        if (response.status === 200) {
            notification.success({message: 'Delete staff successful'});
            setIsModalDeleteOpen(false);

            const newData = await fetchData('/staff/');
            setData(newData?.data.data);
        }

        if(response.status === 400) {
            notification.error({message: response.data.message});
        }
    };

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData('/staff/');
            setData(fetchedData?.data.data);
        };

        getData().finally(() => setIsLoading(false));
    }, []);

    const dataSource = data ? data.map((item, index) => ({
        key: item.id,
        id: item.id,
        name: item.name,
        blank: (
            <div className='flex items-center justify-center gap-x-10'>
                <Button type="primary" size='large' className='w-20' onClick={() => showEditModal(index)}>Edit</Button>
                <Button type="primary" size='large' className='w-20 bg-red-500 hover:!bg-red-400' onClick={() => showDeleteModal(index)}>Delete</Button>
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

    return (
        <>
            <div className='p-4 bg-white text-2xl'>
                Staff management
            </div>

            <div className='p-4 flex justify-end'>
                <Button type="primary" size='large' className='w-32 bg-green-500 hover:!bg-green-400' onClick={showAddModal}>Add</Button>
            </div>

            <div className='px-4 h-fit'>
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

            <Modal title="Add Staff" open={isModalAddOpen} onOk={handleAddOk} onCancel={handleAddCancel} >
                <Form form={formAdd} layout="vertical">
                    <Form.Item label="ID" name="id" rules={[{ required: true, message: 'Please input the ID' }]}>
                        <InputNumber size='large' min={1000} className='w-full'/>
                    </Form.Item>

                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name' }]}>
                        <Input size='large'/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Edit Staff" open={isModalEditOpen} onOk={handleEditOk} onCancel={handleEditCancel} >
                <Form form={formEdit} layout="vertical">
                    <Form.Item label="ID" name="id" rules={[{ required: true, message: 'Please input the ID' }]}>
                        <InputNumber size='large' min={1000} className='w-full'/>
                    </Form.Item>

                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name' }]}>
                        <Input size='large'/>
                    </Form.Item>

                    <Form.Item name="oldId" hidden>
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Delete Staff" open={isModalDeleteOpen} onOk={handleDeleteOk} onCancel={handleDeleteCancel} >
                <Form form={formDelete} layout="vertical">
                    <div>Confirm delete staff with ID <strong>{deleteID}</strong> ?</div>
                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
