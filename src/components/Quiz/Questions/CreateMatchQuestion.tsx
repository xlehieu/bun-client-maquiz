'use client';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IQuiz } from '@/interface';
const initValue = [{ match: 1, questionContent: '', answer: '' }];
const CreateMatchQuestion = ({
    quizDetail,
    setQuiz,
    currentPartIndex,
    currentQuestionIndex,
    onSendMatchQuestion,
}: any) => {
    const [matchQuestions, setMatchQuestions] = useState(
        quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.matchQuestions || [...initValue],
    );

    const handleAddAnswer = () => {
        const newMatch = matchQuestions?.length + 1;
        setMatchQuestions([...matchQuestions, { match: newMatch, questionContent: '', answer: '' }]);
    };
    const handleChangeQuestionNAnswer = (type: string, match: number | string, value: string) => {
        setMatchQuestions((preValue: any) => {
            if (!match) return preValue;
            const newValue = [...preValue];
            const idx = newValue.findIndex((item) => {
                return item.match === match;
            });
            console.log(idx);
            if (idx !== -1) {
                newValue[idx][type] = value;
            }
            return newValue;
        });
    };
    useEffect(() => {
        if (typeof onSendMatchQuestion === 'function') onSendMatchQuestion(matchQuestions);
        if (typeof setQuiz === 'function') {
            setQuiz((preValue: IQuiz) => {
                const newQuizDetail = { ...preValue };
                if (Number.isInteger(currentPartIndex) && Number.isInteger(currentQuestionIndex) && newQuizDetail?.quiz)
                    newQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex] = {
                        questionType: newQuizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.questionType,
                        matchQuestions,
                    };
                return newQuizDetail;
            });
        }
    }, [matchQuestions]);
    // useEffect(() => {
    //     if (quizDetail)
    //         setMatchQuestions(
    //             quizDetail?.quiz?.[currentPartIndex]?.question?.[currentQuestionIndex]?.matchQuestions || [
    //                 ...initValue,
    //             ],
    //         );
    // }, [quizDetail]);
    return (
        <div className="flex flex-col">
            <h2 className="text-xl text-camdat font-bold">Thêm câu hỏi và đáp án tương ứng</h2>
            <div className="space-y-2">
                {matchQuestions?.map((question: any) => (
                    <div key={question.match} className="flex items-center justify-between gap-3 py-5">
                        <Input
                            type="text"
                            value={question?.questionContent}
                            placeholder="Câu hỏi"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChangeQuestionNAnswer('questionContent', question?.match, e.target.value)
                            }
                        />
                        <Input
                            type="text"
                            value={question?.answer}
                            placeholder="Đáp án"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChangeQuestionNAnswer('answer', question?.match, e.target.value)
                            }
                        />
                        <button className="text-lg text-red-500 hover:text-red-700">
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={handleAddAnswer}
                className={
                    'w-full py-3 rounded-md hover:rounded-2xl border-4 border-dashed border-primary hover:opacity-50 transition-all ease-in hover:scale-95'
                }
            >
                <span className="text-primary font-bold">
                    <PlusOutlined className="text-xl pr-2" />
                    Thêm đáp án
                </span>
            </button>
        </div>
    );
};

export default CreateMatchQuestion;
