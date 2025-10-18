'use client'
import axiosCredentials from '@/config/axios.credential';
import axiosNoCredential from '@/config/axios.nointerceptor';
import { ILoginForm } from '@/interface';
export const login = async (data: ILoginForm) => {
    const { email, password } = data;
    if (!email || !password) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
    }
    const res = await axiosNoCredential.post(`/auth/sign-in`, JSON.stringify(data));
    return res.data;
};
export const loginWithGoogle = async () => {
    if (typeof window !== 'undefined') {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    }
};
export const logout = async () => {
    const res = await axiosCredentials.post(`/auth/log-out`);
    return res;
};
//yeu cau gui smtp de lay link thay doi mat khau
export const forgotPassword = async (data: any) => {
    const { email } = data;
    if (!email) return null;
    const res = await axiosNoCredential.post(`auth/forgot-password`, { email });
    return res.data;
};
export const resetPassword = async (data: any) => {
    const { newPassword, token } = data;
    const res = await axiosNoCredential.post(`/auth/reset-password`, {
        token,
        newPassword,
    });
    return res.data;
};
