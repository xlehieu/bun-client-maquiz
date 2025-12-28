'use client';
import { updateInfoClassroom } from '@/api/classrooms.service';
import UploadComponent from '@/components/UI/UploadComponent';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useAppSelector } from '@/redux/hooks';
import { Form, Input, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
type BodyUpdateClassroom = {
    classCode: string;
    name: string;
    subject: string;
    thumb: string;
};
const ModalUpdateClassroom = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const router = useRouter();
    const { classroomDetail } = useAppSelector((state) => state.classroom);
    const [formUpdate] = Form.useForm<BodyUpdateClassroom>();
    const updateInfoClassroomMutation = useMutationHooks((data: BodyUpdateClassroom) => updateInfoClassroom(data));
    // const handleUpdateInfoClassroom = () => {
    //     if (!name?.trim() || !subject?.trim()) return toast.error('Tên lớp học và tên môn học không thể bỏ trống');
    //     updateInfoClassroomMutation.mutate({ classCode: classroom?.classCode, name, subject, thumb });
    // };
    useEffect(() => {
        if (classroomDetail?._id) {
            formUpdate.setFieldsValue({
                ...classroomDetail,
            });
        }
    }, [classroomDetail]);
    useEffect(() => {
        if (updateInfoClassroomMutation.isError) {
            toast.error('Có lỗi xảy ra');
            formUpdate.resetFields();
            onClose();
        } else if (updateInfoClassroomMutation.isSuccess) {
            toast.success('Cập nhật thông tin lớp học thành công');
            formUpdate.resetFields();
            window.location.reload();
            onClose();
            // setClassroom((prev: any) => ({ ...prev, name, subject, thumb }));
            updateInfoClassroomMutation.reset();
        }
    }, [updateInfoClassroomMutation.isError, updateInfoClassroomMutation.isSuccess]);
    const handleSubmit = (formValue: BodyUpdateClassroom) => {
        updateInfoClassroomMutation.mutate(formValue);
    };
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            confirmLoading={updateInfoClassroomMutation.isPending}
            title="Chỉnh sửa thông tin"
            okText="Chỉnh sửa"
            cancelText="Hủy"
            onOk={formUpdate.submit}
        >
            <Form form={formUpdate} onFinish={handleSubmit}>
                <Form.Item<BodyUpdateClassroom> name="classCode" hidden />
                <Form.Item<BodyUpdateClassroom>
                    name="subject"
                    label="Tên lớp học"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên lớp học',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<BodyUpdateClassroom>
                    name="name"
                    label="Tên môn học"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên môn học',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<BodyUpdateClassroom>
                    name="thumb"
                    label="Ảnh lớp học"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập chọn ảnh lớp học',
                        },
                    ]}
                >
                    <UploadComponent />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUpdateClassroom;
