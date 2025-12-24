'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'next/navigation';
import * as QuizService from '@/api/quiz.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { questionTypeContent } from '@/common/constants';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchQuizDetail } from '@/redux/slices/quiz.slice';
const QuizDetailPage = () => {
    const params = useParams();
    const id = params?.id;
    const dispatch = useAppDispatch();
    const { quizDetail } = useAppSelector((state) => state.quiz);
    const [currentKey, setCurrentKey] = useState(1); // key của tabs
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const tabs = [
        {
            key: 1,
            label: 'Thông tin chung',
            icon: faClipboard,
        },
        {
            key: 2,
            label: 'Các câu hỏi',
            icon: faQuestionCircle,
        },
    ];
    useEffect(() => {
        if (id && !Array.isArray(id)) {
            dispatch(fetchQuizDetail(id));
        }
    }, [id]);
    const handleChangePartIndex = (index: number) => {
        setCurrentPartIndex(index);
        if (quizDetail?.quiz[index]) {
            setCurrentPartIndex(index);
            setCurrentQuestionIndex(0);
        }
    };
    const handleChangeQuestionIndex = (index: number) => {
        setCurrentQuestionIndex(index);
        if (quizDetail) {
            if (quizDetail?.quiz?.[currentPartIndex]?.questions?.[index]) {
                setCurrentQuestionIndex(index);
            }
        }
    };
    const tabItems: Record<number, ReactNode> = {
        1: (
            <section className="bg-white px-2 rounded">
                <table className="w-full">
                    <tbody>
                        <tr className="h-10">
                            <td className="w-1/3 pl-2 font-semibold text-base">Tên:</td>
                            <td className="w-1/3 pl-2">{quizDetail?.name}</td>
                        </tr>
                        <tr className="h-10 bg-gray-100">
                            <td className="w-1/3 pl-2 font-semibold text-base">Môn học:</td>
                            <td className="w-1/3 pl-2">{quizDetail?.subject}</td>
                        </tr>
                        <tr className="h-10">
                            <td className="w-1/3 pl-2 font-semibold text-base">Trường:</td>
                            <td className="w-1/3 pl-2">{quizDetail?.school}</td>
                        </tr>
                        <tr className="bg-gray-100">
                            <td className="w-1/3 pl-2 font-semibold text-base">Ảnh:</td>
                            <td className="w-1/3 pl-2 py-2">
                                <img
                                    src={quizDetail?.thumb}
                                    className="rounded-md"
                                    width={180}
                                    alt={quizDetail?.name}
                                />
                            </td>
                        </tr>
                        <tr className="h-10">
                            <td className="w-1/3 pl-2 font-semibold text-base">Mô tả:</td>
                            <td className="w-1/3 pl-2">{quizDetail?.description}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        ),
        2: (
            <section className="w-full flex md:flex-row sm:flex-col gap-5">
                <div className="md:w-2/5 sm:w-full">
                    <div className="bg-white shadow-sm px-3 py-3 border rounded-md w-full">
                        <h5 className="pb-2">Phần thi</h5>
                        <div className="flex flex-wrap gap-2">
                            {quizDetail?.quiz &&
                                quizDetail?.quiz.map((partDetail, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => handleChangePartIndex(index)}
                                        className={`${
                                            partDetail?.partName === quizDetail?.quiz[currentPartIndex].partName
                                                ? 'bg-primary border-primary text-white'
                                                : 'border-gray-400 text-gray-700'
                                        } px-3 py-2 rounded-md border-2 transition-all duration-300 hover:cursor-pointer`}
                                    >
                                        {partDetail?.partName}
                                    </button>
                                ))}
                        </div>
                    </div>
                    <div className="bg-white shadow-sm px-3 py-3 border rounded-md w-full mt-5 flex flex-wrap gap-5">
                        {quizDetail?.quiz &&
                            quizDetail?.quiz[currentPartIndex]?.questions?.map((question: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleChangeQuestionIndex(index)}
                                    className={`${
                                        currentQuestionIndex === index
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white  border-gray-400 text-gray-700 '
                                    } hover:opacity-75 w-12 px-3 py-2 border-2 rounded-md duration-200 transition-all font-semibold hover:cursor-pointer`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                    </div>
                </div>
                <div className="md:flex-1 bg-white px-3 py-3 shadow-md sm:w-full">
                    {quizDetail?.quiz && quizDetail?.quiz?.[currentPartIndex]?.questions?.length > 0 && (
                        <div>
                            <p className="text-base">
                                <span className="font-medium">Loại câu hỏi:</span>{' '}
                                {
                                    questionTypeContent?.[
                                        quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]
                                            ?.questionType
                                    ]
                                }
                            </p>
                            {(quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex] as any)
                                ?.questionContent && (
                                <div>
                                    <h4 className="mt-3 text-xl font-bold flex">Câu hỏi:</h4>
                                    <div className="mt-1 text-xl">
                                        {HTMLReactParser(
                                            (
                                                quizDetail?.quiz?.[currentPartIndex]?.questions?.[
                                                    currentQuestionIndex
                                                ] as any
                                            )?.questionContent,
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="text-base">
                                {(
                                    quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex] as any
                                )?.answers.map((answer: any, index: number) => (
                                    <div key={index} className="mt-3 flex">
                                        <input
                                            type={`${
                                                quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]
                                                    ?.questionType == 1
                                                    ? 'radio'
                                                    : 'checkbox'
                                            }`}
                                            checked={answer.isCorrect}
                                            onChange={() => {}}
                                        />
                                        <label className="ml-3 text-gray-700 font-normal">
                                            {HTMLReactParser(answer.content)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        ),
    };

    return (
        <>
            <div className="w-full bg-white px-5 py-5 rounded-md">
                <div className="flex gap-9">
                    {tabs.map((item, index) => (
                        <div
                            key={item.key}
                            className={`${
                                currentKey === item.key
                                    ? 'border-b-4 border-b-primary text-primary cursor-default'
                                    : 'hover:opacity-50 cursor-pointer border-b-4 border-b-white'
                            } flex flex-wrap items-center text-lg pb-2 px-1 transition-all duration-200 ease-linear`}
                            onClick={() => setCurrentKey(item.key)}
                        >
                            <FontAwesomeIcon className="block" icon={item.icon} />
                            <p className="pl-2">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-9 w-full">{tabItems[currentKey]}</div>
        </>
    );
};

export default QuizDetailPage;
