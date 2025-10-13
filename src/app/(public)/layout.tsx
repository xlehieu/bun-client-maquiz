// src/app/layout.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import DefaultLayout from '@/layouts/DefaultLayout';
import 'antd/dist/antd'; // bạn có thể bỏ nếu dùng babel import plugin để import theo nhu cầu
import '../globals.css';
message.config({
    top: 0,
    duration: 3,
    maxCount: 3,
});

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
        useEffect(() => setMounted(true), []);
        if (!mounted) return null; // ngăn lỗi khi prerender
    try {
        return <DefaultLayout>{children}</DefaultLayout>;
    } catch (err) {
        console.log(err);
    }
}
