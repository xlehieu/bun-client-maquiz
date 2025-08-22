'use client';
import { useState, useEffect } from 'react';
import * as AuthService from '@/services/auth.service';
import useMutationHooks from '@/hooks/useMutationHooks';
import { LoadingOutlined } from '@ant-design/icons';
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const sendLinkMutation = useMutationHooks((data: any) => AuthService.forgotPassword(data));
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        sendLinkMutation.mutate({ email });
    };
    useEffect(() => {
        if (sendLinkMutation.isSuccess) {
            setMessage('✅ Link đặt lại mật khẩu đã được gửi về email.');
            sendLinkMutation.reset();
        } else if (sendLinkMutation.isError) {
            setMessage('❌ Không tìm thấy email.');
            sendLinkMutation.reset();
        }
    }, [sendLinkMutation]);
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Quên mật khẩu</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
                <input
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className={`bg-blue-500 text-white p-2 rounded text-center flex justify-center items-center ${
                        (sendLinkMutation.isPending || email.length <= 0) && 'opacity-50'
                    }`}
                    disabled={sendLinkMutation.isPending || email.length <= 0}
                >
                    {sendLinkMutation.isPending && <LoadingOutlined className="mr-2" />}Gửi link
                </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
