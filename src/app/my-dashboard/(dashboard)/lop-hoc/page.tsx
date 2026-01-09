'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMyClassroom } from '@/redux/slices/classrooms.slice';
import { faPlus, faUsers, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Button } from 'antd';
import { useLayoutEffect, useState } from 'react';
import ListClassroom from '../../../../features/classroom/components/ListClassroom';
import ModalCreateClassroom from '../../../../features/classroom/components/ModalCreateClassroom';
import ModalEnrollClassroom from '../../../../features/classroom/components/ModalEnrollClassroom';
import { resetTakeExam } from '@/redux/slices/takeExam.slice';
import { resetTakeQuiz } from '@/redux/slices/takeQuiz.slice';

const ClassroomsPageMain = () => {
    const dispatch = useAppDispatch();
    const { enrolledClassrooms, myClassrooms } = useAppSelector((state) => state.classroom);
    const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
    const [isOpenModalEnroll, setIsOpenModalEnroll] = useState(false);

    useLayoutEffect(() => {
        if (enrolledClassrooms.length <= 0 || myClassrooms.length <= 0) {
            dispatch(fetchMyClassroom());
        }
        dispatch(resetTakeExam());
        dispatch(resetTakeQuiz());
    }, []);

    // Menu dropdown được style lại theo phong cách hiện đại
    const items = [
        {
            key: 'enroll',
            label: (
                <div onClick={() => setIsOpenModalEnroll(true)} className="flex items-center gap-3 px-2 py-1">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <span className="font-bold text-slate-600">Tham gia lớp học</span>
                </div>
            ),
        },
        {
            key: 'create',
            label: (
                <div onClick={() => setIsOpenModalCreate(true)} className="flex items-center gap-3 px-2 py-1">
                    <div className="w-8 h-8 rounded-lg bg-camdat/10 text-camdat flex items-center justify-center">
                        <FontAwesomeIcon icon={faChalkboardTeacher} />
                    </div>
                    <span className="font-bold text-slate-600">Tạo lớp học mới</span>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="max-w-[1440px] m-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between py-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lớp học của tôi</h1>
                        <p className="text-slate-400 font-medium mt-1">Quản lý và theo dõi quá trình học tập</p>
                    </div>

                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                        placement="bottomRight"
                        overlayClassName="custom-dropdown-modern"
                    >
                        <button className="group flex items-center gap-3 bg-white hover:bg-primary px-6 py-3 rounded-[20px] shadow-sm border border-slate-100 transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-primary group-hover:bg-white text-white group-hover:text-primary flex items-center justify-center transition-all">
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                            <span className="font-black text-slate-700 group-hover:text-white uppercase tracking-wider text-xs">
                                Tùy chọn lớp học
                            </span>
                        </button>
                    </Dropdown>
                </div>

                {/* Main Content Card */}
                <section className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[600px]">
                    {/* Toolbar giả lập bên trong card */}

                    {/* Nội dung danh sách */}
                    <div className="p-8">
                        <ListClassroom />
                    </div>
                </section>
            </div>

            {/* Modals */}
            <ModalCreateClassroom isOpen={isOpenModalCreate} onClose={() => setIsOpenModalCreate(false)} />
            <ModalEnrollClassroom isOpen={isOpenModalEnroll} onClose={() => setIsOpenModalEnroll(false)} />
        </div>
    );
};

export default ClassroomsPageMain;
