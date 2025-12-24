'use client';
import { useQuery } from '@tanstack/react-query';
import { message, Pagination } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useReducer, useState } from 'react';
import { PAGE_SIZE } from '@/common/constants';
import useMutationHooks from '@/hooks/useMutationHooks';
import * as QuizManagementService from '@/api/admin/quizmanagement.service';
const active_type = {
    CHANGE_DISABLED: 'CHANGE_DISABLED',
    SET_QUIZZES_LIST: 'SET_USER_LIST',
};
const quizManageReducer = (state: any, action: any) => {
    switch (action.type) {
        case active_type.SET_QUIZZES_LIST: {
            if (action.payload.quizzes) return action.payload.quizzes;
            return state;
        }
        case active_type.CHANGE_DISABLED: {
            const quizzes = [...state];
            if (action.payload.id) {
                quizzes.forEach((quiz) => {
                    if (quiz._id == action.payload.id) {
                        quiz.isDisabled = !quiz.isDisabled;
                    }
                });
                return quizzes;
            }
            return state;
        }
        default:
            return state;
    }
};
const QuizManagement = () => {
    const [quizzesList, dispatchQuizzesList] = useReducer(quizManageReducer, []);
    const [totalQuiz, setTotalQuiz] = useState(0);
    const quizListQuery = useQuery({
        queryKey: ['quizzesListQuery'],
        queryFn: () => QuizManagementService.getQuizList({}),
    });
    const getQuizListMutation = useMutationHooks((data: any) => QuizManagementService.getQuizList(data));
    useEffect(() => {
        if (quizListQuery.data) {
            setTotalQuiz(quizListQuery.data?.total);
            dispatchQuizzesList({
                type: active_type.SET_QUIZZES_LIST,
                payload: {
                    quizzes: quizListQuery.data?.quizzes,
                },
            });
        } else if (quizListQuery.isError) {
            message.error('đã có lỗi xảy ra');
        }
    }, [quizListQuery]);
    useEffect(() => {
        if (getQuizListMutation.isSuccess) {
            dispatchQuizzesList({
                type: active_type.SET_QUIZZES_LIST,
                payload: {
                    quizzes: getQuizListMutation.data?.quizzes,
                },
            });
        }
    }, [getQuizListMutation]);
    const handlePageChange = (page: number) => {
        getQuizListMutation.mutate({ skip: (Number(page - 1) || 0) * PAGE_SIZE });
    };

    const changeQuizDisabledMutation = useMutationHooks((data: any) => QuizManagementService.changeQuizDisabled(data));
    const handleChangeQuizDisabled = (id: string) => {
        if (!id) return;
        changeQuizDisabledMutation.mutate({ id });
        dispatchQuizzesList({
            type: active_type.CHANGE_DISABLED,
            payload: {
                id,
            },
        });
    };
    return (
        <>
            <section className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl my-5 text-gray-700">DANH SÁCH ĐỀ TRẮC NGHIỆM</h1>
                    <p className="text-lg">
                        Tổng số: <span className="text-primary text-xl">{totalQuiz}</span>
                    </p>
                </div>
                <table className="w-full min-w-[640px] table-auto">
                    <thead>
                        <tr>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                <p className="block antialiased font-sans text-[13px] font-bold uppercase text-blue-gray-400">
                                    Tên đề trắc nghiệm
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased font-sans text-[13px] font-bold uppercase text-blue-gray-400">
                                    Người tạo
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased font-sans text-[13px] font-bold uppercase text-blue-gray-400">
                                    Số câu hỏi
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased font-sans text-[13px] font-bold uppercase text-blue-gray-400">
                                    Ngày tạo
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased font-sans text-[14px] font-bold uppercase text-blue-gray-400">
                                    Chặn
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzesList?.map((quiz: any, idx: number) => (
                            <tr key={idx}>
                                {/* image */}
                                <td className="py-3 px-5 border-b border-blue-gray-50">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={quiz.thumb}
                                            alt="Avatar"
                                            className="inline-block relative object-cover object-center w-24 h-24 rounded-md border-2"
                                        />
                                        <div>
                                            <p className="block antialiased font-sans text-base leading-normal text-blue-gray-900 font-semibold">
                                                {quiz.name || ''}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                {/* Người tạo */}
                                <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={quiz?.userInfo?.avatar}
                                            alt="Avatar"
                                            className="inline-block relative object-cover object-center w-10 h-10 rounded-full border-2"
                                        />
                                        <div>
                                            <p className="block antialiased font-sans text-base leading-normal text-blue-gray-900 font-semibold">
                                                {quiz?.userInfo?.name || ''}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                {/* question count */}
                                <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
                                    <p className="block antialiased font-sans text-base font-semibold text-blue-gray-600">
                                        {quiz.questionCount || 0}
                                    </p>
                                </td>
                                {/* Ngày tạo */}
                                <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
                                    <p className="block antialiased font-sans text-base font-semibold text-blue-gray-600">
                                        {quiz.createdAt ? dayjs(quiz.createdAt).format('DD/MM/YYYY') : 'null'}
                                    </p>
                                </td>
                                <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            onChange={() => handleChangeQuizDisabled(quiz._id)}
                                            checked={quiz.isDisabled || false}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-primary dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                                        <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-300"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    className="mt-3"
                    onChange={(e) => handlePageChange(e)}
                    defaultCurrent={1}
                    defaultPageSize={PAGE_SIZE}
                    total={totalQuiz || PAGE_SIZE}
                />
            </section>
        </>
    );
};

export default QuizManagement;
