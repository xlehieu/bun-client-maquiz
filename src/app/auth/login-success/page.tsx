'use client';
import LoadingComponent from '@/components/UI/LoadingComponent';
import { useAppDispatch } from '@/redux/hooks';
import { setAccessToken } from '@/redux/slices/auth.slice';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const LoginSuccessPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    useEffect(() => {
        const token = searchParams.get('token'); // Lấy token từ URL
        if (token) {
            // localStorage.setItem('access_token', token); // Lưu vào localStorage
            dispatch(setAccessToken(token));
            // Có thể redirect về trang home hoặc dashboard
            router.replace('/'); // ví dụ redirect về home
        }
    }, [searchParams, router]);
    return <Suspense fallback={<LoadingComponent isLoading />}></Suspense>;
};

export default LoginSuccessPage;
