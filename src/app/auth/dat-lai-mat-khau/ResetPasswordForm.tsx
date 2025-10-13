'use client';
import React, { Fragment } from 'react';
import { useEffect, useState } from 'react';
import useMutationHooks from '@/hooks/useMutationHooks';
import * as AuthService from '@/services/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { toast } from 'sonner';
const ResetPasswordForm = () => {
    useEffect(() => {
        document.title = 'Đặt lại mật khẩu';
    }, []);
    const router =useRouter()
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const resetPasswordMutation = useMutationHooks((data: any) => AuthService.resetPassword(data));
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        resetPasswordMutation.mutate({ newPassword: password, token: token });
        // setMessage('✅ Đổi mật khẩu thành công.');
    };
    useEffect(() => {
        if (resetPasswordMutation.isSuccess) {
            toast.success('Đổi mật khẩu thành công.');
            setTimeout(() => {
                router.refresh()
            }, 1500);
        } else if (resetPasswordMutation.isError) {
            toast.error('Đổi mật khẩu thất bại.');
        }
    }, [resetPasswordMutation.isSuccess, resetPasswordMutation.isError]);
    if (!token) return <p>❌ Token không hợp lệ.</p>;

    return (
        <Fragment>
            <div className="flex px-3 py-2 border border-gray-500 box-border w-full  outline-primary">
                <input
                    className="outline-none mr-2 flex-1"
                    type={isShowPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Mật khẩu mới"
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {isShowPassword ? (
                    <EyeOutlined onClick={() => setIsShowPassword(!isShowPassword)} />
                ) : (
                    <EyeInvisibleOutlined onClick={() => setIsShowPassword(!isShowPassword)} />
                )}
            </div>
            <button
                disabled={!password || resetPasswordMutation.isPending}
                onClick={handleSubmit}
                className={`w-full cursor-pointer bg-primary text-white rounded py-3 md:py-2 ${
                    (!password || resetPasswordMutation.isPending) && 'opacity-40 cursor-default'
                }`}
            >
                {resetPasswordMutation.isPending ? <LoadingOutlined /> : 'ĐẶT LẠI MẬT KHẨU'}
            </button>
        </Fragment>
    );
};

export default ResetPasswordForm;
