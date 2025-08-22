// src/app/layout.tsx
'use client';
import './globals.css';
import React, { useContext, useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import 'antd/dist/antd'; // bạn có thể bỏ nếu dùng babel import plugin để import theo nhu cầu
import UserProvide from '@/context/UserContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        },
    },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        document.title = 'Maquiz';
    });
    return (
        <html lang="en">
            <body>
                <Toaster position="top-right" richColors />
                <QueryClientProvider client={queryClient}>
                    <ReduxProvider store={store}>
                        <UserProvide>{children}</UserProvide>
                    </ReduxProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </body>
        </html>
    );
}
