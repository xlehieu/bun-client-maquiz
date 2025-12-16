'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as AuthService from '@/api/auth.service';
import Link from 'next/link';
import { DashboardOutlined, IdcardOutlined, LogoutOutlined } from '@ant-design/icons';
import { resetUser } from '@/redux/slices/user.slice';
import siteRouter, { userDashboardRouter } from '@/config';
import Tippy from '@tippyjs/react/headless';
import MaquizLogoImage from '@/components/UI/MaquizLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import BlurBackground from '@/components/UI/BlurBackground';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from '@/components/UI/LazyImage';
import { useRouter } from 'next/navigation';
import LoadingIcon from '@/components/UI/LoadingIcon';
import { useAppSelector } from '@/redux/hooks';

const menuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
};
const headerTippyMenu = [
    {
        label: 'Thông tin tài khoản',
        icon: <IdcardOutlined className="pr-2" />,
        route: siteRouter.profile,
    },
    {
        icon: <DashboardOutlined className="pr-2" />,
        label: 'Dashboard',
        route: userDashboardRouter.myDashboard,
    },
    {
        icon: <LogoutOutlined className="pr-2" />,
        label: 'Đăng xuất',
        type: 'logout',
    },
];
const HeaderComponent = () => {
    const router = useRouter();
    const {userProfile} = useAppSelector(state=>state.user)
    const [loading, setLoading] = useState({
        isLoading: false,
        index: -1,
    });
    const dispatch = useDispatch();
    const handleLogOut = async () => {
        await AuthService.logout();
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
            await AuthService.logout();
            dispatch(resetUser());
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
                    <Link className="w-2/4 block" href={siteRouter.home}>
                        <MaquizLogoImage
                            className="w-full scale-110 hover:scale-150 transition-all duration-300"
                            alt="logo"
                        />
                    </Link>
                </div>
                <nav className="hidden md:flex items-center justify-end gap-12">
                    <Link
                        className=" hover:scale-115 hover:rotate-2 flex items-center justify-center text-primary text-lg  duration-300 hover:text-camdat"
                        href={siteRouter.news}
                    >
                        Tin tức
                    </Link>
                    <Link
                        className=" hover:scale-115 hover:rotate-2 flex items-center justify-center text-primary text-lg  duration-300 hover:text-camdat"
                        href={siteRouter.contact}
                    >
                        Liên hệ
                    </Link>
                    {userProfile?.email ? ( // Menu tippy
                        <Tippy
                            interactive
                            placement="bottom-end"
                            render={(attrs) => (
                                <div className="flex flex-col shadow bg-white" tabIndex={-1} {...attrs}>
                                    {/* <Link
                                        className="text-black px-2 py-2 hover:rounded hover:bg-black/5"
                                        href={siteRouter.profile}
                                    >
                                        <IdcardOutlined className="pr-2" />
                                        Thông tin tài khoản
                                        <LoadingComponent />
                                    </Link>
                                    <Link
                                        href={userProfileDashboardRouter.myDashboard}
                                        className="text-black px-2 py-2 hover:rounded hover:bg-black/5"
                                    >
                                        <DashboardOutlined className="pr-2" />
                                        Dashboard
                                    </Link>
                                    <button
                                        className="text-start px-2 py-2 text-black hover:rounded hover:bg-black/5"
                                        onClick={handleLogOut}
                                    >
                                        <LogoutOutlined className="pr-2" />
                                        Đăng xuất
                                    </button> */}
                                    <React.Fragment>
                                        {headerTippyMenu.map((item, index) => (
                                            <button
                                                key={index}
                                                className="text-start px-2 py-2 text-black hover:rounded hover:bg-black/5 transition-all duration-100 ease-in-out"
                                                onClick={() => handleClick(item, index)}
                                            >
                                                <div className="flex items-center">
                                                    {item.icon}
                                                    {item.label}
                                                    {loading.index === index && loading.isLoading && (
                                                        <LoadingIcon width={16} height={16} className="ml-2" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </React.Fragment>
                                </div>
                            )}
                        >
                            <div className="flex justify-between items-center">
                                {userProfile?.avatar && (
                                    <LazyImage
                                        className="rounded-full mr-1 w-8 h-8 overflow-hidden"
                                        src={userProfile?.avatar}
                                        alt={userProfile?.name}
                                        placeholder={'...'}
                                    />
                                )}
                                <p className="text-lg text-primary">{userProfile?.name}</p>
                            </div>
                        </Tippy>
                    ) : (
                        <Link
                            className=" flex items-center justify-center text-primary text-lg hover:scale-115 hover:rotate-2 duration-300 hover:text-camdat"
                            href={siteRouter.signIn}
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
                                            href={siteRouter.profile}
                                        >
                                            Thông tin tài khoản
                                        </Link>
                                        <Link
                                            href={userDashboardRouter.myDashboard}
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
                                        href={siteRouter.signIn}
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
