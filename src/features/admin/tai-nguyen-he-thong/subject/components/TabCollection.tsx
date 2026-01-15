'use client';
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useCollection, useCreateCollection, useDeleteCollection, useUpdateCollection } from '../collection.tanstack';
import { CollectionDefault } from '@/@types/common.type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const TabCollection = ({ collection }: { collection: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [form] = Form.useForm();

    // TanStack Query Hooks
    const { data = [], isLoading } = useCollection(collection, [collection]);
    const { mutateAsync: createCollection, isPending: isCreating } = useCreateCollection(collection, [collection]);
    const { mutateAsync: updateCollection, isPending: isUpdating } = useUpdateCollection(collection, [collection]);
    const { mutateAsync: deleteCollection } = useDeleteCollection(collection, [collection]);
    // Mở Modal (Nếu có record là Sửa, không có là Thêm)
    const showModal = (record?: CollectionDefault) => {
        if (record) {
            setEditingRecord(record);
            form.setFieldsValue(record); // Đổ dữ liệu vào form khi sửa
        } else {
            setEditingRecord(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const onFinish = async (values: CollectionDefault) => {
        try {
            if (editingRecord) {
                // Logic Sửa: Cần id của record và dữ liệu mới
                await updateCollection({ id: editingRecord._id, body: { ...values } });
                message.success('Cập nhật thành công!');
            } else {
                // Logic Thêm mới
                await createCollection(values);
                message.success('Thêm mới thành công!');
            }
            handleCancel();
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    const columns = [
        {
            title: 'Mã Mục',
            dataIndex: 'MaMuc',
            key: 'MaMuc',
        },
        {
            title: 'Tên Mục',
            dataIndex: 'TenMuc',
            key: 'TenMuc',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: CollectionDefault) => (
                <>
                    <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>
                        Sửa
                    </Button>
                    <Button
                        type="text"
                        className="text-red-500"
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        onClick={() => deleteCollection(record._id)}
                    >
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm mục mới
                </Button>
            </div>

            <Table dataSource={data} columns={columns} rowKey="id" loading={isLoading} pagination={false} />

            <Modal
                title={editingRecord ? 'Chỉnh sửa mục' : 'Thêm mục mới'}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                confirmLoading={isCreating || isUpdating}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item hidden name={'_id'} />
                    <Form.Item
                        name="MaMuc"
                        label="Mã Mục"
                        rules={[{ required: true, message: 'Vui lòng nhập mã mục!' }]}
                    >
                        <Input placeholder="VD: SUBJECT01" />
                    </Form.Item>

                    <Form.Item
                        name="TenMuc"
                        label="Tên Mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên mục!' }]}
                    >
                        <Input placeholder="VD: Toán cao cấp" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TabCollection;
