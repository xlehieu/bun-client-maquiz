'use client'

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LoadingComponent from '@/components/UI/LoadingComponent';

const ReceiveTokenAuthGoogle = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token'); // Lấy token từ URL
    if (token) {
      localStorage.setItem('access_token', token); // Lưu vào localStorage
      // Có thể redirect về trang home hoặc dashboard
      router.replace('/'); // ví dụ redirect về home
    }
  }, [searchParams, router]);

  return (
    <div></div>
  );
}

export default ReceiveTokenAuthGoogle;
