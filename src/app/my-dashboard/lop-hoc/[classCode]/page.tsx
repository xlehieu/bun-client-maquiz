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
import { TabsProps } from 'antd/lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';

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
    const items: TabsProps['items'] = [
        {
            key: 'newfeeds',
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <FontAwesomeIcon icon={faNewspaper} />
                    <span className="font-bold text-base">Bảng tin</span>
                </div>
            ),
            children: (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <TabNewFeeds />
                </div>
            ),
        },
        {
            key: 'everyone',
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <FontAwesomeIcon icon={faPeopleGroup} />
                    <span className="font-bold text-base">Mọi người</span>
                </div>
            ),
            children: (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <TabEveryone />
                </div>
            ),
        },
    ];
    return (
        <section className="mt-5">
            <div>
                <ButtonBack>Quay lại danh sách lớp học</ButtonBack>
            </div>
            <div className="w-full mt-2 md:mt-0 min-h-screen px-8 py-4 flex flex-col">
                {/* <Tabs defaultActiveKey="newfeeds">
                    <TabPane tab="Bảng tin" key="newfeeds">
                        <TabNewFeeds />
                    </TabPane>
                    <TabPane tab="Mọi người" key="everyone">
                        <TabEveryone />
                    </TabPane>
                </Tabs> */}
                <Tabs
                    defaultActiveKey="newfeeds"
                    items={items}
                    className="custom-antd-tabs"
                    size="large"
                    animated={{ inkBar: true, tabPane: true }}
                />
            </div>
        </section>
    );
};
export default ClassroomDetail;
