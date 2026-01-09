'use client';
import React, { lazy, useEffect } from 'react';
const Footer = lazy(() => import('@/components/UI/Footer'));
const HeaderComponent = lazy(() => import('@/layouts/DefaultLayout/HeaderDefaultLayout'));

function DefaultLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    useEffect(() => {
        document.title = title ?? 'Maquiz';
    });
    return (
        <main className="relative overflow-hidden no-scrollbar">
            <HeaderComponent></HeaderComponent>
            <div className="bg-background pb-10 custom-view [min-height:calc(100vh-550px)]">
                <div className="container mx-auto pt-28">{children}</div>
            </div>
            <Footer />
        </main>
    );
}

export default DefaultLayout;
