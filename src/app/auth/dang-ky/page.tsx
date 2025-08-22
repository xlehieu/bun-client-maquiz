'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';

import { EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from '@ant-design/icons';

import useMutationHooks from '@/hooks/useMutationHooks';
import * as UserService from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const SignUpPage = () => {
    const router = useRouter();
    const mutationRegister = useMutationHooks((data: any) => UserService.register(data));
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const handleOnClickRegister = (e: any) => {
        e.preventDefault();
        if (!email || !phone || !password || !confirmPassword) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        mutationRegister.mutate({
            email,
            phone,
            password: password,
            confirmPassword: confirmPassword,
        });
    };
    useEffect(() => {
        if (mutationRegister.isSuccess) {
            toast.success('Đăng ký thành công');
            router.push('/dang-nhap');
        } else if (mutationRegister.isError) {
            toast.error((mutationRegister.error as any).message);
        }
    }, [mutationRegister.isSuccess, mutationRegister.isError]);
    return (
        <div className="w-full">
            <form className="mx-auto w-full md:max-w-96 space-y-6" method="post">
                <input
                    id="input-email"
                    className="border border-gray-500 py-2 px-3 w-full outline-primary"
                    placeholder="Email"
                    autoComplete="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    id="input-phone"
                    className="border border-gray-500 py-2 px-3 w-full outline-primary"
                    placeholder="Số điện thoại"
                    name="phone"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <div className="flex px-3 py-2 border border-gray-500 box-border w-full  outline-primary">
                    <input
                        id="input-password"
                        className="outline-none mr-2 flex-1"
                        type={isShowPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        name="password"
                        autoComplete="new-password"
                        placeholder="Mật khẩu"
                    />
                    {isShowPassword ? (
                        <EyeOutlined onClick={() => setIsShowPassword(!isShowPassword)} />
                    ) : (
                        <EyeInvisibleOutlined onClick={() => setIsShowPassword(!isShowPassword)} />
                    )}
                </div>
                <div className="flex px-3 py-2 border border-gray-500 box-border w-full  outline-primary">
                    <input
                        id="input-confirm-password"
                        className="outline-none mr-2 flex-1"
                        type={isShowConfirmPassword ? 'text' : 'password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        name="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Nhập lại mật khẩu"
                    />
                    <span onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}>
                        {isShowConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </span>
                </div>
                <button
                    disabled={!email || !phone || !password || !confirmPassword}
                    className={`w-full cursor-pointer bg-primary text-white rounded py-1 ${
                        (!email || !phone || !password || !confirmPassword || mutationRegister.isPending) &&
                        'opacity-40 cursor-default'
                    }`}
                    onClick={handleOnClickRegister}
                >
                    {mutationRegister.isPending ? <LoadingOutlined /> : 'ĐĂNG KÝ'}
                </button>
            </form>
        </div>
    );
};

export default SignUpPage;
