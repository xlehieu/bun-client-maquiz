'use client';
import * as AuthService from '@/api/auth.service';
import MAIN_ROUTE from '@/config/routes';
import useMutationHooks from '@/hooks/useMutationHooks';
import { ILoginForm } from '@/interface';
import { useAppDispatch } from '@/redux/hooks';
import { setAccessToken } from '@/redux/slices/auth.slice';
import { EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const SignInPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const emailCookie = Cookies.get('user_email');

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [emailValue, setEmailValue] = useState(emailCookie === 'undefined' || !emailCookie ? '' : emailCookie);
    const [passwordValue, setPasswordValue] = useState('');

    const loginMutation = useMutationHooks((data: ILoginForm) => AuthService.callLogin(data));

    const handleOnClick = (e: any) => {
        e.preventDefault();
        loginMutation.mutate({ email: emailValue, password: passwordValue });
    };

    const HandleLoginWithGoogle = async (e: React.MouseEvent) => {
        e.preventDefault();
        AuthService.loginWithGoogle();
    };

    useEffect(() => {
        if (loginMutation.isSuccess) {
            dispatch(setAccessToken(loginMutation.data.data.access_token));
            toast.success('Chào mừng bạn quay trở lại!');
            router.push('/');
        } else if (loginMutation.isError) {
            toast.error((loginMutation.error as any)?.response?.data?.message || 'Email hoặc mật khẩu không đúng');
        }
    }, [loginMutation.isSuccess, loginMutation.isError]);

    return (
        <div className="flex items-center justify-center px-4 mb-4">
            <div className="w-full md:min-w-[550px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-slate-50">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Đăng Nhập</h1>
                    <p className="text-slate-500 font-medium">Tiếp tục hành trình chinh phục kiến thức</p>
                </div>

                <form className="space-y-5" onSubmit={handleOnClick}>
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Email
                        </label>
                        <input
                            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-700"
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            placeholder="example@gmail.com"
                            type="email"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Mật khẩu
                            </label>
                            <Link
                                href={MAIN_ROUTE.FORGOT_PASSWORD}
                                className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative group">
                            <input
                                className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-700"
                                type={isShowPassword ? 'text' : 'password'}
                                value={passwordValue}
                                onChange={(e) => setPasswordValue(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setIsShowPassword(!isShowPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-2"
                            >
                                {isShowPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </button>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={!emailValue || !passwordValue || loginMutation.isPending}
                        className="w-full bg-primary hover:bg-primary-bold text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4"
                    >
                        {loginMutation.isPending ? <LoadingOutlined className="text-xl" /> : 'ĐĂNG NHẬP'}
                    </button>

                    {/* Divider */}
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Hoặc</span>
                        </div>
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={HandleLoginWithGoogle}
                        className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-3 shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 48 48">
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            />
                            <path
                                fill="#4285F4"
                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                            />
                            <path
                                fill="#34A853"
                                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                            />
                        </svg>
                        Đăng nhập bằng Google
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-center mt-10 text-slate-500 font-medium">
                    Bạn chưa có tài khoản?{' '}
                    <Link
                        href={MAIN_ROUTE.REGISTER}
                        className="text-primary font-black hover:underline underline-offset-4"
                    >
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignInPage;
