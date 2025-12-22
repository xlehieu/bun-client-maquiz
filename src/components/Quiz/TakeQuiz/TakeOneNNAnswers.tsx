'use client';
import QuizDetail from '@/app/admin/quizzes-management/QuizDetail';
import { ANSWER_CHOICE_ACTION, questionTypeContent } from '@/common/constants';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { chooseQuestionType1, chooseQuestionType2 } from '@/redux/slices/takeQuiz';
import { QuestionType_1_2 } from '@/types/quiz.type';
import { Checkbox, Radio } from 'antd';
import HTMLReactParser from 'html-react-parser/lib/index';
import React from 'react';

// Phần  giữa (chọn đáp án)
const sanitizeHTML = (html: any) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.body.querySelectorAll('p,span');

    elements.forEach((el: any) => {
        if (el.style && el.style.backgroundColor) {
            el.style.backgroundColor = ''; // Loại bỏ background-color
            el.style.color = ''; // Loại bỏ color
        }
    });

    return doc.body.innerHTML;
};
const TakeOneNNAnswers = ({ autoNextQuestion }: { autoNextQuestion: () => void }) => {
    const {
        currentQuizPreviewDetail: currentQuizDetail,
        currentQuestionIndex,
        currentPartIndex,
        currentQuestionType,
        answerChoices,
    } = useAppSelector((state) => state.takeQuiz);
    // const handleChooseAnswer = (chooseIndex: number) => {
    //     // nếu không có current part index trong answer choice rồi thì xuống thực hiện code phía dưới
    //     // nếu có thì check xem có curent question index trong answer choice chưa nếu có thì return vì đã trả lời rồi thì không được làm lại nữa
    //     if (currentQuestionType == 1 && answerChoices[currentPartIndex])
    //         if (currentQuestionIndex in answerChoices[currentPartIndex]) return;
    //     if (currentQuestionType == 1) {
    //         dispatchAnswerChoices({
    //             type: ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_1,
    //             payload: {
    //                 currentPartIndex,
    //                 currentQuestionIndex,
    //                 chooseIndex: chooseIndex,
    //                 isCorrect:
    //                     currentQuizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]?.answers[
    //                         chooseIndex
    //                     ]?.isCorrect,
    //             },
    //         });
    //         autoNextQuestion();
    //     } else if (currentQuestionType == 2) {
    //         dispatchAnswerChoices({
    //             type: ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_2,
    //             payload: {
    //                 currentPartIndex,
    //                 currentQuestionIndex,
    //                 chooseIndex: chooseIndex,
    //                 isCorrect:
    //                     currentQuizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]?.answers[
    //                         chooseIndex
    //                     ]?.isCorrect,
    //             },
    //         });
    //     }
    // };
    const dispatch = useAppDispatch();
    const handleGetChooseIndexAnswer = (indexInRenderAnswer: number) => {
        if (currentQuestionType === 1 && currentPartIndex in (answerChoices || {})) {
            if (currentQuestionIndex in answerChoices[currentPartIndex]) {
                if (answerChoices[currentPartIndex][currentQuestionIndex].chooseIndex === indexInRenderAnswer)
                    return true;
            }
        }
        if (currentQuestionType === 2 && currentPartIndex in answerChoices) {
            const choices = answerChoices[currentPartIndex][currentQuestionIndex];
            if (Array.isArray(choices)) {
                // tìm xem trong answer choice có index render không? nếu có thì return về isCorrect của nó
                const foundChoice = choices.find((choice) => choice.chooseIndex == indexInRenderAnswer);
                return foundChoice ? true : false;
            }
        }
        return false;
    };
    const handleGetIsCorrectAnswer = (indexInRenderAnswer: number) => {
        if (currentQuestionType == 2 && currentPartIndex in answerChoices) {
            const choices = answerChoices[currentPartIndex][currentQuestionIndex];
            if (Array.isArray(choices)) {
                // tìm xem trong answer choice có index render không? nếu có thì return về isCorrect của nó
                const foundChoice = choices.find((choice) => choice.chooseIndex === indexInRenderAnswer);
                return foundChoice ? foundChoice.isCorrect : null;
            }
        }
        return null;
    };
    const handleChooseAnswerQuestion1 = (chooseIndex: number, isCorrect: boolean) => {
        if (answerChoices?.[currentPartIndex]?.[currentQuestionIndex]) return;
        dispatch(
            chooseQuestionType1({
                currentPartIndex,
                currentQuestionIndex,
                chooseIndex,
                isCorrect,
            }),
        );
    };
    const handleChooseAnswerQuestion2 = (chooseIndex: number, isCorrect: boolean) => {
        dispatch(
            chooseQuestionType2({
                currentPartIndex,
                currentQuestionIndex,
                chooseIndex,
                isCorrect,
            }),
        );
    };
    return (
        <div>
            <>
                <div className="flex justify-between items-center">
                    <p>Câu {currentQuestionIndex + 1}</p>
                    <p className="text-sm text-gray-500">
                        {/*lấy kiểu câu hỏi - Một đáp án or nhiều đáp án*/}
                        {questionTypeContent?.[currentQuestionType || 1]}
                    </p>
                </div>
                <div className="my-2 font-medium">
                    {/* Hiển thị nội dung câu hỏi */}
                    {HTMLReactParser(
                        (currentQuizDetail?.quiz[currentPartIndex].questions[currentQuestionIndex] as QuestionType_1_2)
                            .questionContent || '',
                    )}
                </div>
                <div className="flex flex-col gap-5">
                    {/* Render các câu trả lời và chọn */}

                    {(
                        currentQuizDetail?.quiz[currentPartIndex].questions[currentQuestionIndex] as QuestionType_1_2
                    ).answers.map((answer, index: number) => (
                        <label key={index} className="flex items-center select-none space-x-2 cursor-pointer">
                            {/* Kiểm tra xem kiểu câu hỏi hiện tại là gì (hàm set ở trên provider)*/}
                            {currentQuizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]
                                ?.questionType === 1 ? (
                                <Radio
                                    //   type={currentQuestionType == 1 ? "radio" : "checkbox"}
                                    onChange={(e) => {
                                        // console.log(e.target.)
                                        handleChooseAnswerQuestion1(index, answer.isCorrect);
                                    }}
                                    checked={handleGetChooseIndexAnswer(index)}
                                    className="w-5 h-5"
                                ></Radio>
                            ) : (
                                <Checkbox
                                    onChange={(e) => {
                                        // console.log(e.target.)
                                        handleChooseAnswerQuestion2(index, answer.isCorrect);
                                    }}
                                    checked={handleGetChooseIndexAnswer(index)}
                                    className="w-5 h-5"
                                />
                            )}

                            {/* Đây là render bằng mảng nên để tránh việc chưa trả lời mà đáp án đã tích thì phải đủ điều kiện
                                    chỉ số phần thi hiện tại ở trong answerChoice(provider) và có thằng đáp án hiện tại sau khi chọn
                                    tiếp theo thêm điều kiện đáp án đúng của câu hỏi
                          
                                    Khi trả lời sai thì tất render màu đỏ bằng cách chỉ số câu trả lời khi render và chỉ số câu trả lời đã lưu trong anserchoice phải bằng nhau
                                    thứ 2 trong answerChoice isCorrect phải bằng false
                                    */}
                            <div
                                className={
                                    currentQuestionType == 1
                                        ? `${
                                              currentPartIndex in answerChoices &&
                                              answerChoices[currentPartIndex][currentQuestionIndex] &&
                                              answer.isCorrect &&
                                              '!bg-green-700 text-white'
                                          } ${
                                              currentPartIndex in answerChoices &&
                                              answerChoices[currentPartIndex][currentQuestionIndex]?.isCorrect ===
                                                  false &&
                                              answerChoices[currentPartIndex][currentQuestionIndex]?.chooseIndex ===
                                                  index &&
                                              '!bg-red-600 !text-white'
                                          } px-2`
                                        : `${handleGetIsCorrectAnswer(index) === true && '!bg-green-700 !text-white'}
                        ${handleGetIsCorrectAnswer(index) === false && '!bg-red-600 !text-white'}
                        `
                                }
                            >
                                {HTMLReactParser(sanitizeHTML(answer.content))}
                            </div>
                        </label>
                    ))}
                </div>
            </>
        </div>
    );
};

export default TakeOneNNAnswers;
