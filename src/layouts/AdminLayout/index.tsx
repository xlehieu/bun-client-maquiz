'use client';
import React, { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FooterAdmin from '@/components/UI/Footers/FooterDashboard';
import AdminSidebar from './AdminSidebar/AdminSidebar';
import AdminNavbar from './AdminNavbar';
import LoadingComponent from '@/components/UI/LoadingComponent';

const AdminLayout = ({ children, title = 'Maquiz' }: { children: React.ReactNode; title?: string }) => {
    useEffect(() => {
        // Scroll to top on route change
        document.title = title;
    }, []);
    const user = useSelector((state: any) => state.user); // dùng selector để lấy thông tin từ reducer
    return (
        <Suspense fallback={<LoadingComponent />}>
            <AdminSidebar />
            <AdminNavbar user={user} />
            <div className="absolute top-0 md:top-14 right-0 left-0 md:left-64 px-4 bg-background">
                <div className="w-full mt-40 md:mt-0">{children}</div>
                <div className="px-4 md:px-10 mx-auto w-full">
                    <FooterAdmin />
                </div>
            </div>
        </Suspense>
    );
};
export default AdminLayout;
