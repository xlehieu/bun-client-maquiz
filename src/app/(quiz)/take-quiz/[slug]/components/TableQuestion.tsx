import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React from 'react';
import { checkQuestionCorrectQuestionType2, questionTypeContent } from '../constants';
import { setCurrentPartIndex, setCurrentQuestionIndex, setCurrentQuestionType } from '@/redux/slices/takeQuiz.slice';
import { Col, Row } from 'antd';
import { AnswerChoiceType1_2, AnswerChoiceType3 } from '@/types/shared.type';

const TableQuestion = () => {
    const dispatch = useAppDispatch();
    const {
        currentPartIndex,
        answerChoices,
        currentQuizPreviewDetail: quizDetail,
        currentQuestionType,
        currentQuestionIndex,
    } = useAppSelector((state) => state.takeQuiz);
    const checkCorrectAnswer = (index: number) => {
        if (currentPartIndex in (answerChoices || {})) {
            if (
                index in answerChoices[currentPartIndex] &&
                quizDetail?.quiz[currentPartIndex]?.questions[index].questionType === 1
            ) {
                return (answerChoices[currentPartIndex][index] as AnswerChoiceType1_2)?.isCorrect;
            } else if (
                index in answerChoices[currentPartIndex] &&
                quizDetail?.quiz[currentPartIndex]?.questions[index].questionType === 2
            ) {
                return checkQuestionCorrectQuestionType2(quizDetail, answerChoices, 2, currentPartIndex, index);
            } else if (
                index in answerChoices[currentPartIndex] &&
                quizDetail?.quiz[currentPartIndex]?.questions[index].questionType === 3
            ) {
                if (
                    (answerChoices?.[currentPartIndex]?.[index] as AnswerChoiceType3[])?.every?.(
                        (itemQuestionAnswer) => itemQuestionAnswer.question === itemQuestionAnswer.answer,
                    )
                ) {
                    return true;
                }
                return false;
            }
        }
        return null;
    };
    return (
        <section>
            <Row gutter={[12, 12]} className="px-2 py-2 bg-white rounded shadow w-full mb-5">
                <Col xs={24} className="mb-2 flex-1 flex flex-row justify-between">
                    <p>Mục lục phần thi</p>
                </Col>
                <Col xs={24}>
                    <div className="grid grid-cols-2 gap-3 w-full">
                        {quizDetail?.quiz?.map((part, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    dispatch(setCurrentQuestionIndex(0));
                                    dispatch(setCurrentPartIndex(index));
                                }}
                                className={`${
                                    currentPartIndex === index ? 'bg-primary text-white' : 'text-black'
                                } border-2 rounded-lg min-h-10 font-medium transition-all`}
                            >
                                <p className="text-wrap">{part?.partName}</p>
                            </button>
                        ))}
                    </div>
                </Col>
            </Row>
            <Row gutter={[12, 12]} className="px-2 py-2 bg-white rounded shadow w-full">
                <Col xs={24} className="mb-2 flex-1 flex flex-row justify-between">
                    <p>Mục lục câu hỏi</p>
                    <p className="text-sm">{questionTypeContent[currentQuestionType || 0] || ''}</p>
                </Col>
                <Col xs={24}>
                    <div className="grid grid-cols-5 gap-3 w-full">
                        {quizDetail?.quiz[currentPartIndex]?.questions.map((question, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    dispatch(setCurrentQuestionIndex(index));

                                    dispatch(setCurrentQuestionType(question.questionType));
                                }}
                                className={`${
                                    currentQuestionIndex === index
                                        ? 'border-primary !bg-primary text-white'
                                        : 'border-gray-300'
                                } border-2 rounded-lg min-w-10 h-10 font-medium transition-all ${
                                    checkCorrectAnswer(index) === true && 'bg-green-700 border-green-700 text-white'
                                } ${checkCorrectAnswer(index) === false && 'bg-red-600 border-red-600 text-white'} 
                                `}
                            >
                                {Number(index + 1)}
                            </button>
                        ))}
                    </div>
                </Col>
            </Row>
        </section>
    );
};

export default TableQuestion;
