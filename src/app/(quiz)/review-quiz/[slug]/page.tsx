'use client';
import QuizPreviewQuestion from '@/components/Quiz/QuizPreviewQuestion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spin } from 'antd';
import { useParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import GeneralInformation from '../../../../features/reviewQuiz/components/GeneralInformation';
import LoadingComponent from '@/components/UI/LoadingComponent';
import { fetchTakeQuiz, shuffleQuiz } from '@/redux/slices/takeQuiz.slice';
const ReviewQuizPage = () => {
    const dispatch = useAppDispatch();
    const { isFetching, currentQuizTakeDetail: currentQuizPreviewDetail } = useAppSelector((state) => state.takeQuiz);
    const params = useParams();
    const slug = params?.slug as string;
    useEffect(() => {
        if (slug) dispatch(fetchTakeQuiz(slug));
    }, [slug]);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    useEffect(() => {
        document.title = currentQuizPreviewDetail?.name || 'Maquiz';
    }, [currentQuizPreviewDetail?._id]);
    return (
        <div className="w-full">
            {/* <Spin spinning={isFetching}></Spin> */}
            <Spin spinning={isFetching}>
                <GeneralInformation quizDetail={currentQuizPreviewDetail} />
                {currentQuizPreviewDetail?.quiz && (
                    <section className="">
                        {/* Container cho các Part - Style Glassmorphism nhẹ */}
                        <div className="flex gap-4 pb-4 w-full overflow-x-auto maquiz-scroll pt-2 px-1 mt-5">
                            {currentQuizPreviewDetail?.quiz.map((part: any, index: number) => {
                                const isActive = currentPartIndex === index;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPartIndex(index)}
                                        className={`
                            relative px-6 py-2.5 rounded-2xl font-semibold transition-all duration-300
                            whitespace-nowrap flex items-center gap-2
                            ${
                                isActive
                                    ? 'bg-white text-primary shadow-[0_10px_10px_rgba(59,130,246,0.15)] scale-105 border border-blue-100'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent'
                            }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                isActive ? 'bg-primary animate-pulse' : 'bg-gray-300'
                                            }`}
                                        />

                                        <span className="text-sm uppercase tracking-wide">
                                            {part?.partName || `Phần ${index + 1}`}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {/* Nội dung câu hỏi với hiệu ứng trượt nhẹ */}
                        <QuizPreviewQuestion
                            quizDetail={currentQuizPreviewDetail}
                            currentPartIndex={currentPartIndex}
                        />
                    </section>
                )}
            </Spin>
        </div>
    );
};

export default ReviewQuizPage;
