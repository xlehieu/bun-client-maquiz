import { createClassroom, enrollInClassroom } from '@/api/classrooms.service';
import { USER_DASHBOARD_ROUTER } from '@/config/routes';
import useMutationHooks from '@/hooks/useMutationHooks';
import { BodyCreateClassroom } from '@/types/classroom.type';
import { Form, Input, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
type BodyEnrollClass = {
    classCode: string;
};
type Props = {
    isOpen: boolean;
    onClose: () => void;
};
const ModalEnrollClassroom = ({ isOpen, onClose }: Props) => {
    const router = useRouter();
    // const [classroomName, setClassroomName] = useState('');
    // const [subjectName, setSubjectName] = useState('');
    const [formEnrollClassroom] = Form.useForm<BodyEnrollClass>();
    const enrollInClassMutation = useMutationHooks((data: { classCode: string }) => enrollInClassroom(data));
    const onFinishForm = (formValue: BodyEnrollClass) => {
        try {
            enrollInClassMutation.mutate(formValue);
        } catch (err) {
            toast.error('Lỗi');
        }
    };
    useEffect(() => {
        if (enrollInClassMutation.isSuccess) {
            onClose();
            toast.success('Tham gia lớp học thành công');
            router.push(`${USER_DASHBOARD_ROUTER.CLASSROOM}/${formEnrollClassroom.getFieldValue('classCode')}`);
        } else if (enrollInClassMutation.isError) {
            toast.error('Tham gia lớp học thất bại');
        }
    }, [enrollInClassMutation.isError, enrollInClassMutation.isSuccess]);
    return (
        <Modal
            open={isOpen}
            title="Tham gia lớp học"
            maskClosable={false}
            onCancel={onClose}
            cancelText="Đóng"
            centered
            okText="Tham gia"
            confirmLoading={enrollInClassMutation.isPending}
            onOk={formEnrollClassroom.submit}
        >
            <Form form={formEnrollClassroom} onFinish={onFinishForm} layout="vertical">
                <Form.Item<BodyEnrollClass>
                    name="classCode"
                    label="Mã lớp học"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mã lớp',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalEnrollClassroom;
