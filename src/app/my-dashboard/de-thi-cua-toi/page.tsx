'use client';
import { PAGE_SIZE } from '@/common/constants';
import QuizCard from '@/components/Quiz/QuizCard/QuizCard';
import MAIN_ROUTE from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMyListQuiz } from '@/redux/slices/quiz.slice';
import { QuizDetailRecord } from '@/types/quiz.type';
import { faPlus, faInbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { createContext, useLayoutEffect } from 'react';

const QuizzesContext = createContext<any>({});

const MyQuizPageMain = () => {
    const router = useRouter();
    const { listMyQuiz, isFetching, pagination } = useAppSelector((state) => state.quiz);
    const dispatch = useAppDispatch();

    useLayoutEffect(() => {
        if (listMyQuiz.length <= 0) {
            dispatch(fetchMyListQuiz());
        }
        if (typeof window !== 'undefined')
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
    }, []);

    const onChangePageSize = (pageNumber: number, pageSize: number) => {
        dispatch(
            fetchMyListQuiz({
                skip: (pageNumber - 1) * pageSize,
                limit: pageSize,
            }),
        );
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-10 px-4 sm:px-6">
            {/* Header Page */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Quản lý đề thi</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Nơi lưu trữ và quản lý các nội dung ôn tập của bạn
                    </p>
                </div>

                <button
                    onClick={() => router.push(MAIN_ROUTE.CREATE_QUIZ)}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 group"
                >
                    <FontAwesomeIcon
                        icon={faPlus}
                        className="group-hover:rotate-90 transition-transform duration-300"
                    />
                    <span>Tạo đề thi mới</span>
                </button>
            </div>

            <section className="bg-white rounded-[32px] p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 min-h-[600px] flex flex-col">
                <Spin spinning={isFetching} tip="Đang tải dữ liệu...">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 px-2">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-black text-primary">{pagination.total || 0}</span>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">
                                Đề thi hiện có
                            </span>
                        </div>
                    </div>

                    {pagination.total !== 0 ? (
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
                            {listMyQuiz.map((quiz: QuizDetailRecord, index: number) => (
                                <div
                                    key={quiz?._id || index}
                                    className="w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <QuizCard quizDetail={quiz} allowEdit />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faInbox} className="text-3xl" />
                            </div>
                            <p className="text-lg font-medium">Chưa có đề thi nào được tạo</p>
                            <button
                                onClick={() => router.push(MAIN_ROUTE.CREATE_QUIZ)}
                                className="mt-4 text-primary font-bold hover:underline"
                            >
                                Bắt đầu tạo ngay 🚀
                            </button>
                        </div>
                    )}
                </Spin>

                {/* Pagination Section */}
                {pagination.total > 0 && (
                    <div className="mt-auto pt-10 flex justify-center sm:justify-end">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <Pagination
                                onChange={onChangePageSize}
                                showSizeChanger
                                defaultCurrent={1}
                                pageSizeOptions={[8, 12, 16, 20, 40, 80, 100]}
                                defaultPageSize={PAGE_SIZE}
                                total={pagination.total || 0}
                                className="custom-pagination"
                            />
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyQuizPageMain;
