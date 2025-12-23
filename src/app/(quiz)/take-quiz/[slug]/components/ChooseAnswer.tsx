'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentPartIndex, setCurrentQuestionIndex } from '@/redux/slices/takeQuiz.slice';
import Aos from 'aos';
import React, { Fragment, useEffect } from 'react';
import { checkQuestionCorrectQuestionType2 } from '../constants';
import TakeOneNNAnswers from '@/components/Quiz/TakeQuiz/TakeOneNNAnswers';
import TakeMatchQuestion from '@/components/Quiz/TakeQuiz/TakeMatchQuestion';
import { QuestionType_1_2 } from '@/types/quiz.type';

const ChooseAnswer = () => {
    const {
        currentQuizPreviewDetail: currentQuizDetail,
        currentQuestionIndex,
        currentPartIndex,
        timePassQuestion,
        answerChoices,
        currentQuestionType,
    } = useAppSelector((state) => state.takeQuiz);
    const dispatch = useAppDispatch();
    const autoNextQuestion = () => {
        const timeoutId = setTimeout(() => {
            if (
                currentQuizDetail?._id &&
                typeof currentPartIndex === 'number' &&
                typeof currentQuestionIndex === 'number'
            ) {
                if (currentQuizDetail?.quiz) {
                    // kiểm tra xem có phải câu cuối cùng khong
                    if (currentQuestionIndex === currentQuizDetail?.quiz?.[currentPartIndex]?.questions?.length - 1) {
                        if (currentPartIndex === currentQuizDetail?.quiz?.length - 1) return;
                        else {
                            dispatch(setCurrentPartIndex(currentPartIndex + 1));
                            dispatch(setCurrentQuestionIndex(0));
                        }
                    } else {
                        dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
                    }
                }
            }
        }, timePassQuestion || 2000);
        return () => clearTimeout(timeoutId);
    };
    // CHOOSE ANSWER HANDLING
    //kiểm tra xem câu có question type = 2 đã đúng chưa, so sánh xem đáp án đúng trong quiz detail và answer choice câu hỏi hiện tại có bằng nhau không
    useEffect(() => {
        if (currentQuestionType === 1) {
            if (answerChoices?.[currentPartIndex]?.[currentQuestionIndex]) {
                autoNextQuestion();
            }
        } else if (currentQuestionType === 2) {
            if (
                checkQuestionCorrectQuestionType2(
                    currentQuizDetail,
                    answerChoices,
                    currentQuestionType,
                    currentPartIndex,
                    currentQuestionIndex,
                )
            )
                autoNextQuestion();
            // ngược lại nếu chọn đủ các câu thì next
            else if (currentPartIndex in answerChoices && currentQuizDetail?.quiz) {
                if (
                    currentQuestionIndex in answerChoices[currentPartIndex] &&
                    currentQuizDetail?.quiz[currentPartIndex]?.questions
                ) {
                    if (
                        !Array.isArray(
                            (
                                currentQuizDetail?.quiz[currentPartIndex]?.questions[
                                    currentQuestionIndex
                                ] as QuestionType_1_2
                            )?.answers,
                        )
                    )
                        return;
                    const lengthAnswersCurrent = (
                        currentQuizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex] as QuestionType_1_2
                    )?.answers?.length;
                    const lengthAnswerChoicesCurrent = (answerChoices[currentPartIndex][currentQuestionIndex] as any)
                        ?.length;
                    if (lengthAnswersCurrent === lengthAnswerChoicesCurrent) {
                        autoNextQuestion();
                    }
                }
            }
        }
    }, [answerChoices]);
    // lặp mảng khi question type = 2 thì lấy ra choose index trong mảng answerChoices của câu hỏi hiện tại,
    // return về true hoặc false nếu đáp án render ở dưới có index === đáp án được chọn trong answerChoices[currentPartIndex][currentQuestionIndex]
    // AOS EFFECT
    useEffect(() => {
        Aos.init({ duration: 500, easing: 'ease-in-out-back' });
        Aos.refresh();
    }, [currentPartIndex, currentQuestionIndex]);
    // END
    return (
        <section className="px-2 py-2 flex-1 bg-white rounded shadow" key={currentQuestionIndex} data-aos="zoom-in">
            {[1, 2].includes(
                Number(currentQuizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.questionType),
            ) && <TakeOneNNAnswers />}
            {Number(currentQuizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.questionType) ===
                3 && <TakeMatchQuestion />}
        </section>
    );
};

export default ChooseAnswer;
