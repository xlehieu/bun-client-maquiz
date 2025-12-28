'use client';
import MAIN_ROUTE, { userDashboardRouter } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetUser } from '@/redux/slices/user.slice';
import { persistor } from '@/redux/store';
import { DashboardOutlined, IdcardOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LazyImage from '../LazyImage';
type UserDropdownProps = {
    isDashboard?: boolean;
};
const UserDropdown = ({ isDashboard = false }: UserDropdownProps) => {
    const router = useRouter();
    // dropdown props
    const dispatch = useAppDispatch();
    const { userProfile } = useAppSelector((state) => state.user);
    const handleLogOut = async () => {
        persistor.purge();
        dispatch(resetUser());
        router.replace(MAIN_ROUTE.LOGIN);
    };
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Link href={MAIN_ROUTE.PROFILE}>
                    <IdcardOutlined className="pr-2" />
                    Thông tin tài khoản
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link href={userDashboardRouter.MY_DASHBOARD}>
                    <DashboardOutlined className="pr-2" />
                    My Dashboard
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <button onClick={handleLogOut}>
                    <LogoutOutlined className="pr-2" />
                    Đăng xuất
                </button>
            ),
        },
    ];
    return (
        <Dropdown placement="bottomRight" menu={{ items }}>
            <div className="flex justify-between items-center">
                {userProfile?.avatar && (
                    <LazyImage
                        className="rounded-full mr-1 w-8 h-8 overflow-hidden"
                        src={userProfile?.avatar}
                        alt={userProfile?.name}
                        // placeholder={"..."}
                    />
                )}

                <p className={`text-lg ${isDashboard ? 'text-white' : 'text-primary'}`}>
                    {userProfile?.name || userProfile?.email}
                </p>
            </div>
        </Dropdown>
    );
};

export default UserDropdown;
