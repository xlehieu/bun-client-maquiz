'use client';
import FooterAdmin from '@/components/UI/Footers/FooterDashboard';
import UserNavbar from '@/layouts/DashboardLayout/UserNavbar';
import UserSidebar from '@/layouts/DashboardLayout/UserSidebar';
import { Layout } from 'antd';
import React, { memo } from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Layout className="grid grid-cols-5 bg-white">
                <div className="col-span-1">
                    <UserSidebar />
                </div>
                <Layout className="col-span-4">
                    <UserNavbar />
                    <div className="top-0 md:top-14 right-0 left-0 md:left-64 px-4 bg-background">
                        <div className="w-full mt-40 md:mt-0">{children}</div>
                        <div className="px-4 md:px-10 mx-auto w-full">
                            <FooterAdmin />
                        </div>
                    </div>
                </Layout>
            </Layout>
        </>
    );
};
export default memo(DashboardLayout);
