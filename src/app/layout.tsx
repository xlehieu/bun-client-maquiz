// src/app/layout.tsx
'use client';
import store, { persistor } from '@/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'antd/dist/antd'; // bạn có thể bỏ nếu dùng babel import plugin để import theo nhu cầu
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';
import './globals.css';
import AppLayout from '@/layouts/AppLayout';

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
    }, []);

    return (
        <html lang="en" title="Maquiz">
            <body>
                <Toaster position="top-right" richColors />
                <QueryClientProvider client={queryClient}>
                    <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <AppLayout>{children}</AppLayout>
                        </PersistGate>
                    </Provider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </body>
        </html>
    );
}
