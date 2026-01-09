'use client';
import MAIN_ROUTE, { USER_DASHBOARD_ROUTER } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetUser } from '@/redux/slices/user.slice';
import { persistor } from '@/redux/store';
import { UserOutlined, LayoutOutlined, LogoutOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Divider, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LazyImage from '../LazyImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faChartLine, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

type UserDropdownProps = {
    isDashboard?: boolean;
};

const UserDropdown = ({ isDashboard = false }: UserDropdownProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { userProfile } = useAppSelector((state) => state.user);

    const handleLogOut = async () => {
        persistor.purge();
        dispatch(resetUser());
        router.replace(MAIN_ROUTE.LOGIN);
    };

    // Tách menu items để code sạch hơn
    const items: MenuProps['items'] = [
        {
            key: 'header',
            label: (
                <div className="px-2 py-1">
                    <p className="text-xs text-gray-400 m-0">Tài khoản</p>
                    <p className="font-semibold text-gray-700 truncate max-w-[150px]">
                        {userProfile?.name || userProfile?.email}
                    </p>
                </div>
            ),
            disabled: true,
        },
        { type: 'divider' },
        {
            key: '1',
            icon: <FontAwesomeIcon icon={faAddressCard} />,
            label: <Link href={MAIN_ROUTE.PROFILE}>Thông tin tài khoản</Link>,
        },
        {
            key: '2',
            icon: <FontAwesomeIcon icon={faChartLine} />,
            label: <Link href={USER_DASHBOARD_ROUTER.MY_DASHBOARD}>My Dashboard</Link>,
        },
        { type: 'divider' },
        {
            key: '3',
            icon: <FontAwesomeIcon icon={faRightFromBracket} />,
            label: 'Đăng xuất',
            danger: true, // Hiệu ứng màu đỏ của Ant Design
            onClick: handleLogOut,
        },
    ];

    return (
        <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }} trigger={['click']}>
            <div className="flex items-center gap-2 cursor-pointer group transition-all duration-300 hover:opacity-80">
                {userProfile?.avatar ? (
                    <LazyImage
                        className="rounded-full w-8 h-8 object-cover overflow-hidden"
                        src={userProfile?.avatar}
                        alt={userProfile?.name}
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserOutlined className="text-gray-400" />
                    </div>
                )}

                <div className="hidden md:flex flex-col items-start leading-none">
                    <span className={`text-sm font-medium ${isDashboard ? 'text-white' : 'text-gray-700'}`}>
                        {userProfile?.name?.split(' ').pop() || userProfile?.email || 'User'}
                    </span>
                </div>
            </div>
        </Dropdown>
    );
};

export default UserDropdown;
