'use client';
import Timer from '@/features/takeQuiz/components/Timer';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    endTakeExam,
    resetTakeExam,
    setExamCurrentPartIndex,
    setExamCurrentQuestionIndex,
    setExamTimePassQuestion,
} from '@/redux/slices/takeExam.slice';
import { faArrowLeft, faBookOpen, faClock, faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popconfirm, Select, Tag } from 'antd';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useClassExam } from '../classExam.query';
import { getRouteConfigParam, USER_DASHBOARD_ROUTER } from '@/config/routes';
import { setCurrentQuestionType } from '@/redux/slices/takeQuiz.slice';

const TakeClassExamInfo = () => {
    const { classExamId } = useParams<{ classExamId?: string }>();
    const { data: classExam } = useClassExam(classExamId);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { currentPartIndex, timePassQuestion, answerChoices, examDataQuizPart } = useAppSelector(
        (state) => state.takeExam,
    );
    return (
        <div className="flex flex-col w-full gap-6 select-none">
            {/* THÔNG TIN CHUNG */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                {/* Trang trí góc */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-1" />

                <div className="relative z-10">
                    <div className="flex flex-col gap-1 mb-4">
                        <Tag
                            color="volcano"
                            className="w-fit font-bold rounded-md uppercase tracking-wider text-[10px]"
                        >
                            Kiểm tra
                        </Tag>
                        <h2 className="text-xl font-black text-slate-800 leading-tight">
                            {classExam?.quizDetail?.name}
                        </h2>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        {/* Timer Section */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                                <FontAwesomeIcon icon={faClock} className="text-rose-500" />
                                <span>Thời gian</span>
                            </div>
                            <div className="font-black text-slate-800">
                                <Timer endTime={dayjs(classExam?.endTime).toDate()} size="sm" />
                            </div>
                        </div>

                        {/* Auto-next Setting */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                Tự động chuyển câu
                            </label>
                            <Select
                                onChange={(e) => dispatch(setExamTimePassQuestion(e))}
                                defaultValue={1000}
                                className="w-full custom-select"
                                value={timePassQuestion}
                                suffixIcon={null}
                                style={{ background: '#f8fafc', borderRadius: '12px' }}
                            >
                                <Select.Option value={1000}>Cực nhanh (1s)</Select.Option>
                                <Select.Option value={2000}>Vừa phải (2s)</Select.Option>
                                <Select.Option value={3000}>Chậm (3s)</Select.Option>
                                <Select.Option value={4000}>Rất chậm (4s)</Select.Option>
                            </Select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <Popconfirm
                            title="Xác nhận trở về?"
                            description="Tiến độ hiện tại sẽ bị đặt lại."
                            onConfirm={() => {
                                const routeBackReplace = getRouteConfigParam(
                                    USER_DASHBOARD_ROUTER.CLASSROOM_DETAIL_PARAM,
                                    [classExam?.classId!!],
                                );
                                router.replace(routeBackReplace);
                                dispatch(resetTakeExam());
                            }}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <button className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm transition-all hover:bg-rose-50 hover:text-rose-600">
                                <FontAwesomeIcon icon={faArrowLeft} />
                                Trở về
                            </button>
                        </Popconfirm>

                        <Popconfirm
                            title="Xác nhận nộp bài thi?"
                            onConfirm={() => dispatch(endTakeExam())}
                            okText="Nộp bài"
                        >
                            <button className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-200 transition-all hover:scale-105 active:scale-95">
                                <FontAwesomeIcon icon={faFlagCheckered} />
                                Nộp bài thi
                            </button>
                        </Popconfirm>
                    </div>
                </div>
            </div>

            {/* DANH SÁCH PHẦN THI */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-400">
                        Danh sách phần thi
                    </h3>
                    <span className="bg-blue-50 shrink-0 text-primary px-2.5 py-1 rounded-lg text-[10px] font-black">
                        {examDataQuizPart?.length}
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    {examDataQuizPart?.map((part, index: number) => {
                        const isCurrent = currentPartIndex === index;
                        const answeredCount =
                            index in (answerChoices || {}) ? Object.keys(answerChoices[index]).length : 0;
                        const totalCount = examDataQuizPart?.[index]?.questions?.length;
                        const isCompleted = answeredCount === totalCount;

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    dispatch(setExamCurrentQuestionIndex(0));
                                    dispatch(setExamCurrentPartIndex(index));
                                    dispatch(setCurrentQuestionType(part?.questions?.[0]?.questionType));
                                }}
                                className={`
                                    group flex items-center justify-between p-3 rounded-2xl transition-all duration-300 border-2
                                    ${
                                        isCurrent
                                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`
                                        w-10 h-10 flex items-center justify-center rounded-xl transition-all shrink-0
                                        ${
                                            isCurrent
                                                ? 'bg-primary shadow-lg shadow-blue-200 rotate-12'
                                                : 'bg-slate-100 text-slate-400 group-hover:rotate-12'
                                        }
                                    `}
                                    >
                                        <FontAwesomeIcon
                                            icon={faBookOpen}
                                            className={isCurrent ? 'text-white' : 'text-slate-400'}
                                        />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span
                                            className={`text-sm font-bold ${
                                                isCurrent ? 'text-primary' : 'text-slate-600'
                                            }`}
                                        >
                                            {part?.partName}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            Phần số {index + 1}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <span
                                        className={`text-xs font-black ${
                                            isCompleted ? 'text-emerald-500' : 'text-primary'
                                        }`}
                                    >
                                        {answeredCount}/{totalCount}
                                    </span>
                                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${
                                                isCompleted ? 'bg-emerald-500' : 'bg-primary'
                                            }`}
                                            style={{ width: `${(answeredCount / totalCount) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TakeClassExamInfo;
