'use client'
import { Suspense, useEffect } from 'react';
import LoadingComponent from '@/components/UI/LoadingComponent';
import ReceiveTokenAuthGoogle from './ReceiveTokenAuthGoogle';

const LoginSuccessPage = () => {
  return (
    <Suspense fallback={<LoadingComponent/>}>
      <ReceiveTokenAuthGoogle/>
    </Suspense>
  );
}

export default LoginSuccessPage;
