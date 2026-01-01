'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    changeQuizPartName,
    setCurrentQuizPartId,
    setCurrentUpdateQuestionQuizId,
    setQuizOfQuizDetail,
} from '@/redux/slices/quiz.slice';
import { AnswerType_1_2, QuizPart } from '@/types/quiz.type';
import { faEdit, faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Input, Modal } from 'antd';
import { Fragment, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv7 } from 'uuid';

const initArrAnswers: AnswerType_1_2[] = Array.from<AnswerType_1_2>({ length: 4 }).fill({
    content: '',
    isCorrect: false,
});

type FormField = {
    isChange?: boolean;
    partName: string;
};

const ChoosePart = () => {
    const dispatch = useAppDispatch();
    const { quizDetail, currentQuizPartId } = useAppSelector((state) => state.quiz);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [formPart] = Form.useForm<FormField>();

    const handleAddQuizPartName = (formValue: FormField) => {
        const value = formValue.partName?.trim();
        if (!value) return toast.error('Vui lòng nhập tên phần thi');

        const isDuplicate = quizDetail?.quiz.some(
            (item) =>
                item.partName.toLowerCase() === value.toLowerCase() &&
                (formValue.isChange ? item.partId !== currentQuizPartId : true),
        );

        if (isDuplicate) {
            return toast.warning('Tên phần thi này đã tồn tại');
        }

        if (formValue.isChange) {
            dispatch(changeQuizPartName({ partId: currentQuizPartId, partName: value }));
            toast.success('Đã đổi tên phần thi');
        } else {
            const newPartId = uuidv7();
            const newQuestionId = uuidv7();
            dispatch(
                setQuizOfQuizDetail({
                    partId: newPartId,
                    partName: value,
                    questionId: newQuestionId,
                    questionType: 1,
                    answers: [...initArrAnswers],
                    questionContent: '',
                }),
            );
            dispatch(setCurrentQuizPartId(newPartId));
            dispatch(setCurrentUpdateQuestionQuizId(newQuestionId));
            toast.success('Đã thêm phần thi mới');
        }

        setIsOpenModal(false);
        formPart.resetFields();
    };

    const handleClickChoosePart = (quizPart: QuizPart) => {
        if (currentQuizPartId === quizPart.partId) {
            formPart.setFieldsValue({ partName: quizPart.partName, isChange: true });
            setIsOpenModal(true);
        } else {
            dispatch(setCurrentQuizPartId(quizPart.partId));
            const firstQuestionId = quizPart?.questions?.[0]?.questionId;
            if (firstQuestionId) dispatch(setCurrentUpdateQuestionQuizId(firstQuestionId));
        }
    };

    return (
        <Fragment>
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Cấu trúc đề</span>
                <button
                    onClick={() => {
                        formPart.resetFields();
                        setIsOpenModal(true);
                    }}
                    className="flex items-center gap-1.5 text-primary hover:text-primary-bold font-bold text-sm transition-colors group"
                >
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                    </div>
                    Thêm phần
                </button>
            </div>

            <div className="flex flex-col gap-2">
                {quizDetail?.quiz.map((quizPart, index) => {
                    const isActive = quizPart.partId === currentQuizPartId;
                    return (
                        <div
                            key={index}
                            onClick={() => handleClickChoosePart(quizPart)}
                            className={`
                                group relative flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200
                                ${
                                    isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                                        : 'bg-white border border-slate-100 text-slate-600 hover:border-primary/30 hover:bg-slate-50'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        isActive ? 'bg-white animate-pulse' : 'bg-slate-300 group-hover:bg-primary'
                                    }`}
                                ></div>
                                <span className="font-bold truncate max-w-[120px]">{quizPart.partName}</span>
                            </div>

                            <FontAwesomeIcon
                                icon={faEdit}
                                className={`text-xs transition-opacity ${
                                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400'
                                }`}
                            />
                        </div>
                    );
                })}
            </div>

            <Modal
                title={<span className="text-xl font-black text-slate-800">Cấu trúc phần thi</span>}
                open={isOpenModal}
                centered
                onCancel={() => setIsOpenModal(false)}
                footer={null}
                className="custom-modal"
            >
                <Form form={formPart} layout="vertical" onFinish={handleAddQuizPartName} className="mt-4">
                    <Form.Item name="isChange" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="partName"
                        label={<span className="font-bold text-slate-600">Tên phần thi</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập tên phần thi' }]}
                    >
                        <Input
                            placeholder="Ví dụ: Phần 1: Trắc nghiệm khách quan"
                            className="h-12 rounded-xl text-base"
                            autoFocus
                        />
                    </Form.Item>
                    <div className="flex justify-end gap-3 mt-8">
                        <Button
                            onClick={() => setIsOpenModal(false)}
                            className="h-11 px-6 rounded-xl font-bold border-none bg-slate-100 text-slate-500"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            onClick={formPart.submit}
                            className="h-11 px-8 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Xác nhận
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Fragment>
    );
};

export default ChoosePart;
