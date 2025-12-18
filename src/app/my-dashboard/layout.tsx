'use client'
import DashboardLayout from '@/layouts/DashboardLayout';
import React from 'react';

export default function MainDashboardLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
