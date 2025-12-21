'use client';
import React from 'react';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import siteRouter, { userDashboardRouter } from '@/config';
import * as AuthService from '@/api/auth.service';
import useMutationHooks from '@/hooks/useMutationHooks';
import { IUser } from '@/interface';
import { useAppSelector } from '@/redux/hooks';
import { persistor } from '@/redux/store';
import { useRouter } from 'next/navigation';
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
                        onClick={() => router.push(userDashboardRouter.myDashboard)}
                    >
                        Dashboard
                    </a>
                    {/* User */}
                    <Tippy
                        trigger="click"
                        interactive
                        placement="bottom-end"
                        offset={[20, 20]}
                        content={
                            <div className="flex flex-col items-center bg-white rounded-md shadow">
                                <Link
                                    className="text-sm py-2 px-3 list-none text-left min-w-48 hover:bg-gray-100"
                                    href={siteRouter.profile}
                                >
                                    Thông tin tài khoản
                                </Link>
                                <Link
                                    href={userDashboardRouter.myDashboard}
                                    className="bg-white text-sm py-2 px-3 list-none text-left min-w-48 hover:bg-gray-100"
                                >
                                    Dashboard
                                </Link>
                                <div className="h-0 w-full my-2 border border-solid border-gray-100" />
                                <button
                                    className="bg-white text-sm py-2 px-3 list-none text-left hover:bg-gray-100 min-w-48"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        }
                    >
                        <div className="flex justify-between items-center hover:cursor-pointer">
                            {userProfile?.avatar && (
                                <img
                                    className="rounded-full mr-1 w-8 h-8"
                                    src={userProfile?.avatar}
                                    alt={userProfile?.name}
                                />
                            )}
                            <p className="text-lg text-white ">{userProfile?.name}</p>
                        </div>
                    </Tippy>
                </div>
            </nav>
            {/* End Navbar */}
        </>
    );
}
