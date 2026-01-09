import { questionTypeContent } from '@/common/constants';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setExamCurrentQuestionIndex, setExamCurrentQuestionType } from '@/redux/slices/takeExam.slice';
import { checkCorrectAnswer } from '@/utils';
import { Col, Row } from 'antd';

const TableClassExamTableQuestion = () => {
    const dispatch = useAppDispatch();
    const { currentPartIndex, answerChoices, examDataQuizPart, currentQuestionType, currentQuestionIndex } =
        useAppSelector((state) => state.takeExam);

    return (
        <section className="flex flex-col gap-6 select-none">
            {/* PHẦN THI (PARTS) */}
            {/* <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-400">Phần thi</h3>
                    <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-md">
                        {quizDetail?.quiz?.length} phần
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    {quizDetail?.quiz?.map((part, index: number) => (
                        <button
                            key={index}
                            onClick={() => {
                                dispatch(setCurrentQuestionIndex(0));
                                dispatch(setCurrentPartIndex(index));
                            }}
                            className={`
                                group relative w-full px-4 py-3 rounded-xl font-bold transition-all duration-200 text-left overflow-hidden
                                ${
                                    currentPartIndex === index
                                        ? 'bg-primary text-white shadow-lg shadow-blue-200 scale-[1.02]'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }
                            `}
                        >
                            <p className="text-sm truncate z-10 relative">{part?.partName}</p>
                            {currentPartIndex === index && (
                                <div className="absolute right-[-10px] top-[-10px] w-12 h-12 bg-white/10 rounded-full blur-xl" />
                            )}
                        </button>
                    ))}
                </div>
            </div> */}

            {/* DANH SÁCH CÂU HỎI */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
                <div className="flex flex-col gap-1 mb-6 px-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-400">Câu hỏi</h3>
                        <span className="text-[10px] font-bold text-slate-400 italic">
                            {questionTypeContent?.[currentQuestionType || 0] || ''}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-2.5">
                    {examDataQuizPart?.[currentPartIndex]?.questions?.map?.((question, index: number) => {
                        // const status = checkCorrectAnswer({
                        //     questionIndex: index,
                        //     answerChoices,
                        //     partIndex: currentPartIndex,
                        //     quizDetail,
                        // });
                        const isDaTraLoiCauHoi =
                            currentPartIndex in answerChoices && index in answerChoices?.[currentPartIndex];
                        const isActive = currentQuestionIndex === index;

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    dispatch(setExamCurrentQuestionIndex(index));
                                    dispatch(setExamCurrentQuestionType(question.questionType));
                                }}
                                className={`
                                    flex items-center justify-center aspect-square rounded-xl text-sm font-black transition-all duration-200 border-2
                                    ${isActive ? 'scale-110 z-10 shadow-md ring-2 ring-white' : 'scale-100'}
                                    ${
                                        isActive || isDaTraLoiCauHoi
                                            ? 'bg-primary border-primary text-white shadow-blue-200'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-blue-300 hover:text-blue-500'
                                    }
                                `}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TableClassExamTableQuestion;
