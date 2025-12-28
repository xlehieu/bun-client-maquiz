'use client';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BlurBackground from '@/components/UI/BlurBackground';
import MAIN_ROUTE from '@/config/routes';
import { motion, AnimatePresence } from 'framer-motion';
import MaquizLogo from '@/components/UI/MaquizLogo';

const menuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
};

function SignInUpLayout({ children, title }: any) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    useEffect(() => {
        document.title = title || 'Maquiz';
    }, []);
    return (
        <div className="relative md:px-0 min-h-screen">
            <div className="border-b-2">
                <header className="container mx-auto w-full flex items-center justify-between bg-white px-5 py-4">
                    <div className="block">
                        <Link href={MAIN_ROUTE.HOME}>
                            <MaquizLogo className="w-2/4" alt="logo" />
                        </Link>
                    </div>
                    <div className="flex-wrap text-4xl hidden md:flex">{title}</div>
                    <div className="md:hidden z-40 flex items-center">
                        <button className="px-2 py-2" onClick={toggleMobileMenu}>
                            <FontAwesomeIcon className="text-2xl" icon={isMobileMenuOpen ? faClose : faBars} />
                        </button>
                    </div>
                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <>
                                <BlurBackground onClick={toggleMobileMenu} isActive={isMobileMenuOpen} />
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
                                        href={MAIN_ROUTE.HOME}
                                        className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                    >
                                        Trang chủ
                                    </Link>
                                </motion.nav>
                            </>
                        )}
                    </AnimatePresence>
                </header>
            </div>

            <div className="flex content-center justify-center mt-16 px-2">{children}</div>
        </div>
    );
}

export default SignInUpLayout;
