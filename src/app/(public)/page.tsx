'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Aos from 'aos';
import 'aos/dist/aos.css';
import MAIN_ROUTE, { USER_DASHBOARD_ROUTER } from '@/config/routes';
import searchIcon from '@/asset/image/search.png';
import knowledgeIcon from '@/asset/image/knowledge.png';
import quizIcon from '@/asset/image/qna.png';
import classroomIcon from '@/asset/image/classroom.png';
import newsIcon from '@/asset/image/megaphone.png';

export default function HomePage() {
    const router = useRouter();
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <>
            {/* <img src={bgImg.src} className="absolute w-full left-0 opacity-30" /> */}
            <div className="absolute w-full left-0 opacity-20 h-full">
                <video autoPlay muted loop className="w-full">
                    <source src="/videos/video-home-page-1.mp4" type="video/mp4" />
                </video>
                <video autoPlay muted loop className="w-full">
                    <source src="/videos/video-home-page-2.mp4" type="video/mp4" />
                </video>
            </div>
            <section className="flex flex-col md:flex-row justify-center items-center py-20 z-10 relative">
                <div className="w-full md:w-2/5 text-center">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary  via-[#cc2b5e] to-[#F9D423] bg-clip-text text-transparent animate-animate-gradient bg-[length:400%] leading-tight mb-6">
                        Hệ thống quản lý đề thi trắc nghiệm MAQUIZ
                    </h2>
                    <p className="text-lg text-gray-600 mb-10">
                        Tạo, quản lý và thi trắc nghiệm dễ dàng chỉ với vài cú click chuột.
                    </p>
                    <div className="text-xl animate-blink-blink-gradient bg-gradient-to-r from-primary  via-[#cc2b5e] to-[#F9D423] bg-clip-text text-transparent bg-[length:400%] mb-10 md:mb-2">
                        Ôn thi tuyệt lắm ai ơi
                        <br />
                        MAQUIZ đã có, tuy chơi mà học
                    </div>
                </div>
                <div className="w-full md:w-3/5 flex flex-col gap-14 justify-center items-center">
                    <div className="grid grid-cols-2 w-full">
                        <div className="flex justify-center">
                            <button
                                onClick={() => router.push(MAIN_ROUTE.DISCOVER_QUIZ)}
                                className="bg-primary relative -rotate-3 text-white px-10 py-3 border border-black rounded-full text-lg hover:bg-primary-bold transition hover:scale-105 hover:shadow-xl duration-150"
                            >
                                Khám phá ngay
                                <img src={searchIcon.src} className="absolute left-2 -top-7 w-10 h-10" />
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button className="bg-primary relative rotate-3 text-white px-10 py-3  border border-black  rounded-full text-lg hover:bg-primary-bold transition hover:scale-105 hover:shadow-xl duration-150">
                                Tìm hiểu thêm
                                <img src={knowledgeIcon.src} className="absolute -right-2 -bottom-4 w-10 h-10" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 w-full">
                        <div className="flex justify-center">
                            <button
                                onClick={() => router.push(MAIN_ROUTE.CREATE_QUIZ)}
                                className="bg-primary relative rotate-6 text-white px-10 py-3 border border-black rounded-full text-lg hover:bg-primary-bold transition hover:scale-105 hover:shadow-xl duration-150"
                            >
                                Tạo đề thi
                                <img src={quizIcon.src} className="absolute right-0 -top-7 w-10 h-10" />
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => router.push(USER_DASHBOARD_ROUTER.CLASSROOM)}
                                className="bg-primary -rotate-1 text-white px-10 py-3  border border-black  rounded-full text-lg hover:bg-primary-bold transition hover:scale-105 hover:shadow-xl duration-150"
                            >
                                Lớp học
                                <img src={classroomIcon.src} className="absolute -left-2 top-0 w-10 h-10" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 w-full">
                        <div className="flex justify-center">
                            <button
                                onClick={() => router.push(MAIN_ROUTE.NEWS)}
                                className="bg-primary rotate-1 relative text-white px-10 py-3 border border-black rounded-full text-lg hover:bg-primary-bold transition hover:scale-105 hover:shadow-xl duration-150"
                            >
                                Xem tin
                                <img src={newsIcon.src} className="absolute -bottom-3 left-0 w-10 h-10" />
                            </button>
                        </div>
                        <div className="flex justify-center"></div>
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 z-10 relative">
                <div data-aos="fade-up-right" className="bg-white p-6 rounded-2xl shadow-md text-center">
                    <h3 className="text-xl font-bold text-primary-bold mb-2">Tạo đề nhanh chóng</h3>
                    <p className="text-gray-600">
                        Chỉ cần vài bước đơn giản là bạn đã có thể tạo đề thi trắc nghiệm của riêng mình.
                    </p>
                </div>
                <div data-aos="fade-up" className="bg-white p-6 rounded-2xl shadow-md text-center">
                    <h3 className="text-xl font-bold text-primary-bold mb-2">Quản lý lớp học</h3>
                    <p className="text-gray-600">Tạo và quản lý lớp học dễ dàng, mời học sinh tham gia với mã lớp.</p>
                </div>
                <div data-aos="fade-up-left" className="bg-white p-6 rounded-2xl shadow-md text-center">
                    <h3 className="text-xl font-bold text-primary-bold mb-2">Báo cáo kết quả</h3>
                    <p className="text-gray-600">Xem kết quả làm bài chi tiết.</p>
                </div>
            </section>
            <section className="text-center mt-24 z-10 relative">
                <div data-aos="zoom-in" className="bg-white p-6 rounded-2xl shadow-md text-center">
                    <h3 className="text-xl font-bold text-primary-bold mb-2">Tạo đề nhanh chóng</h3>
                    <p className="text-gray-600">
                        Chỉ cần vài bước đơn giản là bạn đã có thể tạo đề thi trắc nghiệm của riêng mình.
                    </p>
                </div>
            </section>
        </>
    );
}
