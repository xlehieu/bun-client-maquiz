import { createClassroom } from '@/api/classrooms.service';
import { userDashboardRouter } from '@/config/routes';
import useMutationHooks from '@/hooks/useMutationHooks';
import { BodyCreateClassroom } from '@/types/classroom.type';
import { Form, Input, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
type Props = {
    isOpen: boolean;
    onClose: () => void;
};
const ModalCreateClassroom = ({ isOpen, onClose }: Props) => {
    const router = useRouter();
    // const [classroomName, setClassroomName] = useState('');
    // const [subjectName, setSubjectName] = useState('');
    const [formCreateClassroom] = Form.useForm<BodyCreateClassroom>();
    const createClassroomMutation = useMutationHooks((data: { classroomName: string; subjectName: string }) =>
        createClassroom(data),
    );
    const onFinishForm = (formValue: BodyCreateClassroom) => {
        try {
            createClassroomMutation.mutate(formValue);
        } catch (err) {
            toast.error('Lỗi');
        }
    };
    useEffect(() => {
        if (createClassroomMutation.isSuccess) {
            toast.success('Tạo lớp học thành công');
            onClose();
            router.push(`${userDashboardRouter.CLASSROOM}/${createClassroomMutation.data?.classCode}`);
        } else if (createClassroomMutation.isError) {
            toast.error('Tạo lớp học thất bại');
        }
    }, [createClassroomMutation.isError, createClassroomMutation.isSuccess]);
    return (
        <Modal
            open={isOpen}
            title="Tạo lớp học"
            maskClosable={false}
            onCancel={onClose}
            cancelText="Đóng"
            centered
            okText="Tạo"
            confirmLoading={createClassroomMutation.isPending}
            onOk={formCreateClassroom.submit}
        >
            <Form form={formCreateClassroom} onFinish={onFinishForm} layout="vertical">
                <Form.Item<BodyCreateClassroom>
                    name="classroomName"
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
                <Form.Item<BodyCreateClassroom>
                    name="subjectName"
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
            </Form>
        </Modal>
    );
};

export default ModalCreateClassroom;
