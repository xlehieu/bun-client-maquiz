'use client';
import { updateQuizQuestion } from '@/api/quiz.service';
import CreateMatchQuestion from '@/components/Quiz/Questions/CreateMatchQuestion';
import OneNNAnswer from '@/components/Quiz/Questions/OneNNAnswer';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setQuizDetail } from '@/redux/slices/quiz.slice';
import { AnswerType_1_2, BodyUpsertQuestionQuiz, MatchQuestion, QuestionType_1_2 } from '@/@types/quiz.type';
import { Button, Col, Form, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import ChooseQuestion from './ChooseQuestion';
import ChoosePart from './ChoosePart';
import ICON_QUIZ from '@/asset/svgs/quiz';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faLayerGroup, faListOl } from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined } from '@ant-design/icons';

const initArrAnswers: AnswerType_1_2[] = Array.from<AnswerType_1_2>({
    length: 4,
}).fill({
    content: '',
    isCorrect: false,
});

const EditQuizQuestionTab = () => {
    const dispatch = useAppDispatch();
    const { listQuestionType } = useAppSelector((state) => state.questionType);
    const { currentQuizPartId, currentUpdateQuestionQuizId, quizDetail } = useAppSelector((state) => state.quiz);

    const [form] = Form.useForm<BodyUpsertQuestionQuiz>();
    const questionTypeWatch = Form.useWatch('questionType', form);

    const updateQuestionMutation = useMutationHooks((data: BodyUpsertQuestionQuiz) => updateQuizQuestion(data));

    useEffect(() => {
        if (updateQuestionMutation.isSuccess && updateQuestionMutation.data) {
            dispatch(setQuizDetail(updateQuestionMutation.data));
            toast.success('Lưu thông tin câu hỏi thành công');
            window.scrollTo({ top: 250, behavior: 'smooth' });
        }
        if (updateQuestionMutation.isError) {
            toast.error('Lỗi, không thêm được câu hỏi');
        }
    }, [updateQuestionMutation.isSuccess, updateQuestionMutation.isError, dispatch]);

    useEffect(() => {
        const question = quizDetail?.quiz
            .find((part) => part.partId === currentQuizPartId)
            ?.questions.find((item) => item.questionId === currentUpdateQuestionQuizId);

        if (question) {
            if ([1, 2].includes(question?.questionType)) {
                form.setFieldsValue({
                    questionType: question.questionType,
                    answers: (question as QuestionType_1_2).answers,
                    questionContent: (question as QuestionType_1_2).questionContent,
                });
            } else if (question.questionType === 3) {
                form.setFieldsValue({
                    questionType: question.questionType,
                    matchQuestions: (question as MatchQuestion).matchQuestions,
                });
            }
        }
    }, [currentUpdateQuestionQuizId, currentQuizPartId, quizDetail, form]);

    const handleSubmitCreateQuestion = async (formValues: BodyUpsertQuestionQuiz) => {
        if (!quizDetail?._id || !currentQuizPartId || !currentUpdateQuestionQuizId) {
            toast.error('Vui lòng chọn câu hỏi để cập nhật');
            return;
        }

        const bodySubmit: BodyUpsertQuestionQuiz = {
            quizId: quizDetail?._id,
            partId: currentQuizPartId,
            questionId: currentUpdateQuestionQuizId,
            partName: quizDetail?.quiz.find((item) => item.partId === currentQuizPartId)?.partName || 'Maquiz',
            questionType: formValues.questionType,
        };

        if ([1, 2].includes(formValues?.questionType)) {
            bodySubmit.answers = formValues.answers;
            bodySubmit.questionContent = formValues.questionContent;
        } else if (formValues.questionType === 3) {
            bodySubmit.matchQuestions = formValues.matchQuestions;
        }

        await updateQuestionMutation.mutateAsync(bodySubmit);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Row gutter={[24, 24]}>
                {/* SIDEBAR: CHOOSE PART & QUESTION */}
                <Col xs={24} lg={8}>
                    <div className="sticky top-6 space-y-6">
                        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                </div>
                                <h5 className="font-bold text-slate-800 m-0">Cấu trúc đề thi</h5>
                            </div>
                            <ChoosePart />
                        </div>

                        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-amber-500">
                                    <FontAwesomeIcon icon={faListOl} />
                                </div>
                                <h5 className="font-bold text-slate-800 m-0">Danh sách câu hỏi</h5>
                            </div>
                            <ChooseQuestion />
                        </div>
                    </div>
                </Col>

                {/* MAIN EDITOR: QUESTION CONTENT */}
                <Col xs={24} lg={16}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmitCreateQuestion}
                        initialValues={{
                            questionType: 1,
                            answers: [...initArrAnswers],
                        }}
                        onValuesChange={(changeValues: Partial<BodyUpsertQuestionQuiz>, formValues) => {
                            if (
                                formValues.questionType === 1 &&
                                formValues.answers &&
                                Array.isArray(changeValues.answers)
                            ) {
                                const idxHasValueChange = changeValues.answers.findIndex(
                                    (item) => item && item.isCorrect,
                                );
                                if (idxHasValueChange !== -1) {
                                    form.setFieldValue(
                                        'answers',
                                        formValues.answers.map((item, idx) => ({
                                            ...item,
                                            isCorrect: idx === idxHasValueChange,
                                        })),
                                    );
                                }
                            } else if (changeValues.questionType === 3) {
                                form.setFieldValue('matchQuestions', [{ match: 1, questionContent: '', answer: '' }]);
                            }
                        }}
                    >
                        <div className="bg-white rounded-[32px] border-2 border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                            {/* Header Editor */}
                            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={ICON_QUIZ.icon_board_question}
                                        className="w-8 h-8 object-contain"
                                        alt="icon"
                                    />
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 leading-none">Câu hỏi</h4>
                                    </div>
                                </div>

                                <Form.Item name="questionType" noStyle>
                                    <Select
                                        className="w-56 custom-select-modern"
                                        placeholder="Loại câu hỏi"
                                        options={listQuestionType.map((item) => ({
                                            label: item.TenMuc,
                                            value: item.MaMuc,
                                        }))}
                                    />
                                </Form.Item>
                            </div>

                            {/* Body Editor */}
                            <section className="px-4">
                                {(questionTypeWatch === 1 || questionTypeWatch === 2) && (
                                    <div className="animate-in zoom-in-95 duration-300">
                                        <OneNNAnswer form={form} />
                                    </div>
                                )}
                                {questionTypeWatch === 3 && (
                                    <div className="animate-in zoom-in-95 duration-300">
                                        <CreateMatchQuestion />
                                    </div>
                                )}
                            </section>

                            {/* Footer Editor */}
                            <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex justify-end items-center gap-4">
                                <Button
                                    type="primary"
                                    onClick={form.submit}
                                    className="h-12 px-10 rounded-xl bg-primary hover:scale-105 transition-all font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    {updateQuestionMutation.isPending ? (
                                        <LoadingOutlined />
                                    ) : (
                                        <FontAwesomeIcon icon={faSave} />
                                    )}
                                    LƯU CÂU HỎI
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default EditQuizQuestionTab;
