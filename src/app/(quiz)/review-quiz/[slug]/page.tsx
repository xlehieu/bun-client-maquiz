'use client';
<<<<<<< HEAD
=======
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import HTMLReactParser from 'html-react-parser';
import * as QuizService from '@/services/quiz.service';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import GeneralInformation from './GeneralInformation';
import { questionTypeContent } from '@/common/constants';
import LoadingComponent from '@/components/UI/LoadingComponent';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
>>>>>>> bceb0fcdd663ce52a321aa0984bce5e25540178d
import QuizPreviewQuestion from '@/components/Quiz/QuizPreviewQuestion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spin } from 'antd';
import { useParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import GeneralInformation from './GeneralInformation';
import LoadingComponent from '@/components/UI/LoadingComponent';
import { fetchQuizPreview } from '@/redux/slices/takeQuiz';
const ReviewQuizPage = () => {
    const dispatch = useAppDispatch();
    const { isFetching, currentQuizDetail } = useAppSelector((state) => state.takeQuiz);
    const params = useParams();
    const slug = params?.slug as string;
<<<<<<< HEAD
    useEffect(() => {
        if (slug) dispatch(fetchQuizPreview(slug));
    }, [slug]);
=======

    const path = usePathname();
    const queryQuizDetail = useQuery({
        queryKey: ['QueryQuizPreviewBySlug', slug],
        queryFn: () => QuizService.getQuizPreviewBySlug(slug),
    });
>>>>>>> bceb0fcdd663ce52a321aa0984bce5e25540178d
    const [currentTabIndex, setCurrentTabIndex] = useState(1);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    useEffect(() => {
        document.title = currentQuizDetail?.name || 'Maquiz';
    }, [currentQuizDetail?._id]);
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
                {currentQuizDetail?.quiz && (
                    <>
                        <div className="flex gap-5  pb-4 w-full no-vertical-scroll maquiz-scroll">
                            {currentQuizDetail?.quiz.map((part: any, index: number) => (
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
                        <QuizPreviewQuestion quizDetail={currentQuizDetail} currentPartIndex={currentPartIndex} />
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
                <GeneralInformation quizDetail={currentQuizDetail} />
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
