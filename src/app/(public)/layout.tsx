// src/app/layout.tsx
'use client';
import '../globals.css';
import React from 'react';
import { message } from 'antd';
import DefaultLayout from '@/layouts/DefaultLayout';
import 'antd/dist/antd'; // bạn có thể bỏ nếu dùng babel import plugin để import theo nhu cầu
message.config({
    top: 0,
    duration: 3,
    maxCount: 3,
});

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    try {
        return <DefaultLayout>{children}</DefaultLayout>;
    } catch (err) {
        console.log(err);
    }
}
