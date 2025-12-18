import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentQuestionIndex } from '@/redux/slices/takeQuiz';
import Aos from 'aos';
import React, { Fragment, useEffect } from 'react';
import { checkQuestionCorrectQuestionType2 } from '../constants';
import TakeOneNNAnswers from '@/components/Quiz/TakeQuiz/TakeOneNNAnswers';
import TakeMatchQuestion from '@/components/Quiz/TakeQuiz/TakeMatchQuestion';

const ChooseAnswer = () => {
    const {
        currentQuizDetail,
        currentQuestionIndex,
        currentSectionIndex,
        timePassQuestion,
        answerChoices,
        currentQuestionType,
    } = useAppSelector((state) => state.takeQuiz);
    const dispatch = useAppDispatch();
    //   const {
    //         currentQuizDetail,
    //         currentQuestionIndex,
    //         setCurrentQuestionIndex,
    //         currentSectionIndex,
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
                typeof currentSectionIndex === 'number' &&
                typeof currentQuestionIndex === 'number'
            ) {
                if (currentQuizDetail?.quiz) {
                    // kiểm tra xem có phải câu cuối cùng khong
                    if (
                        currentQuestionIndex === currentQuizDetail?.quiz[currentSectionIndex].questions.length - 1 &&
                        currentSectionIndex === currentQuizDetail?.quiz?.length - 1
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
                currentSectionIndex,
                currentQuestionIndex,
            )
        )
            AutoNextQuestion();
        // ngược lại nếu chọn đủ các câu thì next
        else if (currentSectionIndex in answerChoices && currentQuizDetail?.quiz) {
            if (
                currentQuestionIndex in answerChoices[currentSectionIndex] &&
                currentQuizDetail?.quiz[currentSectionIndex]?.questions
            ) {
                if (
                    !Array.isArray(
                        currentQuizDetail?.quiz[currentSectionIndex]?.questions[currentQuestionIndex]?.answers,
                    )
                )
                    return;
                const lengthAnswersCurrent =
                    currentQuizDetail?.quiz[currentSectionIndex]?.questions[currentQuestionIndex]?.answers?.length;
                const lengthAnswerChoicesCurrent = answerChoices[currentSectionIndex][currentQuestionIndex]?.length;
                if (lengthAnswersCurrent === lengthAnswerChoicesCurrent) {
                    AutoNextQuestion();
                }
            }
        }
    }, [answerChoices]);
    // lặp mảng khi question type = 2 thì lấy ra choose index trong mảng answerChoices của câu hỏi hiện tại,
    // return về true hoặc false nếu đáp án render ở dưới có index === đáp án được chọn trong answerChoices[currentSectionIndex][currentQuestionIndex]
    // AOS EFFECT
    useEffect(() => {
        Aos.init({ duration: 500, easing: 'ease-in-out-back' });
        Aos.refresh();
    }, [currentSectionIndex, currentQuestionIndex]);
    // END
    return (
        <div className="px-2 py-2 flex-1 bg-white rounded shadow" key={currentQuestionIndex} data-aos="zoom-in">
            {currentQuizDetail?.quiz[currentSectionIndex] && (
                <>
                    {currentQuizDetail?.quiz?.[currentSectionIndex]?.questions instanceof Array && (
                        <>
                            {currentQuizDetail.quiz[currentSectionIndex].questions[currentQuestionIndex] && (
                                // phần trả lời câu hỏi
                                <Fragment>
                                    {[1, 2].includes(currentQuestionType || 0) && (
                                        <TakeOneNNAnswers
                                            currentQuizDetail={currentQuizDetail}
                                            dispatchAnswerChoices={dispatchAnswerChoices}
                                            answerChoices={answerChoices}
                                            currentSectionIndex={currentSectionIndex}
                                            currentQuestionIndex={currentQuestionIndex}
                                            currentQuestionType={currentQuestionType}
                                            autoNextQuestion={AutoNextQuestion}
                                        />
                                    )}
                                    {Number(currentQuestionType) === 3 && (
                                        <TakeMatchQuestion
                                            currentQuizDetail={currentQuizDetail}
                                            dispatchAnswerChoices={dispatchAnswerChoices}
                                            answerChoices={answerChoices}
                                            currentSectionIndex={currentSectionIndex}
                                            currentQuestionIndex={currentQuestionIndex}
                                            currentQuestionType={currentQuestionType}
                                            autoNextQuestion={AutoNextQuestion}
                                        />
                                    )}
                                </Fragment>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ChooseAnswer;
