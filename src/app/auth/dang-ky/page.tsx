'use client';
import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from '@ant-design/icons';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { register } from '@/api/auth.service';
import MAIN_ROUTE from '@/config/routes';
import Link from 'next/link';

const SignUpPage = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const mutationRegister = useMutationHooks((data: any) => register(data));

    const handleOnFinish = (values: any) => {
        mutationRegister.mutate({
            email: values.email,
            phone: values.phone,
            password: values.password,
            confirmPassword: values.confirmPassword,
        });
    };

    useEffect(() => {
        if (mutationRegister.isSuccess) {
            toast.success('Đăng ký thành công');
            router.push(MAIN_ROUTE.LOGIN);
        } else if (mutationRegister.isError) {
            toast.error((mutationRegister.error as any).message);
        }
    }, [mutationRegister.isSuccess, mutationRegister.isError]);

    return (
        <div className="flex items-center justify-center px-4 mb-4">
            <div className="w-full md:min-w-[550px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-slate-50">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Đăng Ký</h1>
                    <p className="text-slate-500 font-medium">Tạo tài khoản để bắt đầu hành trình</p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleOnFinish}
                    requiredMark={false}
                    className="space-y-5"
                >
                    {/* Email Input */}
                    <Form.Item
                        label={
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Email
                            </span>
                        }
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                        className="mb-5"
                    >
                        <Input
                            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-700"
                            placeholder="example@gmail.com"
                            type="email"
                        />
                    </Form.Item>

                    {/* Phone Input */}
                    <Form.Item
                        label={
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Số điện thoại
                            </span>
                        }
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' },
                        ]}
                        className="mb-5"
                    >
                        <Input
                            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-700"
                            placeholder="0123456789"
                        />
                    </Form.Item>

                    {/* Password Input */}
                    <Form.Item
                        label={
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Mật khẩu
                            </span>
                        }
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                        ]}
                        className="mb-5"
                    >
                        <Input.Password
                            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-700"
                            placeholder="••••••••"
                            iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    {/* Confirm Password Input */}
                    <Form.Item
                        label={
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Nhập lại mật khẩu
                            </span>
                        }
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                        className="mb-5"
                    >
                        <Input.Password
                            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-700"
                            placeholder="••••••••"
                            iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    {/* Register Button */}
                    <Form.Item className="mb-0 mt-4">
                        <button
                            type="submit"
                            disabled={mutationRegister.isPending}
                            className="w-full bg-primary hover:bg-primary-bold text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {mutationRegister.isPending ? <LoadingOutlined className="text-xl" /> : 'ĐĂNG KÝ'}
                        </button>
                    </Form.Item>
                </Form>

                {/* Footer Link */}
                <p className="text-center mt-10 text-slate-500 font-medium">
                    Bạn đã có tài khoản?{' '}
                    <Link
                        href={MAIN_ROUTE.LOGIN}
                        className="text-primary font-black hover:underline underline-offset-4"
                    >
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
