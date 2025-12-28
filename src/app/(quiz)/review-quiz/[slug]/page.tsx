'use client';
import QuizPreviewQuestion from '@/components/Quiz/QuizPreviewQuestion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spin } from 'antd';
import { useParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import GeneralInformation from './GeneralInformation';
import LoadingComponent from '@/components/UI/LoadingComponent';
import { fetchQuizPreview, shuffleQuiz } from '@/redux/slices/takeQuiz.slice';
const ReviewQuizPage = () => {
    const dispatch = useAppDispatch();
    const { isFetching, currentQuizPreviewDetail } = useAppSelector((state) => state.takeQuiz);
    const params = useParams();
    const slug = params?.slug as string;
    useEffect(() => {
        if (slug) dispatch(fetchQuizPreview(slug));
    }, [slug]);
    const [currentTabIndex, setCurrentTabIndex] = useState(1);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    useEffect(() => {
        document.title = currentQuizPreviewDetail?.name || 'Maquiz';
    }, [currentQuizPreviewDetail?._id]);
    const tabButtons = [
        {
            key: 1,
            label: 'Nội dung đề thi',
            icon: faBookOpen,
        },
    ];
    const tabs: Record<number, ReactNode> = {
        1: (
            <>
                {currentQuizPreviewDetail?.quiz && (
                    <>
                        <div className="flex gap-5  pb-4 w-full no-vertical-scroll maquiz-scroll">
                            {currentQuizPreviewDetail?.quiz.map((part: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPartIndex(index)}
                                    className={`rounded-3xl px-4 py-2 whitespace-nowrap ${
                                        currentPartIndex == index
                                            ? 'bg-primary border-primary text-white'
                                            : 'border-gray-600 text-gray-600'
                                    }`}
                                >
                                    {part?.partName}
                                </button>
                            ))}
                        </div>
                        <QuizPreviewQuestion
                            quizDetail={currentQuizPreviewDetail}
                            currentPartIndex={currentPartIndex}
                        />
                    </>
                )}
            </>
        ),
        // 2: <div>Hello2</div>,
    };
    return (
        <div className="w-full">
            {/* <Spin spinning={isFetching}></Spin> */}
            <LoadingComponent isLoading={isFetching}>
                <GeneralInformation quizDetail={currentQuizPreviewDetail} />
                <div className="px-2 py-2 mt-5 rounded shadow-md border bg-white">
                    <div className="flex gap-3 flex-wrap">
                        {tabButtons.map((tabButton) => (
                            <button
                                key={tabButton.key}
                                className={`${
                                    currentTabIndex === tabButton.key
                                        ? 'border-b-4 border-b-primary text-primary cursor-default'
                                        : 'hover:opacity-50 cursor-pointer border-b-4 border-b-white'
                                } flex flex-wrap tabButtons-center text-lg pb-2 px-1 transition-all duration-200 ease-linear text-gray-500 items-center`}
                                onClick={() => setCurrentTabIndex(tabButton.key)}
                            >
                                <FontAwesomeIcon className="block" icon={tabButton.icon} />
                                <p className="pl-2">{tabButton.label}</p>
                            </button>
                        ))}
                    </div>
                    <div className="mt-6">{tabs[currentTabIndex]}</div>
                </div>
            </LoadingComponent>
        </div>
    );
};

export default ReviewQuizPage;
