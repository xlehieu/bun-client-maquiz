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
const initArrAnswers: AnswerType_1_2[] = Array.from<AnswerType_1_2>({ length: 4 }).fill({
    content: '',
    isCorrect: false,
});
const ChooseQuestion = () => {
    const dispatch = useAppDispatch();
    const { quizDetail, currentQuizPartId, currentUpdateQuestionQuizId } = useAppSelector((state) => state.quiz);
    const handleAddQuestion = () => {
        const questionId = uuidv7();
        const part = quizDetail?.quiz.find((item) => item.partId === currentQuizPartId)?.partName;
        if (!part) return toast.error('Lỗi');
        dispatch(
            setQuizOfQuizDetail({
                partId: currentQuizPartId,
                partName: part,
                questionId,
                questionType: 1,
                answers: [...initArrAnswers],
                questionContent: '',
            }),
        );
        dispatch(setCurrentUpdateQuestionQuizId(questionId));
    };
    return (
        <div className="py-4 rounded-lg border-2 shadow-sm bg-white">
            <div className="flex justify-between px-4">
                <p className="font-semibold flex-wrap content-center">Danh sách câu hỏi</p>
                <Button onClick={() => handleAddQuestion()}>
                    <p className="text-primary font-bold">Thêm câu hỏi mới</p>
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 px-4 mt-4">
                {quizDetail?.quiz
                    .find((quizSection) => quizSection.partId == currentQuizPartId)
                    ?.questions?.map((quizContent, index) => (
                        <Button
                            key={index}
                            onClick={() => {
                                dispatch(setCurrentUpdateQuestionQuizId(quizContent.questionId));
                            }}
                            type={quizContent.questionId === currentUpdateQuestionQuizId ? 'primary' : 'default'}
                            className="min-h-[36px]"
                        >
                            {index + 1}
                        </Button>
                    ))}
            </div>
        </div>
    );
};

export default ChooseQuestion;
