'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button, Popconfirm, Select } from 'antd';
import React from 'react';
import Timer from './Timer';
import { endTakeQuiz, resetTakeQuiz, setCurrentPartIndex, setTimePassQuestion } from '@/redux/slices/takeQuiz.slice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TakeQuizInfo = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {
        currentPartIndex,
        currentQuestionIndex,
        currentQuestionType,
        answerChoices,
        isEnded,
        currentQuizPreviewDetail: quizDetail,
    } = useAppSelector((state) => state.takeQuiz);
    const handleChangePartIndex = (partIndex: any) => {
        if (partIndex === currentPartIndex) return;
        dispatch(setCurrentPartIndex(partIndex));
    };
    const handleBack = () => {
        if (window) {
            window.location.href = `/review-quiz/${quizDetail?.name}`;
        }
    };
    return (
        <div className="flex flex-col w-full gap-6">
            <div className="px-4 py-2 bg-white rounded shadow">
                <div className="border-b border-gray-300 font-medium py-2">
                    <p className="text-lg">{quizDetail?.name}</p>
                    <p className="font-normal mt-2">
                        <span className="text-2xl text-rose-800 font-bold ml-1">Ôn thi</span>
                    </p>
                </div>
                <div className="border-b border-gray-300 py-2">
                    <p>Thời gian làm bài</p>
                    <Timer />
                </div>
                <div className="pt-2">
                    <p className="font-medium pb-1 text-sm">Tự động chuyển câu sau</p>
                    <Select
                        onChange={(e) => {
                            dispatch(setTimePassQuestion(e));
                        }}
                        defaultValue={1000}
                        className="w-full md:w-1/2 mt-2"
                    >
                        <Select.Option value={1000}>1s</Select.Option>
                        <Select.Option value={2000}>2s</Select.Option>
                        <Select.Option value={3000}>3s</Select.Option>
                        <Select.Option value={4000}>4s</Select.Option>
                    </Select>
                </div>
                <div className="flex mt-3 gap-3">
                    <Popconfirm
                        title="Xác nhận trở về"
                        placement="topRight"
                        okType="danger"
                        showCancel={false}
                        onConfirm={() => {
                            router.replace(`/review-quiz/${quizDetail?.slug}`);
                            dispatch(resetTakeQuiz());
                        }}
                    >
                        <button className="bg-red-500 block rounded-md px-3 py-1  duration-300 hover:opacity-65">
                            <p className="text-center text-white">Trở về</p>
                        </button>
                    </Popconfirm>
                    <Popconfirm
                        title="Xác nhận kết thúc bài thi"
                        placement="topRight"
                        showCancel={false}
                        onConfirm={() => dispatch(endTakeQuiz())}
                    >
                        <button className="bg-yellow-500 block rounded-md px-3 py-1 duration-300 hover:opacity-65">
                            <p className="text-center text-white">Kết thúc</p>
                        </button>
                    </Popconfirm>
                </div>
            </div>
            <div className="px-4 py-2 bg-white rounded shadow">
                <p className="font-medium mb-4">Danh sách phần thi ({quizDetail?.quiz?.length})</p>
                {quizDetail?.quiz.map((part, index: number) => (
                    <button
                        key={index}
                        onClick={() => handleChangePartIndex(index)}
                        className={`w-full px-4 py-2 items-center rounded-sm flex justify-between opacity-95 duration-300 ease-linear ${
                            currentPartIndex === index
                                ? 'bg-blue-100 cursor-default'
                                : 'cursor-pointer hover:opacity-45 hover:bg-blue-100'
                        }`}
                    >
                        <div className="flex items-center">
                            <div
                                className={`w-7 h-7 flex items-center justify-center flex-wrap rounded-full ${
                                    currentPartIndex === index ? 'bg-pink-600' : ''
                                }`}
                            >
                                {currentPartIndex === index && (
                                    <FontAwesomeIcon className={`text-white text-sm`} icon={faBookOpen} />
                                )}
                            </div>
                            <span className="ml-3">{part?.partName}</span>
                        </div>
                        <div className="text-blue-500 font-medium text-right">
                            {index in (answerChoices || {}) ? <>{Object.keys(answerChoices[index]).length}</> : 0}/
                            {quizDetail?.quiz[index]?.questions?.length}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TakeQuizInfo;
