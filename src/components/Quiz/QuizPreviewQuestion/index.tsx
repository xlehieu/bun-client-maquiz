'use client';

import { questionTypeContent } from '@/common/constants';
import { shuffleArray } from '@/utils';
import HTMLReactParser from 'html-react-parser/lib/index';
import React, { Fragment, useMemo } from 'react';

/**
 * Thành phần hiển thị chi tiết từng câu hỏi
 */
const QuestionDetail = ({ question, index }: { question: any; index: number }) => {
    // Render cho câu hỏi Trắc nghiệm (Type 1 & 2)
    if ([1, 2].includes(question?.questionType)) {
        return (
            <div className={`py-5 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex flex-wrap items-start gap-2 mb-4">
                    <span className="shrink-0 px-2 py-1 bg-camdat text-white text-xs font-bold rounded shadow-sm">
                        Câu {index + 1}
                    </span>
                    <div className="flex-1 text-gray-800 font-medium leading-relaxed">
                        {HTMLReactParser(question?.questionContent || '')}
                    </div>
                    <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full shrink-0">
                        {questionTypeContent[question?.questionType]}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-2 ml-2 sm:ml-6">
                    {question?.answers?.map((answer: any, idx: number) => (
                        <div
                            key={idx}
                            className="group flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:border-camdat/30 hover:bg-camdat/5 transition-all duration-200"
                        >
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-camdat group-hover:text-white text-[10px] font-bold text-gray-500 transition-colors uppercase">
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <div className="text-gray-600 text-sm leading-snug">
                                {HTMLReactParser(answer.content || '')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Render cho câu hỏi Nối (Type 3)
    if (Number(question?.questionType) === 3) {
        // Sử dụng useMemo để tránh re-shuffle khi component re-render không cần thiết
        const { shuffledContent, shuffledAnswers } = useMemo(() => {
            const content =
                question?.matchQuestions?.map((m: any) => ({
                    questionContent: m.questionContent,
                    match: m.match,
                })) || [];
            const answers =
                question?.matchQuestions?.map((m: any) => ({
                    answer: m.answer,
                    match: m.match,
                })) || [];
            return {
                shuffledContent: shuffleArray([...content]),
                shuffledAnswers: shuffleArray([...answers]),
            };
        }, [question]);

        return (
            <div className={`py-5 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex items-center gap-2 mb-4">
                    <span className="shrink-0 px-2 py-1 bg-camdat text-white text-xs font-bold rounded shadow-sm">
                        Câu {index + 1}
                    </span>
                    <span className="text-sm font-bold text-gray-700">
                        Ghép đôi các nội dung tương ứng ({questionTypeContent[question?.questionType]})
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <div className="space-y-3">
                        {shuffledContent.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-sm min-h-[50px] flex items-center"
                            >
                                {HTMLReactParser(item.questionContent || '')}
                            </div>
                        ))}
                    </div>
                    <div className="space-y-3">
                        {shuffledAnswers.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-sm min-h-[50px] flex items-center"
                            >
                                {HTMLReactParser(item.answer || '')}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

/**
 * Thành phần chính: Xem trước danh sách câu hỏi
 */
const QuizPreviewQuestion = ({ quizDetail, currentPartIndex }: any) => {
    const allQuestions = quizDetail?.quiz?.[currentPartIndex]?.questions;

    if (!Array.isArray(allQuestions)) return null;

    // Giới hạn hiển thị tối đa 5 câu đầu tiên
    const previewQuestions = allQuestions.slice(0, 5);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            {/* Scroll Area */}
            <div className="h-[500px] overflow-y-auto px-6 pt-2 pb-24 no-scrollbar">
                {previewQuestions.map((question: any, index: number) => (
                    <QuestionDetail key={question.id || index} question={question} index={index} />
                ))}

                {allQuestions.length > 5 && (
                    <div className="py-8 text-center border-t border-dashed border-gray-200">
                        <p className="text-gray-400 italic text-sm">
                            Cùng {allQuestions.length - 5} câu hỏi khác đang chờ bạn khám phá...
                        </p>
                    </div>
                )}
            </div>

            {/* Floating Banner */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
                <div className="bg-yellow-500 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-yellow-400">
                    <div className="flex items-center gap-3 text-white">
                        <div className="bg-white/20 p-2 rounded-full animate-pulse">🚀</div>
                        <p className="font-bold text-sm md:text-base leading-tight">
                            Bạn đang ở chế độ xem trước.
                            <br />
                            <span className="font-normal text-xs opacity-90 text-yellow-50">
                                Hãy bắt đầu bài thi để trải nghiệm đầy đủ!
                            </span>
                        </p>
                    </div>
                    <button className="whitespace-nowrap bg-white text-yellow-600 hover:bg-yellow-50 px-6 py-2 rounded-lg font-extrabold text-sm transition-all active:scale-95 shadow-md">
                        BẮT ĐẦU ÔN THI
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizPreviewQuestion;
