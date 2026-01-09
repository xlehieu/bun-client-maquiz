'use client';
import BlurBackground from '@/components/UI/BlurBackground';
import UserDropdown from '@/components/UI/Dropdowns/UserDropdown';
import MaquizLogoImage from '@/components/UI/MaquizLogo';
import MAIN_ROUTE, { USER_DASHBOARD_ROUTER } from '@/config/routes';
import { useAppSelector } from '@/redux/hooks';
import { resetUser } from '@/redux/slices/user.slice';
import { persistor } from '@/redux/store';
import {
    faBars,
    faClose,
    faNewspaper,
    faEnvelope,
    faUser,
    faSignOutAlt,
    faChartPie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' },
};

const HeaderComponent = () => {
    const router = useRouter();
    const { userProfile } = useAppSelector((state) => state.user);
    const dispatch = useDispatch();
    const [isMobileResponsive, setIsMobileResponsive] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Xử lý hiệu ứng khi cuộn trang
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogOut = async () => {
        persistor.purge();
        dispatch(resetUser());
        setIsMobileResponsive(false);
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full transition-all duration-300 z-[1000] border-b 
            ${
                scrolled
                    ? 'bg-white/80 backdrop-blur-md py-2 border-slate-100 shadow-sm'
                    : 'bg-transparent py-4 border-transparent'
            }`}
        >
            <div className="container mx-auto flex justify-between items-center px-6">
                {/* LOGO */}
                <div className="flex-shrink-0">
                    <Link href={MAIN_ROUTE.HOME} className="block transition-transform hover:scale-105 active:scale-95">
                        <MaquizLogoImage
                            className="h-10 w-auto" // Cố định chiều cao logo để tránh vỡ layout
                            alt="logo"
                        />
                    </Link>
                </div>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex items-center gap-10">
                    {[
                        { label: 'Tin tức', href: MAIN_ROUTE.NEWS },
                        { label: 'Liên hệ', href: MAIN_ROUTE.CONTACT },
                    ].map((link) => (
                        <Link
                            key={link.label}
                            className="relative text-slate-600 font-bold hover:text-primary transition-colors group"
                            href={link.href}
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}

                    <div className="h-6 w-[1px] bg-slate-200 mx-2" />

                    {userProfile?.email ? (
                        <UserDropdown />
                    ) : (
                        <Link
                            className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                            href={MAIN_ROUTE.LOGIN}
                        >
                            Đăng nhập
                        </Link>
                    )}
                </nav>

                {/* MOBILE BURGER */}
                <div className="md:hidden">
                    <button
                        className={`p-2 rounded-xl transition-colors ${
                            isMobileResponsive ? 'bg-slate-100 text-rose-500' : 'text-slate-700'
                        }`}
                        onClick={() => setIsMobileResponsive(!isMobileResponsive)}
                    >
                        <FontAwesomeIcon icon={isMobileResponsive ? faClose : faBars} className="text-xl" />
                    </button>
                </div>

                {/* MOBILE MENU SIDEBAR */}
                <AnimatePresence>
                    {isMobileResponsive && (
                        <>
                            <motion.nav
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={menuVariants}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl z-[1001] flex flex-col p-8"
                            >
                                <div className="mb-10 flex justify-between items-center">
                                    <MaquizLogoImage className="h-8" alt="logo" />
                                    <button onClick={() => setIsMobileResponsive(false)} className="text-slate-400">
                                        <FontAwesomeIcon icon={faClose} />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <MobileNavLink
                                        href={MAIN_ROUTE.NEWS}
                                        icon={faNewspaper}
                                        label="Tin tức"
                                        onClick={() => setIsMobileResponsive(false)}
                                    />
                                    <MobileNavLink
                                        href={MAIN_ROUTE.CONTACT}
                                        icon={faEnvelope}
                                        label="Liên hệ"
                                        onClick={() => setIsMobileResponsive(false)}
                                    />

                                    <div className="h-[1px] bg-slate-100 my-4" />

                                    {userProfile?.email ? (
                                        <>
                                            <MobileNavLink
                                                href={MAIN_ROUTE.PROFILE}
                                                icon={faUser}
                                                label="Tài khoản"
                                                onClick={() => setIsMobileResponsive(false)}
                                            />
                                            <MobileNavLink
                                                href={USER_DASHBOARD_ROUTER.MY_DASHBOARD}
                                                icon={faChartPie}
                                                label="Dashboard"
                                                onClick={() => setIsMobileResponsive(false)}
                                            />
                                            <button
                                                onClick={handleLogOut}
                                                className="flex items-center gap-4 p-4 rounded-2xl text-rose-500 font-bold hover:bg-rose-50 transition-all"
                                            >
                                                <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href={MAIN_ROUTE.LOGIN}
                                            onClick={() => setIsMobileResponsive(false)}
                                            className="bg-primary text-white p-4 rounded-2xl font-bold text-center shadow-lg shadow-blue-100"
                                        >
                                            Đăng nhập ngay
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-auto text-center text-slate-400 text-xs font-medium">
                                    Maquiz v2.0 • 2024
                                </div>
                            </motion.nav>

                            <BlurBackground
                                isActive={isMobileResponsive}
                                onClick={() => setIsMobileResponsive(false)}
                            />
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

// Helper component cho Mobile Link
const MobileNavLink = ({ href, icon, label, onClick }: any) => (
    <Link
        href={href}
        onClick={onClick}
        className="flex items-center gap-4 p-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 hover:text-primary transition-all"
    >
        <div className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-primary">
            <FontAwesomeIcon icon={icon} />
        </div>
        {label}
    </Link>
);

export default HeaderComponent;
