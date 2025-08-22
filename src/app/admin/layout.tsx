'use client';
import AdminLayout from '@/layouts/AdminLayout';
import { notFound } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const user = useSelector((state: any) => state.user);
    if (!user.isAdmin) return notFound();
    return <AdminLayout>{children}</AdminLayout>;
};

export default Layout;
