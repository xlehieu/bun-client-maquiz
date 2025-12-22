import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React from 'react';
import { checkQuestionCorrectQuestionType2, questionTypeContent } from '../constants';
import { setCurrentQuestionIndex, setCurrentQuestionType } from '@/redux/slices/takeQuiz';

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
                return answerChoices[currentPartIndex][index]?.isCorrect;
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
                    answerChoices?.[currentPartIndex]?.[index]?.every?.(
                        (itemQuestionAnswer: any) => itemQuestionAnswer.question == itemQuestionAnswer.answer,
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
        <div className="px-2 py-2 bg-white rounded shadow w-full">
            <div className="mb-2 flex flex-row justify-between">
                <p>Mục lục câu hỏi</p>
                <p className="text-sm">{questionTypeContent[currentQuestionType || 0] || ''}</p>
            </div>
            <div className="grid grid-cols-5 gap-3 w-full">
                {quizDetail?.quiz[currentPartIndex]?.questions.map((question, index: number) => (
                    <button
                        key={index}
                        onClick={() => {
                            dispatch(setCurrentQuestionIndex(index));

                            dispatch(setCurrentQuestionType(question.questionType));
                        }}
                        className={`${
                            currentQuestionIndex === index ? 'border-primary !bg-primary text-white' : 'border-gray-300'
                        } border-2 rounded-lg min-w-10 h-10 font-medium ${
                            checkCorrectAnswer(index) === true && 'bg-green-700 border-green-700 text-white'
                        } ${checkCorrectAnswer(index) === false && 'bg-red-600 border-red-600 text-white'} 
                        `}
                    >
                        {Number(index + 1)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TableQuestion;
