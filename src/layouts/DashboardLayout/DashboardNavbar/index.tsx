'use client';
import React from 'react';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import MAIN_ROUTE, { userDashboardRouter } from '@/config/routes';
import * as AuthService from '@/api/auth.service';
import useMutationHooks from '@/hooks/useMutationHooks';
import { IUser } from '@/interface';
import { useAppSelector } from '@/redux/hooks';
import { persistor } from '@/redux/store';
import { useRouter } from 'next/navigation';
import UserDropdown from '@/components/UI/Dropdowns/UserDropdown';
export default function UserNavbar() {
    const router = useRouter();
    const logoutMutation = useMutationHooks(() => AuthService.logout());
    const { userProfile } = useAppSelector((state) => state.user);
    const handleLogout = () => {
        logoutMutation.mutate();
        persistor.purge();
        return window.location.assign('/');
    };
    return (
        <>
            {/* Navbar */}
            <nav className="w-full z-10 h-14 bg-primary md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
                <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
                    {/* Brand */}
                    <a
                        className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
                        href="/my-dashboard"
                        onClick={() => router.push(userDashboardRouter.MY_DASHBOARD)}
                    >
                        Dashboard
                    </a>
                    {/* User */}
                    <UserDropdown isDashboard />
                </div>
            </nav>
            {/* End Navbar */}
        </>
    );
}
