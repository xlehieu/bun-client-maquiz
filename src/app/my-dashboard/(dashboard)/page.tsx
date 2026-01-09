'use client';
import React, { useEffect } from 'react';
import QuizCard from '@/features/quiz/components/QuizCard';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchExamHistory } from '@/redux/slices/user.slice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHistory, faStar, faCalendarAlt, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Spin, Empty, Tag } from 'antd';
import LazyImage from '@/components/UI/LazyImage';

const MyLibrary = () => {
    const dispatch = useAppDispatch();
    const { userProfile, isFetchingExamHistory, examHistory } = useAppSelector((state) => state.user);

    useEffect(() => {
        document.title = 'Thư viện của tôi | Maquiz';
        dispatch(fetchExamHistory());
    }, [dispatch]);

    const renderHeader = (title: string, icon: any, colorClass: string) => (
        <div className="flex items-center gap-4 mb-6">
            <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-${colorClass}/20 bg-white border border-slate-50`}
            >
                <FontAwesomeIcon icon={icon} className={`text-xl text-pink-400 text-${colorClass}`} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-100 to-transparent ml-4" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20 animate-in fade-in duration-700 px-6">
            <div className="max-w-[1440px] m-auto pt-10">
                {/* SECTION: ĐỀ THI YÊU THÍCH */}
                <section className="mb-16">
                    {renderHeader('Đề thi yêu thích', faHeart, 'pink-400')}

                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
                        {userProfile?.favoriteQuiz && userProfile.favoriteQuiz.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-6">
                                {userProfile.favoriteQuiz.map((quiz, index) => (
                                    <div
                                        key={index}
                                        className="animate-in zoom-in-95 duration-500"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <QuizCard quizDetail={quiz as any} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Empty description="Bạn chưa có đề thi yêu thích nào" />
                        )}
                    </div>
                </section>

                {/* SECTION: LỊCH SỬ LÀM BÀI */}
                <section>
                    {renderHeader('Lịch sử làm bài', faHistory, 'primary')}

                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <Spin spinning={isFetchingExamHistory}>
                            {examHistory && examHistory.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {examHistory.map((exam: any, index: number) => (
                                        <div
                                            key={index}
                                            className="group flex items-center bg-slate-50/50 hover:bg-white p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-lg transition-all duration-300"
                                        >
                                            {/* Thumbnail bài thi */}
                                            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                                <LazyImage
                                                    src={exam?.quiz?.thumb}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Thông tin bài thi */}
                                            <div className="ml-5 flex-1 flex flex-col gap-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-slate-800 text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                                        {exam?.quiz?.name}
                                                    </h3>
                                                    <Tag
                                                        color={exam.score >= 8 ? 'green' : 'orange'}
                                                        className="mr-0 rounded-full font-bold border-none px-3"
                                                    >
                                                        {exam.score >= 8 ? 'Xuất sắc' : 'Hoàn thành'}
                                                    </Tag>
                                                </div>

                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                        <FontAwesomeIcon
                                                            icon={faTrophy}
                                                            className="text-amber-400 text-xs"
                                                        />
                                                        <span className="text-sm font-bold">Điểm số:</span>
                                                        <span className="text-xl font-black text-red-500">
                                                            {exam.score}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-400 border-l pl-4">
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                                                        <span className="text-xs font-medium">
                                                            {new Date(exam.createdAt).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Empty description="Bạn chưa thực hiện bài thi nào" />
                            )}
                        </Spin>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MyLibrary;
