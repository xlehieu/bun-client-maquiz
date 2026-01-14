import React from 'react';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUserEdit, faCalendarAlt, faArrowRight, faEye } from '@fortawesome/free-solid-svg-icons'; // Giả định path type của bạn
import { useRouter } from 'next/navigation';
import { ClassExamItem } from '@/@types/classExam.type';
import { getRouteConfigParam, USER_DASHBOARD_ROUTER } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchClassExamDetail } from '@/redux/slices/takeQuiz.slice';
import { Button } from 'antd';
import { toast } from 'sonner';

type Props = {
    exam: ClassExamItem;
    viewByAdmin?: boolean;
};

const ClassExamCard = ({ exam, viewByAdmin = false }: Props) => {
    const router = useRouter();
    // Logic kiểm tra trạng thái thời gian
    const dispatch = useAppDispatch();
    const { classroomDetail } = useAppSelector((state) => state.classroom);
    const { userProfile } = useAppSelector((state) => state.user);
    const isOpen = exam.isOpen;
    const isEnded = exam.isExpired;
    const isDraft = !isOpen && !isEnded;
    const handleNavigateTakeExam = (classCode: string, idClassExam: string) => {
        const routerParam = getRouteConfigParam(USER_DASHBOARD_ROUTER.TAKE_CLASS_EXAM, [classCode, idClassExam]);
        console.log(routerParam);
    };
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="flex flex-col md:flex-row h-full">
                {/* Left Side: Thumbnail & Status Badge */}
                <div className="relative w-full md:w-48 h-32 md:h-auto overflow-hidden flex items-end">
                    {/* <img
            src={exam.quizDetail.thumb}
            alt={exam.quizDetail.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          /> */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {isEnded ? (
                            <span className="bg-gray-500/80 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold">
                                Kết thúc
                            </span>
                        ) : isOpen ? (
                            <span className="bg-emerald-500/80 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold animate-pulse">
                                Đang diễn ra
                            </span>
                        ) : (
                            <span className="bg-amber-500/80 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold">
                                Sắp diễn ra
                            </span>
                        )}
                    </div>
                    {classroomDetail?.teacher._id === userProfile?._id && (
                        <Button
                            type="primary"
                            variant="filled" // Xu hướng thiết kế 2025
                            color="primary"
                            icon={<FontAwesomeIcon icon={faEye} />}
                            className="mb-3 ml-3 shadow-sm hover:scale-105 transition-all"
                            onClick={() => {
                                if (classroomDetail?.classCode && exam._id) {
                                    const route = getRouteConfigParam(USER_DASHBOARD_ROUTER.VIEW_EXAM_ATTEMPT, [
                                        classroomDetail.classCode,
                                        exam._id,
                                    ]);
                                    router.push(route);
                                } else {
                                    toast.error('Có lỗi xảy ra, vui lòng thử lại');
                                }
                            }}
                        >
                            Xem bài thi
                        </Button>
                    )}
                </div>

                {/* Right Side: Details */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                            {exam?.quizDetail?.name}
                        </h3>

                        <div className="grid grid-cols-2 gap-y-3 mt-4">
                            {/* Thời gian làm bài */}
                            <div className="flex items-center gap-2 text-slate-600">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
                                    <FontAwesomeIcon icon={faClock} size="sm" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold leading-none">
                                        Thời gian
                                    </span>
                                    <span className="text-sm font-semibold">{exam.duration} phút</span>
                                </div>
                            </div>

                            {/* Số lần làm bài */}
                            <div className="flex items-center gap-2 text-slate-600">
                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shadow-inner">
                                    <FontAwesomeIcon icon={faUserEdit} size="sm" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold leading-none">
                                        Số lần được phép làm
                                    </span>
                                    <span className="text-sm font-semibold">{exam.maxAttempts} lần</span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline thời gian */}
                        <div className="mt-4 p-3 rounded-xl bg-slate-50/50 border border-slate-100 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
                                <span>
                                    Bắt đầu: <b>{dayjs(exam.startTime).format('HH:mm - DD/MM')}</b>
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-red-400" />
                                <span>
                                    Kết thúc: <b>{dayjs(exam.endTime).format('HH:mm - DD/MM')}</b>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    {!viewByAdmin && (
                        <button
                            disabled={isEnded}
                            onClick={(e) => {
                                e.preventDefault();
                                if (classroomDetail?.classCode) {
                                    const routeTakeClassExam = getRouteConfigParam(
                                        USER_DASHBOARD_ROUTER.TAKE_CLASS_EXAM,
                                        [classroomDetail?.classCode, exam._id],
                                    );

                                    router.push(routeTakeClassExam);
                                }
                            }}
                            className={`mt-5 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all 
                        ${
                            !isEnded
                                ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                        >
                            {isEnded ? 'Đã đóng' : isOpen ? 'Vào thi ngay' : 'Vào chuẩn bị thi'}
                            {!isEnded && <FontAwesomeIcon icon={faArrowRight} className="text-xs" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassExamCard;
