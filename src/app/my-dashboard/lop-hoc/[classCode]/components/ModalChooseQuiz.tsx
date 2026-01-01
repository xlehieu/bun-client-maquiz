'use client';
import QuizCard from '@/components/Quiz/QuizCard/QuizCard';
import { useAppSelector } from '@/redux/hooks';
import { FormInstance, Modal } from 'antd';
import { useEffect, useState } from 'react';
import './ModalChooseQuiz.scss';
type ModalChooseQuizProps<T> = {
    form: FormInstance<T>;
    isOpen: boolean;
    onClose: () => void;
    multiple?: boolean;
    fieldName: keyof T;
};
const ModalChooseQuiz = <T extends object>({
    isOpen,
    onClose,
    form,
    multiple = true,
    fieldName,
}: ModalChooseQuizProps<T>) => {
    const { listMyQuiz } = useAppSelector((state) => state.quiz);
    const [selectMultiple, setSelectMultiple] = useState<Set<string>>(new Set());
    const [selectSingle, setSelectSingle] = useState<string | undefined>(undefined);
    const handleChooseMultiple = (id: string) => {
        setSelectMultiple((prev) => {
            const prevSet = new Set(prev);
            if (prevSet.has(id)) {
                prevSet.delete(id);
            } else {
                prevSet.add(id);
            }
            return prevSet;
        });
    };
    const handleChooseSingle = (id: string) => {
        setSelectSingle(id);
    };
    useEffect(() => {
        const quizzes = form.getFieldValue(fieldName as any);
        if (multiple && quizzes?.length > 0) {
            setSelectMultiple(new Set(quizzes));
        } else if (!multiple && quizzes) {
            setSelectSingle(quizzes);
        }
    }, [isOpen]);
    const handleOK = () => {
        if (multiple) {
            form.setFieldValue(fieldName as any, Array.from(selectMultiple));
        } else {
            form.setFieldValue(fieldName as any, selectSingle);
        }
        setSelectSingle(undefined);
        setSelectMultiple(new Set());
        onClose();
    };
    console.log('chooseQuiz.size', selectMultiple.size, selectSingle);
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            title="Chọn đề thi"
            okText="Chọn"
            className="md:min-w-[800px]"
            maskClosable={false}
            cancelText="Hủy"
            onOk={handleOK}
        >
            <div className="space-y-4">
                {/* Header hiển thị số lượng với phong cách Badge mềm */}
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold shadow-sm">
                        Đã chọn: {selectMultiple.size || (selectSingle ? 1 : 0)}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {listMyQuiz.map((quiz) => {
                        const isSelected = selectMultiple.has(quiz._id) || selectSingle === quiz._id;

                        return (
                            <button
                                key={quiz._id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (multiple) handleChooseMultiple(quiz._id);
                                    else handleChooseSingle(quiz._id);
                                }}
                                className={`relative group rounded-2xl transition-all duration-300 ease-out ${
                                    isSelected
                                        ? 'quiz-selected scale-[1.02] ring-2 ring-blue-400 ring-offset-2'
                                        : 'hover:scale-[1.01] opacity-90 hover:opacity-100'
                                }`}
                            >
                                {/* Icon check mark khi được chọn theo style Glass */}
                                {isSelected && (
                                    <div className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce-short">
                                        <i className="fas fa-check text-[10px]"></i>
                                    </div>
                                )}

                                <div
                                    className={`h-full rounded-2xl overflow-hidden ${
                                        !isSelected && 'filter grayscale-[0.3]'
                                    }`}
                                >
                                    <QuizCard quizDetail={quiz} showButton={false} />
                                </div>

                                {/* Lớp phủ mờ nhẹ khi không chọn để làm nổi bật cái được chọn */}
                                {!isSelected && selectMultiple.size > 0 && (
                                    <div className="absolute inset-0 bg-white/10 pointer-events-none rounded-2xl" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};

export default ModalChooseQuiz;
