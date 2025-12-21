import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    changeQuizPartName,
    setCurrentQuizPartId,
    setCurrentUpdateQuestionQuizId,
    setQuizOfQuizDetail,
} from '@/redux/slices/quiz.slice';
import { AnswerType_1_2, QuizPart } from '@/types/quiz.type';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Input, InputRef, Modal } from 'antd';
import { Fragment, useRef, useState } from 'react';
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
    const inputRef = useRef<InputRef>(null);
    const [formPart] = Form.useForm<FormField>();
    const handleAddQuizPartName = (formValue: FormField) => {
        try {
            console.log(formValue);
            const value = formValue.partName;
            if (!value) return toast.error('Vui lòng nhập tên phần thi');
            const idx = quizDetail?.quiz.findIndex((item) => item.partName === value);
            if (idx !== -1) {
                return toast.warning('Tên phần thi này đã có trong danh sách ');
            }
            if (formValue.isChange) {
                dispatch(
                    changeQuizPartName({
                        partId: currentQuizPartId,
                        partName: formValue.partName,
                    }),
                );
                formPart.resetFields();
                setIsOpenModal(false);
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
                setIsOpenModal(false);
                formPart.resetFields();
            }
        } catch (err) {
        } finally {
        }
    };
    const handleClickChoosePart = (quizPart: QuizPart) => {
        if (currentQuizPartId === quizPart.partId) {
            setIsOpenModal(true);
            formPart.setFieldValue('partName', quizPart.partName);
            formPart.setFieldValue('isChange', true);
        } else {
            dispatch(setCurrentQuizPartId(quizPart.partId));
            const _questionId = quizPart?.questions?.[0]?.questionId;
            if (_questionId) dispatch(setCurrentUpdateQuestionQuizId(_questionId));
        }
    };
    return (
        <Fragment>
            <div className="py-4 rounded-lg border-2 shadow-sm bg-white">
                <div className="flex justify-between px-4">
                    <p className="font-semibold flex-wrap content-center">Danh sách câu hỏi</p>
                    <Button onClick={() => setIsOpenModal(true)}>
                        <p className="text-primary font-bold">Thêm mới</p>
                    </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 px-4 mt-4">
                    {quizDetail?.quiz.map((quizPart, index) => (
                        <Button
                            key={index}
                            onClick={() => handleClickChoosePart(quizPart)}
                            type={quizPart.partId === currentQuizPartId ? 'primary' : 'default'}
                            className="min-h-[36px]"
                        >
                            {quizPart.partName} <FontAwesomeIcon icon={faEdit} />
                        </Button>
                    ))}
                </div>
            </div>
            <Modal
                // region Modal thêm phần thi
                title="Thêm phần thi"
                open={isOpenModal}
                centered
                onCancel={() => setIsOpenModal(false)}
                footer={
                    <div>
                        <Button onClick={formPart.submit}>Lưu</Button>
                    </div>
                }
            >
                <Form form={formPart} onFinish={handleAddQuizPartName}>
                    <Form.Item<FormField> noStyle hidden name="isChange"></Form.Item>
                    <Form.Item<FormField>
                        name="partName"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên phần thi',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên phần thi" />
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
    );
};

export default ChoosePart;
