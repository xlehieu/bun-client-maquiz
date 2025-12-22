'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentQuestionIndex } from '@/redux/slices/takeQuiz';
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
    //   const {
    //         currentQuizDetail,
    //         currentQuestionIndex,
    //         setCurrentQuestionIndex,
    //         currentPartIndex,
    //         answerChoices,
    //         dispatchAnswerChoices,
    //         timePass,
    //         currentQuestionType,
    //     } = useContext(TakeQuizContext);
    //hàm chuyển câu hỏi (tăng current question index)
    const AutoNextQuestion = () => {
        const timeoutId = setTimeout(() => {
            if (
                currentQuizDetail?._id &&
                typeof currentPartIndex === 'number' &&
                typeof currentQuestionIndex === 'number'
            ) {
                if (currentQuizDetail?.quiz) {
                    // kiểm tra xem có phải câu cuối cùng khong
                    if (
                        currentQuestionIndex === currentQuizDetail?.quiz[currentPartIndex].questions.length - 1 &&
                        currentPartIndex === currentQuizDetail?.quiz?.length - 1
                    )
                        return;
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
                }
            }
        }, timePassQuestion ?? 2000);
        return () => clearTimeout(timeoutId);
    };
    // CHOOSE ANSWER HANDLING
    //kiểm tra xem câu có question type = 2 đã đúng chưa, so sánh xem đáp án đúng trong quiz detail và answer choice câu hỏi hiện tại có bằng nhau không
    useEffect(() => {
        if (currentQuestionType !== 2) return;
        if (
            checkQuestionCorrectQuestionType2(
                currentQuizDetail,
                answerChoices,
                currentQuestionType,
                currentPartIndex,
                currentQuestionIndex,
            )
        )
            AutoNextQuestion();
        // ngược lại nếu chọn đủ các câu thì next
        else if (currentPartIndex in answerChoices && currentQuizDetail?.quiz) {
            if (
                currentQuestionIndex in answerChoices[currentPartIndex] &&
                currentQuizDetail?.quiz[currentPartIndex]?.questions
            ) {
                if (
                    !Array.isArray(
                        (currentQuizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex] as QuestionType_1_2)
                            ?.answers,
                    )
                )
                    return;
                const lengthAnswersCurrent = (
                    currentQuizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex] as QuestionType_1_2
                )?.answers?.length;
                const lengthAnswerChoicesCurrent = answerChoices[currentPartIndex][currentQuestionIndex]?.length;
                if (lengthAnswersCurrent === lengthAnswerChoicesCurrent) {
                    AutoNextQuestion();
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
        <div className="px-2 py-2 flex-1 bg-white rounded shadow" key={currentQuestionIndex} data-aos="zoom-in">
            {/* {currentQuizDetail?.quiz?.[currentPartIndex] && (
        <>
          {currentQuizDetail?.quiz?.[currentPartIndex]?.questions instanceof
            Array && (
            <>
              {currentQuizDetail.quiz[currentPartIndex].questions[
                currentQuestionIndex
              ] && (
                // phần trả lời câu hỏi
                <Fragment>
                  
                </Fragment>
              )}
            </>
          )}
        </>
      )} */}
            {[1, 2].includes(
                Number(currentQuizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.questionType),
            ) && (
                <TakeOneNNAnswers
                    //     currentQuizDetail={currentQuizDetail}
                    //     dispatchAnswerChoices={dispatchAnswerChoices}
                    //     answerChoices={answerChoices}
                    //     currentPartIndex={currentPartIndex}
                    //     currentQuestionIndex={currentQuestionIndex}
                    //     currentQuestionType={currentQuestionType}
                    //     autoNextQuestion={AutoNextQuestion}
                    autoNextQuestion={AutoNextQuestion}
                />
            )}
            {Number(currentQuizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.questionType) ===
                3 && (
                <TakeMatchQuestion
                //     currentQuizDetail={currentQuizDetail}
                //     dispatchAnswerChoices={dispatchAnswerChoices}
                //     answerChoices={answerChoices}
                //     currentPartIndex={currentPartIndex}
                //     currentQuestionIndex={currentQuestionIndex}
                //     currentQuestionType={currentQuestionType}
                //     autoNextQuestion={AutoNextQuestion}
                />
            )}
        </div>
    );
};

export default ChooseAnswer;
