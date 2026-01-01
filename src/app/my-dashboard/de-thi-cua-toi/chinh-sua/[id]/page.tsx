'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faQuestionCircle, faReply, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Tabs, ConfigProvider } from 'antd';
import type { TabsProps } from 'antd';

import EditGeneralInformationTab from './components/EditGeneralInformationTab';
import EditQuizQuestionTab from './components/EditQuizQuestionTab';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchQuizDetail } from '@/redux/slices/quiz.slice';
import { fetchListQuestionType } from '@/redux/slices/questionType.slice';
import ButtonBack from '@/components/UI/ButtonBack';

const EditMyQuizPage = () => {
    const params = useParams();
    const id = params?.id;
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { listQuestionType } = useAppSelector((state) => state.questionType);

    useEffect(() => {
        if (id && !Array.isArray(id)) {
            dispatch(fetchQuizDetail(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (listQuestionType.length <= 0) {
            dispatch(fetchListQuestionType());
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [listQuestionType.length, dispatch]);

    // Cấu hình các Items cho Tabs của Ant Design
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <FontAwesomeIcon icon={faCircleInfo} />
                    <span className="font-bold text-base">Thông tin chung</span>
                </div>
            ),
            children: (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <EditGeneralInformationTab />
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    <span className="font-bold text-base">Các câu hỏi</span>
                </div>
            ),
            children: (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <EditQuizQuestionTab />
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-[1200px] mx-auto pb-10 px-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Chỉnh sửa đề thi</h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Cập nhật nội dung và cấu trúc câu hỏi cho bộ đề
                    </p>
                </div>

                <ButtonBack />
            </div>

            {/* Main Content with Ant Design Tabs */}
            <div className="bg-white p-2 sm:p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    className="custom-antd-tabs"
                    size="large"
                    animated={{ inkBar: true, tabPane: true }}
                />
            </div>
        </div>
    );
};

export default EditMyQuizPage;
