'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import siteRouter, { userDashboardRouter } from '@/config';
import * as AuthService from '@/services/auth.service';
import useMutationHooks from '@/hooks/useMutationHooks';
export default function AdminNavbar({ user }: any) {
    const logoutMutation = useMutationHooks(() => AuthService.logout());
    const handleLogout = () => {
        logoutMutation.mutate();
        return window.location.assign('/');
    };
    return (
        <>
            {/* Navbar */}
            <nav className="absolute top-0 right-0 w-full z-10 h-14 bg-primary md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
                <div className="md:ml-64 w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
                    {/* Brand */}
                    <a
                        className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
                        href="/my-dashboard"
                        onClick={() => window.location.reload()}
                    >
                        Dashboard
                    </a>
                    {/* Form */}
                    <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
                        <div className="relative flex w-full flex-wrap items-stretch">
                            <span className="z-10 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm đề thi"
                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                            />
                        </div>
                    </form>
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
                            {user?.avatar && (
                                <img className="rounded-full mr-1 w-8 h-8" src={user?.avatar} alt={user?.name} />
                            )}
                            <p className="text-lg text-white ">{user?.name}</p>
                        </div>
                    </Tippy>
                </div>
            </nav>
            {/* End Navbar */}
        </>
    );
}
