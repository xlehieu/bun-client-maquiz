'use client';
import MAIN_ROUTE, { USER_DASHBOARD_ROUTER } from '@/config/routes';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DashboardOutlined, IdcardOutlined, LogoutOutlined } from '@ant-design/icons';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
export default function UserInfoHeader() {
    const router = useRouter();
    const [isExpand, setIsExpand] = useState(false);
    const { userProfile } = useAppSelector((state) => state.user);
    const handleToggle = () => {
        if (!isExpand) {
            // document.documentElement.requestFullscreen?.() documentElement dùng để chuyển tất c ả các phần tử trong trang sang chế độ toàn màn hình
            //còn khi thoát thì không cần documentElement vì bất kỳ phần tử nào cũng phải thoát nên không cần thêm documenElement
            // ngoài ra webkit, moz, ms là để hỗ trợ các trình duyệt cũ
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        setIsExpand(!isExpand);
    };
    const [loading, setLoading] = useState({
        isLoading: false,
        index: -1,
    });
    const handleClick = async (item: any, index: number) => {
        setLoading({
            isLoading: true,
            index,
        });
        if (!item.type && item.route) {
            router.push(item.route);
        }
    };
    useEffect(() => {
        setTimeout(() => {
            setLoading({
                isLoading: false,
                index: -1,
            });
        }, 10000);
    }, [loading]);
    return (
        <div className="hidden md:flex gap-5 justify-end items-center">
            <button onClick={handleToggle}>
                <FontAwesomeIcon icon={faExpand} className="text-primary" />
            </button>
            {userProfile?.email ? ( // Menu tippy
                <Tippy
                    trigger="click"
                    interactive
                    placement="bottom-end"
                    offset={[0, 20]}
                    content={
                        <div className="flex flex-col items-center bg-white rounded-md shadow">
                            <Link
                                className="text-sm py-2 px-3 list-none text-left min-w-48 hover:bg-gray-100"
                                href={MAIN_ROUTE.PROFILE}
                            >
                                Thông tin tài khoản
                            </Link>
                            <Link
                                href={USER_DASHBOARD_ROUTER.MY_DASHBOARD}
                                className="bg-white text-sm py-2 px-3 list-none text-left min-w-48 hover:bg-gray-100"
                            >
                                Dashboard
                            </Link>
                        </div>
                    }
                >
                    <div className="flex justify-between items-center hover:cursor-pointer">
                        {userProfile?.avatar && (
                            <img
                                className="rounded-full mr-1 w-10 h-10"
                                src={userProfile?.avatar}
                                alt={userProfile?.name}
                            />
                        )}
                    </div>
                </Tippy>
            ) : (
                <Link
                    className="w-24 flex items-center justify-center text-primary text-lg duration-300 hover:text-secondary"
                    href={MAIN_ROUTE.LOGIN}
                >
                    Đăng nhập
                </Link>
            )}
        </div>
    );
}
