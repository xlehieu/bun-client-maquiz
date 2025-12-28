'use client';
import React from 'react';
import Link from 'next/link';
import MAIN_ROUTE from '@/config/routes';

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-10 relative z-10">
            <div className="max-w-screen-xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Column 1 */}
                    <div>
                        <h4 className="text-2xl font-bold mb-4">Về chúng tôi</h4>
                        <p className="text-gray-200">
                            Hệ thống quản lý đề thi trắc nghiệm hiện đại, giúp bạn tạo và quản lý các bài thi trắc
                            nghiệm dễ dàng.
                        </p>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h4 className="text-2xl font-bold mb-4">Liên kết nhanh</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href={MAIN_ROUTE.HOME} className="text-white hover:text-link">
                                    Trang chủ
                                </Link>
                            </li>
                            {/* <li>
                                <Link href={siteRouter.contact} className="text-white hover:text-link">
                                    Giới thiệu
                                </Link>
                            </li> */}
                            <li>
                                <Link href={MAIN_ROUTE.CONTACT} className="text-white hover:text-link">
                                    Liên hệ
                                </Link>
                            </li>
                            {/* <li>
                                <a href="#" className="text-white hover:text-link">
                                    Điều khoản sử dụng
                                </a>
                            </li> */}
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h4 className="text-2xl font-bold mb-4">Liên hệ</h4>
                        <p className="text-gray-200">Địa chỉ: Xuân Canh, Đông Anh, Hà Nội</p>
                        <p className="text-gray-200">Email: xlehieu@gmail.com</p>
                        <p className="text-gray-200">Số điện thoại: 0355055556</p>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-600 pt-6">
                    <p className="text-center text-gray-200">
                        &copy; {new Date().getFullYear()} Hệ thống quản lý đề thi trắc nghiệm MAQUIZ.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
