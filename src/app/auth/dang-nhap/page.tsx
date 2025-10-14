'use client';
import React, { useEffect, useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import * as UserService from '@/services/user.service';
import * as AuthService from '@/services/auth.service';
import useMutationHooks from '@/hooks/useMutationHooks';
import { toast } from 'sonner';
import { fetchUserProfile, updateUser } from '@/redux/slices/user.slice';
import siteRouter from '@/config';
import Cookies from 'js-cookie';
import { ILoginForm } from '@/interface';

const SignInPage = () => {
    // const mutation = useMutation({
    //     mutationFn: (data: any) => UserService.login(data),
    // });
    const router = useRouter();
    const emailCookie = Cookies.get('user_email');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [emailValue, setEmailValue] = useState(emailCookie == 'undefined' || !emailCookie ? '' : emailCookie);
    const [passwordValue, setPasswordValue] = useState('');
    const dispatch = useDispatch();

    const handleOnChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailValue(e.target.value);
    };
    const handleOnChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(e.target.value);
    };
    const loginMutation = useMutationHooks((data: ILoginForm) => AuthService.login(data));
    const handleOnClick = (e: any) => {
        e.preventDefault();
        loginMutation.mutate({
            email: emailValue,
            password: passwordValue,
        });
    };
    const HandleLoginWithGoogle = (e: React.MouseEvent) => {
        e.preventDefault();
        AuthService.loginWithGoogle();
    };
    //Sau khi chạy đến hết đoạn code logic thì state mới được set lại để re-render component
    //vậy nên đến đây thì emailValue vẫn chưa được set lại
    const getUserDetailMutation = useMutationHooks(() => UserService.getUserDetail());
    useEffect(() => {
        if (loginMutation.isSuccess) {
            console.log(loginMutation.data.data.access_token);
            localStorage.setItem('access_token', loginMutation.data?.data?.access_token || '');
            getUserDetailMutation.mutate();
        } else if (loginMutation.isError) {
            console.log('OK');
            toast.error((loginMutation.error as { message?: string })?.message || 'Đăng nhập không thành công');
        }
    }, [loginMutation.isSuccess, loginMutation.isError]);
    useEffect(() => {
        if (getUserDetailMutation.data) {
            dispatch(fetchUserProfile() as any);
            toast.success('Đăng nhập thành công');
            router.push('/');
        } else if (getUserDetailMutation.isError) {
            toast.error('Đăng nhập không thành công');
        }
    }, [getUserDetailMutation.isSuccess, getUserDetailMutation.isError]);
    return (
        <div className="w-full">
            <form className="mx-auto w-full md:max-w-96 space-y-6" method="post">
                <input
                    id="input-email"
                    className="border border-gray-500 py-2 px-3 w-full outline-none"
                    value={emailValue}
                    onChange={(e) => handleOnChangeEmail(e)}
                    autoComplete="email"
                    placeholder="Email"
                    type="email"
                    name="email"
                />
                <div className="flex px-3 py-2 border border-gray-500 box-border w-full  outline-primary">
                    <input
                        id="input-password"
                        className="outline-none mr-2 flex-1"
                        type={isShowPassword ? 'text' : 'password'}
                        onChange={(e) => handleOnChangePassword(e)}
                        autoComplete="current-password"
                        value={passwordValue}
                        placeholder="Mật khẩu"
                        name="password"
                    />

                    {isShowPassword ? (
                        <EyeOutlined onClick={() => setIsShowPassword(!isShowPassword)} />
                    ) : (
                        <EyeInvisibleOutlined onClick={() => setIsShowPassword(!isShowPassword)} />
                    )}
                </div>
                <button
                    disabled={!emailValue || !passwordValue || loginMutation.isPending}
                    onClick={handleOnClick}
                    className={`w-full cursor-pointer bg-primary text-white rounded py-3 md:py-2 ${
                        (!emailValue || !passwordValue || loginMutation.isPending) && 'opacity-40 cursor-default'
                    }`}
                >
                    {loginMutation.isPending ? <LoadingOutlined /> : 'ĐĂNG NHẬP'}
                </button>
                <button
                    onClick={(e) => HandleLoginWithGoogle(e)}
                    className="w-full cursor-pointer bg-white text-black rounded py-3 md:py-2 border border-[#747775]"
                >
                    <div className="flex justify-center">
                        <div className="h-5 w-5 mr-5">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block">
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                ></path>
                                <path
                                    fill="#4285F4"
                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                ></path>
                                <path
                                    fill="#FBBC05"
                                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                ></path>
                                <path
                                    fill="#34A853"
                                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                ></path>
                                <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                        </div>
                        <span className="gsi-material-button-contents">Sign in with Google</span>
                    </div>
                </button>
            </form>
            <div className="mt-3 mx-auto w-full md:max-w-96">
                <p>
                    Bạn chưa có tài khoản?{' '}
                    <Link href={siteRouter.signUp} className="text-primary font-semibold">
                        Đăng ký tài khoản
                    </Link>
                </p>
            </div>
            <div className="mt-3 mx-auto w-full md:max-w-96">
                <Link href={siteRouter.forgotPassword} className="text-orange-600 font-semibold">
                    Quên mật khẩu ?
                </Link>
            </div>
        </div>
    );
};
export default SignInPage;
