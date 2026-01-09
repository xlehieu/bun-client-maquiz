'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setExamCurrentPartIndex, setExamCurrentQuestionIndex } from '@/redux/slices/takeExam.slice';
import Aos from 'aos';
import { useEffect } from 'react';
import TakeClassExamMatchQuestion from './TakeClassExamMatchQuestion';
import TakeClassExamSingleMultipleAnswerQuestion from './TakeClassExamSingleMultipleAnswerQuestion';

const ChooseAnswerClassExam = () => {
    const { examDataQuizPart, currentQuestionIndex, currentPartIndex, timePassQuestion, answerChoices } =
        useAppSelector((state) => state.takeExam);
    const dispatch = useAppDispatch();
    const autoNextQuestion = () => {
        const timeoutId = setTimeout(() => {
            if (
                examDataQuizPart?.length &&
                typeof currentPartIndex === 'number' &&
                typeof currentQuestionIndex === 'number'
            ) {
                // kiểm tra xem có phải câu cuối cùng khong
                if (currentQuestionIndex === examDataQuizPart?.[currentPartIndex]?.questions?.length - 1) {
                    if (currentPartIndex === examDataQuizPart?.length - 1) return;
                    else {
                        dispatch(setExamCurrentPartIndex(currentPartIndex + 1));
                        dispatch(setExamCurrentQuestionIndex(0));
                    }
                } else {
                    dispatch(setExamCurrentQuestionIndex(currentQuestionIndex + 1));
                }
            }
        }, timePassQuestion || 2000);
        return () => clearTimeout(timeoutId);
    };
    // CHOOSE ANSWER HANDLING
    //kiểm tra xem câu có question type = 2 đã đúng chưa, so sánh xem đáp án đúng trong quiz detail và answer choice câu hỏi hiện tại có bằng nhau không
    // useEffect(() => {
    //     if (currentQuestionType === 1) {
    //         if (answerChoices?.[currentPartIndex]?.[currentQuestionIndex]) {
    //             autoNextQuestion();
    //         }
    //     } else if (currentQuestionType === 2) {
    //         if (
    //             checkQuestionCorrectQuestionType2(
    //                 {quiz:examDataQuizPart||[]},
    //                 answerChoices,
    //                 currentQuestionType,
    //                 currentPartIndex,
    //                 currentQuestionIndex,
    //             )
    //         )
    //             autoNextQuestion();
    //         // ngược lại nếu chọn đủ các câu thì next
    //         else if (currentPartIndex in answerChoices && currentQuizDetail?.quiz) {
    //             if (
    //                 currentQuestionIndex in answerChoices[currentPartIndex] &&
    //                 currentQuizDetail?.quiz[currentPartIndex]?.questions
    //             ) {
    //                 if (
    //                     !Array.isArray(
    //                         (
    //                             currentQuizDetail?.quiz[currentPartIndex]?.questions[
    //                                 currentQuestionIndex
    //                             ] as QuestionType_1_2
    //                         )?.answers,
    //                     )
    //                 )
    //                     return;
    //                 const lengthAnswersCurrent = (
    //                     currentQuizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex] as QuestionType_1_2
    //                 )?.answers?.length;
    //                 const lengthAnswerChoicesCurrent = (answerChoices[currentPartIndex][currentQuestionIndex] as any)
    //                     ?.length;
    //                 if (lengthAnswersCurrent === lengthAnswerChoicesCurrent) {
    //                     autoNextQuestion();
    //                 }
    //             }
    //         }
    //     }
    // }, [answerChoices]);
    // lặp mảng khi question type = 2 thì lấy ra choose index trong mảng answerChoices của câu hỏi hiện tại,
    // return về true hoặc false nếu đáp án render ở dưới có index === đáp án được chọn trong answerChoices[currentPartIndex][currentQuestionIndex]
    // AOS EFFECT
    useEffect(() => {
        Aos.init({ duration: 500, easing: 'ease-in-out-back' });
        Aos.refresh();
    }, [currentPartIndex, currentQuestionIndex]);
    // END
    return (
        <section
            className="px-2 py-2 flex-1 bg-white rounded-3xl shadow-sm border border-slate-100"
            key={currentQuestionIndex}
            data-aos="zoom-in"
        >
            {[1, 2].includes(
                Number(examDataQuizPart?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.questionType),
            ) && <TakeClassExamSingleMultipleAnswerQuestion autoNextQuestion={autoNextQuestion} />}
            {Number(examDataQuizPart?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.questionType) === 3 && (
                <TakeClassExamMatchQuestion autoNextQuestion={autoNextQuestion} />
            )}
        </section>
    );
};

export default ChooseAnswerClassExam;
