import { BodyCreateAdmin } from '@/@types/adminUsers.type';
import { useCreateAdmin } from '@/features/admin/adminUser.mutation';
import { Form, Input, Modal } from 'antd';
import React from 'react';
import { toast } from 'sonner';

interface Props {
    isOpenModal: boolean;
    onClose: () => void;
}

const ModalCreateAdmin = ({ isOpenModal, onClose }: Props) => {
    const [form] = Form.useForm<BodyCreateAdmin>();
    const { mutateAsync: createAdmin, isPending } = useCreateAdmin();
    const onFinish = async (data: BodyCreateAdmin) => {
        try {
            await createAdmin(data, {
                onSuccess() {
                    toast.message('Tạo tài admin khoản thành công');
                    form.resetFields();
                    onClose();
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            });
        } catch {}
    };
    return (
        <Modal
            title="Tạo mới Admin"
            open={isOpenModal}
            onCancel={onClose}
            onOk={() => form.submit()} // Kích hoạt submit form khi nhấn OK
            destroyOnClose // Xóa dữ liệu form khi đóng modal
        >
            <Form
                form={form}
                layout="vertical"
                name="create_admin_form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item<BodyCreateAdmin>
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không đúng định dạng!' },
                    ]}
                >
                    <Input placeholder="admin@example.com" />
                </Form.Item>

                <Form.Item<BodyCreateAdmin>
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item<BodyCreateAdmin>
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={['password']} // Theo dõi trường password để validate
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateAdmin;
