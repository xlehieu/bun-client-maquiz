'use client';
import { useAppSelector } from '@/redux/hooks';
import React from 'react';
import { faChalkboardTeacher, faUserGraduate, faIdBadge, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TabClassroomMember = () => {
    const { classroomDetail } = useAppSelector((state) => state.classroom);

    return (
        <div className="p-4 md:p-8 bg-[#fdfdfd] min-h-screen space-y-12">
            {/* PHẦN GIÁO VIÊN */}
            <section className="">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-yellow-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="text-primary text-lg" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-primary-bold">Giáo viên</h2>
                </div>

                <div className="max-w-md">
                    <div className="bg-white border-[3px] border-black rounded-[2rem] p-6 flex items-center gap-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="w-20 h-20 rounded-2xl border-[3px] border-black overflow-hidden bg-blue-100 shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <img
                                src={
                                    classroomDetail?.teacher?.avatar ||
                                    'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher'
                                }
                                alt={classroomDetail?.teacher?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                                Teacher
                            </span>
                            <p className="font-black text-2xl uppercase italic text-slate-800 leading-tight">
                                {classroomDetail?.teacher?.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold bg-yellow-400 border-2 border-black px-3 py-0.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    CHỦ NHIỆM
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PHẦN HỌC SINH */}
            <section>
                <div className="flex items-center justify-between mb-8 border-b-[3px] border-black pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <FontAwesomeIcon icon={faUserGraduate} className="text-white text-lg" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">
                            Danh sách học viên
                        </h2>
                    </div>
                    <div className="bg-primary text-white px-4 py-1 rounded-full font-black text-sm shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
                        {classroomDetail?.students?.length || 0} THÀNH VIÊN
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {classroomDetail?.students?.map((student: any) => (
                        <div
                            key={student._id}
                            className="bg-white border-[3px] border-black rounded-[2.5rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center"
                        >
                            {/* Avatar student */}
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-[2rem] border-[3px] border-black overflow-hidden bg-slate-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    {student.avatar ? (
                                        <img
                                            src={student.avatar}
                                            alt={student.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-2xl font-black text-blue-300 uppercase">
                                            {student?.name?.charAt(0) || 'S'}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white border-2 border-black w-8 h-8 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <FontAwesomeIcon icon={faIdBadge} className="text-xs" />
                                </div>
                            </div>

                            {/* Thông tin học viên */}
                            <div className="w-full text-center space-y-3">
                                <p className="font-black text-lg uppercase tracking-tight text-slate-800 truncate px-2">
                                    {student.name || 'Học sinh'}
                                </p>

                                <div className="flex items-center justify-center gap-2 text-slate-500 bg-slate-50 border-2 border-black/5 rounded-xl py-2">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-[10px]" />
                                    <p className="text-[13px] font-bold truncate max-w-[150px]">{student?.email}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TabClassroomMember;
