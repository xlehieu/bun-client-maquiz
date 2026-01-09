'use client';
import { useAppSelector } from '@/redux/hooks';
import React from 'react';
import ClassroomCard from './ClassroomCard';
import { Spin, Empty } from 'antd';
import { RocketOutlined, ReadOutlined } from '@ant-design/icons';

const ListClassroom = () => {
    const { enrolledClassrooms, myClassrooms, isLoading } = useAppSelector((state) => state.classroom);

    const renderSectionHeader = (title: string, icon: React.ReactNode, count: number) => (
        <div className="flex items-center justify-between w-full mb-6 mt-10 first:mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary text-lg">
                    {icon}
                </div>
                <div>
                    <h2 className="text-lg font-black text-slate-700 tracking-tight uppercase">{title}</h2>
                    <p className="text-xs font-bold text-slate-400">Tổng cộng {count} lớp học</p>
                </div>
            </div>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-100 to-transparent ml-8" />
        </div>
    );

    if (!isLoading && myClassrooms?.length === 0 && enrolledClassrooms?.length === 0) {
        return (
            <div className="py-20 animate-in fade-in zoom-in duration-500">
                <Empty
                    description={<span className="text-slate-400 font-medium">Bạn chưa tham gia lớp học nào</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <Spin spinning={isLoading} tip="Đang tải danh sách lớp học...">
            <div className="flex flex-col space-y-12 pb-10">
                {/* SECTION: LỚP HỌC CỦA TÔI */}
                {myClassrooms?.length > 0 && (
                    <section>
                        {renderSectionHeader('Lớp học tôi quản lý', <RocketOutlined />, myClassrooms.length)}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            {myClassrooms.map((classroom: any, index: number) => (
                                <div
                                    key={classroom.id || index}
                                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <ClassroomCard isMyClassroom={true} classroom={classroom} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SECTION: LỚP HỌC ĐANG THAM GIA */}
                {enrolledClassrooms?.length > 0 && (
                    <section>
                        {renderSectionHeader('Lớp học đang tham gia', <ReadOutlined />, enrolledClassrooms.length)}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            {enrolledClassrooms.map((classroom: any, index: number) => (
                                <div
                                    key={classroom.id || index}
                                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <ClassroomCard isMyClassroom={false} classroom={classroom} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </Spin>
    );
};

export default ListClassroom;
