'use client';
import LazyImage from '@/components/UI/LazyImage';
import { IQuiz } from '@/interface';
import { Button, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useParams, useRouter } from 'next/navigation';
import { createContext, Fragment, useLayoutEffect } from 'react';
import TabEveryone from './components/TabEveryone';
import TabNewFeeds from './components/TabNewFeeds';
import ButtonBack from '@/components/UI/ButtonBack';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchClassroomDetail } from '@/redux/slices/classrooms.slice';
import { fetchMyListQuiz } from '@/redux/slices/quiz.slice';

const ClassroomDetail = () => {
    const router = useRouter();
    const params = useParams();
    const dispatch = useAppDispatch();
    const { classroomDetail } = useAppSelector((state) => state.classroom);
    const { listMyQuiz } = useAppSelector((state) => state.quiz);
    const classCode = params?.classCode;
    useLayoutEffect(() => {
        if (!classroomDetail && params.classCode && typeof params.classCode == 'string')
            dispatch(fetchClassroomDetail(params.classCode));
        if (listMyQuiz.length <= 0) {
            dispatch(fetchMyListQuiz());
        }
    }, [classCode]);

    return (
        <section className="mt-5">
            <div>
                <ButtonBack>Quay lại danh sách lớp học</ButtonBack>
            </div>
            <div className="w-full mt-2 md:mt-0 min-h-screen bg-white px-8 py-4 rounded-xl shadow-lg flex flex-col">
                <Tabs defaultActiveKey="newfeeds">
                    <TabPane tab="Bảng tin" key="newfeeds">
                        <TabNewFeeds />
                    </TabPane>
                    <TabPane tab="Mọi người" key="everyone">
                        <TabEveryone />
                    </TabPane>
                </Tabs>
            </div>
        </section>
    );
};
export default ClassroomDetail;
