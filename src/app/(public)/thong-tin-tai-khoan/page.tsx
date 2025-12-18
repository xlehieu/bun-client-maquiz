'use client';
import { useCallback, useEffect, useState } from 'react';

import * as UserService from '@/api/user.service';
import LoadingComponent from '@/components/UI/LoadingComponent';
import UploadComponent from '@/components/UI/UploadComponent';
import useMutationHooks from '@/hooks/useMutationHooks';
import { toast } from 'sonner';
import { Button, Col, Form, Input, Row } from 'antd';
import { BodyUpdateUser } from '@/types/user.type';
import { useAppSelector } from '@/redux/hooks';
const ProfileUser = () => {
    const [form] = Form.useForm();
    const { userProfile } = useAppSelector((state) => state.user);
    const updateUserMutation = useMutationHooks((data: BodyUpdateUser) => UserService.updateUser(data));
    const onFinishForm = async (formValue: BodyUpdateUser) => {
        await updateUserMutation.mutate(formValue);
    };
    useEffect(() => {
        if (userProfile?._id) {
            form.setFieldsValue({
                ...userProfile,
            });
        }
    }, [userProfile]);
    useEffect(() => {
        if (updateUserMutation.isPending) return;
        if (updateUserMutation.isError) {
            toast.error('Sửa thông tin cá nhân thất bại');
        } else if (updateUserMutation.isSuccess) {
            toast.success('Thay đổi thông tin thành công');
            setTimeout(() => {
                router.replace('/');
            }, 1500);
        }
    }, [updateUserMutation.isError, updateUserMutation.isSuccess]);
    return (
        <>
            {updateUserMutation.isPending ? (
                <LoadingComponent />
            ) : (
                <div className="flex justify-center my-6">
                    <div className="w-full md:w-1/2 bg-white px-8 py-5 rounded-md shadow-sm">
                        <div className="border-b border-solid border-gray-200 pb-3">
                            <h5>Hồ sơ của tôi</h5>
                            <p className="text-slate-500">Quản lý hồ sơ để bảo mật tài khoản</p>
                        </div>
                        <Form form={form} layout="vertical" onFinish={onFinishForm}>
                            <Row gutter={[20, 12]}>
                                <Col xs={16}>
                                    <Row>
                                        <Col xs={24}>
                                            <Form.Item<BodyUpdateUser>
                                                name="name"
                                                label="Họ và tên"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập tên',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Nhập tên"></Input>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24}>
                                            <Form.Item<BodyUpdateUser>
                                                name="phone"
                                                label="Số điện thoại"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập số điện thoại',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Nhập số điện thoại"></Input>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24}>
                                            <Form.Item<BodyUpdateUser>
                                                name="email"
                                                label="Email"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập email',
                                                    },
                                                    {
                                                        type: 'email',
                                                        message: 'Email không đúng định dạng',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Nhập email"></Input>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24}>
                                            <Form.Item<BodyUpdateUser>
                                                name="address"
                                                label="Địa chỉ"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập địa chỉ',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Nhập địa chỉ" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={8}>
                                    <Form.Item<BodyUpdateUser> name="avatar">
                                        <UploadComponent />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Button type="primary" className="px-10" onClick={form.submit}>
                            Lưu
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};
export default ProfileUser;
