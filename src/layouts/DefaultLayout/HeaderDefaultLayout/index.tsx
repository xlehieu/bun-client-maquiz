'use client';
import BlurBackground from '@/components/UI/BlurBackground';
import UserDropdown from '@/components/UI/Dropdowns/UserDropdown';
import LazyImage from '@/components/UI/LazyImage';
import LoadingIcon from '@/components/UI/LoadingIcon';
import MaquizLogoImage from '@/components/UI/MaquizLogo';
import MAIN_ROUTE, { userDashboardRouter } from '@/config/routes';
import { useAppSelector } from '@/redux/hooks';
import { resetUser } from '@/redux/slices/user.slice';
import { persistor } from '@/redux/store';
import { DashboardOutlined, IdcardOutlined, LogoutOutlined } from '@ant-design/icons';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const menuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
};
const headerTippyMenu = [
    {
        label: 'Thông tin tài khoản',
        icon: <IdcardOutlined className="pr-2" />,
        route: MAIN_ROUTE.PROFILE,
    },
    {
        icon: <DashboardOutlined className="pr-2" />,
        label: 'Dashboard',
        route: userDashboardRouter.MY_DASHBOARD,
    },
    {
        icon: <LogoutOutlined className="pr-2" />,
        label: 'Đăng xuất',
        type: 'logout',
    },
];
const HeaderComponent = () => {
    const router = useRouter();
    const { userProfile } = useAppSelector((state) => state.user);
    const [loading, setLoading] = useState({
        isLoading: false,
        index: -1,
    });
    const dispatch = useDispatch();
    const handleLogOut = async () => {
        persistor.purge();
        dispatch(resetUser());
    };
    const handleClick = async (item: any, index: number) => {
        setLoading({
            isLoading: true,
            index,
        });
        if (!item.type && item.route) {
            router.push(item.route);
        } else {
            handleLogOut();
        }
    };
    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading({
    //             isLoading: false,
    //             index: -1,
    //         });
    //     }, 10000);
    // }, [loading]);
    const [isMobileResponsive, setIsMobileResponsive] = useState(false);
    return (
        <header className="w-full border-b-2 bg-transparent relative z-999">
            <div className={'container mx-auto flex justify-between items-centers px-5 py-4'}>
                <div className="block">
                    <Link className="w-2/4 block" href={MAIN_ROUTE.HOME}>
                        <MaquizLogoImage
                            className="w-full scale-110 hover:scale-150 transition-all duration-300"
                            alt="logo"
                        />
                    </Link>
                </div>
                <nav className="hidden md:flex items-center justify-end gap-12">
                    <Link
                        className=" hover:scale-115 hover:rotate-2 flex items-center justify-center text-primary text-lg  duration-300 hover:text-camdat"
                        href={MAIN_ROUTE.NEWS}
                    >
                        Tin tức
                    </Link>
                    <Link
                        className=" hover:scale-115 hover:rotate-2 flex items-center justify-center text-primary text-lg  duration-300 hover:text-camdat"
                        href={MAIN_ROUTE.CONTACT}
                    >
                        Liên hệ
                    </Link>
                    {userProfile?.email ? ( // Menu tippy
                        <UserDropdown />
                    ) : (
                        <Link
                            className=" flex items-center justify-center text-primary text-lg hover:scale-115 hover:rotate-2 duration-300 hover:text-camdat"
                            href={MAIN_ROUTE.LOGIN}
                        >
                            Đăng nhập
                        </Link>
                    )}
                </nav>
                <div className="md:hidden z-40 flex items-center">
                    <button className="px-2 py-2" onClick={() => setIsMobileResponsive(!isMobileResponsive)}>
                        <FontAwesomeIcon className="text-2xl" icon={isMobileResponsive ? faClose : faBars} />
                    </button>
                </div>
                <AnimatePresence>
                    {isMobileResponsive && (
                        <>
                            <motion.nav
                                key="mobile-menu"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={menuVariants}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="absolute z-30 py-10 h-full bg-white shadow-lg min-w-72 max-w-full right-0 top-0 flex flex-col text-3xl space-y-5 items-start"
                            >
                                <Link
                                    className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                    href={'/'}
                                >
                                    Tin tức
                                </Link>
                                <Link
                                    className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                    href={'/'}
                                >
                                    Liên hệ
                                </Link>
                                {userProfile?.email ? (
                                    <>
                                        <Link
                                            className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                            href={MAIN_ROUTE.PROFILE}
                                        >
                                            Thông tin tài khoản
                                        </Link>
                                        <Link
                                            href={userDashboardRouter.MY_DASHBOARD}
                                            className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            className="mt-10 w-full px-6 py-3 text-gray-600 text-left font-semibold border-b-2 transition-all duration-300"
                                            onClick={handleLogOut}
                                        >
                                            Đăng xuất
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href={MAIN_ROUTE.LOGIN}
                                        className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                    >
                                        Đăng nhập
                                    </Link>
                                )}
                            </motion.nav>
                            <BlurBackground
                                isActive={isMobileResponsive}
                                onClick={() => setIsMobileResponsive(!isMobileResponsive)}
                            />
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default HeaderComponent;
