import { updateQuizQuestion } from '@/api/quiz.service';
import CreateMatchQuestion from '@/components/Quiz/Questions/CreateMatchQuestion';
import OneNNAnswer from '@/components/Quiz/Questions/OneNNAnswer';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    setCurrentQuizPartId,
    setCurrentUpdateQuestionQuizId,
    setQuizDetail,
    setQuizOfQuizDetail,
} from '@/redux/slices/quiz.slice';
import { AnswerType_1_2, BodyUpsertQuestionQuiz, MatchQuestion, QuestionType_1_2 } from '@/types/quiz.type';
import { Button, Col, Form, Input, InputRef, Layout, Modal, Row, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv7 } from 'uuid';
import ChooseQuestion from './ChooseQuestion';
import ChoosePart from './ChoosePart';
import ICON_QUIZ from '@/asset/svgs/quiz';
//region Create question
type QuizSectionInternal = {
    id: string;
    name: string;
};
const initArrAnswers: AnswerType_1_2[] = Array.from<AnswerType_1_2>({ length: 4 }).fill({
    content: '',
    isCorrect: false,
});
const EditQuizQuestionTab = () => {
    const dispatch = useAppDispatch();
    const { listQuestionType } = useAppSelector((state) => state.questionType);
    const { currentQuizPartId, currentUpdateQuestionQuizId, quizDetail } = useAppSelector((state) => state.quiz);
    //   const [currentQuizPartName, setCurrentQuizPartName] = useState("Phần 1"); //lấy sate này để lưu thông tin phần của câu hỏi

    // mảng tên phần thi = > check đã có trong bài thi chưa

    const [form] = Form.useForm<BodyUpsertQuestionQuiz>();
    const questionTypeWatch = Form.useWatch('questionType', form);
    // Xử lý lưu thông tin câu hỏi
    const updateQuestionMutation = useMutationHooks((data: BodyUpsertQuestionQuiz) => updateQuizQuestion(data));
    useEffect(() => {
        if (updateQuestionMutation.isSuccess && updateQuestionMutation.data) {
            dispatch(setQuizDetail(updateQuestionMutation.data));
            toast.success('Lưu thông tin câu hỏi thành công');
            window.scrollTo({
                top: 250,
                behavior: 'smooth', // Lướt mượt mà
            });
        }
        if (updateQuestionMutation.isError) {
            toast.error('Lỗi, không thêm được câu hỏi');
        }
    }, [updateQuestionMutation.isSuccess, updateQuestionMutation.isError]);
    useEffect(() => {
        const question = quizDetail?.quiz
            .find((part) => part.partId === currentQuizPartId)
            ?.questions.find((item) => item.questionId === currentUpdateQuestionQuizId);
        if (question) {
            if ([1, 2].includes(question?.questionType))
                form.setFieldsValue({
                    questionType: question.questionType,
                    answers: (question as QuestionType_1_2).answers,
                    questionContent: (question as QuestionType_1_2).questionContent,
                });
            else if (question.questionType === 3) {
                form.setFieldsValue({
                    questionType: question.questionType,
                    matchQuestions: (question as MatchQuestion).matchQuestions,
                });
            }
        }
    }, [currentUpdateQuestionQuizId, currentQuizPartId]);
    //region handle

    //region submit
    const handleSubmitCreateQuestion = async (formValues: BodyUpsertQuestionQuiz) => {
        if (!quizDetail?._id || !currentQuizPartId || !currentUpdateQuestionQuizId) {
            toast.error('Có lỗi xảy ra');
            return;
        }
        const bodySubmit: BodyUpsertQuestionQuiz = {
            quizId: quizDetail?._id,
            partId: currentQuizPartId,
            questionId: currentUpdateQuestionQuizId,
            partName: quizDetail?.quiz.find((item) => item.partId === currentQuizPartId)?.partName || 'Maquiz',
            questionType: formValues.questionType,
        };
        console.log('bodySubmit', bodySubmit);
        if ([1, 2].includes(formValues?.questionType)) {
            bodySubmit.answers = formValues.answers;
            bodySubmit.questionContent = formValues.questionContent;
        } else if (formValues.questionType === 3) {
            bodySubmit.matchQuestions = formValues.matchQuestions;
        }
        await updateQuestionMutation.mutateAsync(bodySubmit);
    };
    //   region render
    return (
        <>
            <div>
                <Row gutter={[12, 12]}>
                    <Col xs={24} md={8}>
                        <Row gutter={[12, 12]}>
                            <Col xs={24}>
                                <ChoosePart />
                            </Col>
                            <Col xs={24}>
                                {/* 
                                //region Thêm câu hỏi
                                */}
                                <ChooseQuestion />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={16}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmitCreateQuestion}
                            initialValues={{
                                questionType: '01',
                                answers: [...initArrAnswers],
                            }}
                            onValuesChange={(
                                changeValues: Partial<BodyUpsertQuestionQuiz>,
                                formValues: Partial<BodyUpsertQuestionQuiz>,
                            ) => {
                                if (
                                    formValues.questionType === 1 &&
                                    formValues.answers &&
                                    Array.isArray(changeValues.answers)
                                ) {
                                    const idxHasValueChange = changeValues.answers.findIndex(
                                        (item) => item && item.isCorrect,
                                    );
                                    // đáp án 1 chỉ có một đáp án đúng
                                    if (idxHasValueChange !== -1) {
                                        form.setFieldValue(
                                            'answers',
                                            formValues.answers.map((item, idx) => {
                                                if (idx === idxHasValueChange) {
                                                    return {
                                                        ...item,
                                                        isCorrect: true,
                                                    };
                                                }
                                                return { ...item, isCorrect: false };
                                            }),
                                        );
                                    }
                                } else if (changeValues.questionType === 3) {
                                    console.log('OK');
                                    form.setFieldValue('matchQuestions', [
                                        {
                                            match: 1,
                                            questionContent: '',
                                            answer: '',
                                        },
                                    ]);
                                }
                            }}
                        >
                            <div className="rounded-lg px-4 border-2 shadow-sm bg-white">
                                <div className="flex items-center gap-2 h-10">
                                    <p className="font-semibold flex-wrap content-center text-xl">Nội dung câu hỏi</p>
                                    <img src={ICON_QUIZ.icon_board_question} className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <Form.Item<BodyUpsertQuestionQuiz>
                                        name="questionType"
                                        label="Loại câu hỏi"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn loại câu hỏi',
                                            },
                                        ]}
                                    >
                                        <Select
                                            id="questionType"
                                            className="sm:w-full lg:w-56"
                                            placeholder="Chọn loại câu hỏi"
                                            //   onChange={(data, option) => {
                                            //     setQuestionType(data);
                                            //   }}
                                            //   value={questionType}
                                        >
                                            {listQuestionType.map((item) => (
                                                <Select.Option key={item.MaMuc} value={item.MaMuc}>
                                                    {item.TenMuc}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                                {(questionTypeWatch === 1 || questionTypeWatch === 2) && <OneNNAnswer form={form} />}
                                {questionTypeWatch === 3 && <CreateMatchQuestion />}
                                <div className="mt-4 rounded-4xl flex justify-end gap-3 pb-2">
                                    <Button
                                        type="primary"
                                        loading={updateQuestionMutation.isPending}
                                        // className="px-3 py-2 rounded-4xl text-white bg-primary hover:bg-primary-bold hover:scale-110 transition-all ease-in-out"
                                        onClick={form.submit}
                                    >
                                        Lưu
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default EditQuizQuestionTab;
