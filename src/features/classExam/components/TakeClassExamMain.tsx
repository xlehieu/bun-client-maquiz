'use client';
import congratsAnimation from '@/asset/animations/congratulations-2.json';
import Lottie from 'lottie-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
//component
import { ClassExamItem, ExamAttempt } from '@/@types/classExam.type';
import { QuestionType_1_2, QuizPart } from '@/@types/quiz.type';
import { AnswerChoices, AnswerChoiceType1_2, AnswerChoiceType3 } from '@/@types/shared.type';
import MAIN_ROUTE, { getRouteConfigParam, USER_DASHBOARD_ROUTER } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button, Col, Row } from 'antd';
import 'aos/dist/aos.css';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { toast } from 'sonner';
import { useUpdateAnswerChoices, useUpdateScoreStatus } from '../classExam.mutation';
import ChooseAnswerClassExam from './ChooseAnswerClassExam';
import TableClassExamQuestion from './TableClassExamTableQuestion';
import TakeClassExamInfo from './TakeClassExamInfo';
import { resetTakeExam, setExamAnswerChoices } from '@/redux/slices/takeExam.slice';
// Loại 1 chỉ cần có 1 đáp án đúng
// Loại length đáp án đúng = length and all dung đáp án đúng trong quiz
// Tát cả bằng nhau question và answer
const calculateScore = (answerChoices: AnswerChoices, countQuestionQuizDetail: number, dataQuizPart: QuizPart[]) => {
    if (typeof answerChoices === 'object' && dataQuizPart?.length > 0) {
        let countCorrectAnswer = 0;
        //vào part
        Object.entries(answerChoices).forEach(([keyPart, value]) => {
            // entries trả về mảng, mảng đó lại chứa các mảng [key,value]
            if (typeof value === 'object') {
                //vào question và lấy được giá trị bằng value
                Object.entries(value).forEach(([keyQuestion, valueQuestion]) => {
                    if (
                        dataQuizPart?.[Number(keyPart)]?.questions?.[Number(keyQuestion)]?.questionType === 1 &&
                        typeof valueQuestion === 'object' &&
                        (valueQuestion as AnswerChoiceType1_2).isCorrect
                    ) {
                        countCorrectAnswer++;
                    } else if (
                        Array.isArray(valueQuestion) &&
                        dataQuizPart?.[Number(keyPart)]?.questions?.[Number(keyQuestion)]?.questionType === 2
                    ) {
                        const _answer = valueQuestion as AnswerChoiceType1_2[];
                        if (
                            (
                                dataQuizPart?.[Number(keyPart)]?.questions?.[Number(keyQuestion)] as QuestionType_1_2
                            ).answers?.filter((answer) => answer.isCorrect).length ===
                                _answer.filter((__answer) => __answer.isCorrect).length &&
                            _answer.every((__answer) => __answer.isCorrect)
                        ) {
                            countCorrectAnswer++;
                        }
                    } else if (
                        Array.isArray(valueQuestion) &&
                        dataQuizPart?.[Number(keyPart)]?.questions?.[Number(keyQuestion)]?.questionType === 3
                    ) {
                        const _answer: AnswerChoiceType3[] = (valueQuestion as AnswerChoiceType3[]).map((item) => {
                            return {
                                match: item.match,
                                question: item.question.replace('question', ''),
                                answer: item?.answer?.replace?.('answer', '') || '',
                            };
                        });
                        if (_answer.every((__answer) => __answer?.answer === __answer.question)) {
                            countCorrectAnswer++;
                        }
                    }
                });
            }
        });
        return {
            score: Number(((countCorrectAnswer / countQuestionQuizDetail) * 10).toFixed(2)),
            countCorrectAnswer,
        };
    }
};
const TakeClassExamMain = ({
    currentClassExam,
    currentExamAttempt,
}: {
    currentClassExam: ClassExamItem;
    currentExamAttempt: ExamAttempt;
}) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { classCode } = useParams<{
        classCode: string;
    }>();
    const { mutate: updateAnswerChoices } = useUpdateAnswerChoices();
    const { mutate: updateScoreStatus } = useUpdateScoreStatus();
    const {
        answerChoices,
        examDataQuizPart,
        isEnded,
        isTimeout,
        countQuestionQuizExam: countQuestionQuizDetail,
    } = useAppSelector((state) => state.takeExam);
    // const [score, setScore] = useState(0);
    const [answerCorrectCount, setAnswerCorrectCount] = useState(0);
    // const handleSaveTakeExam = useMutationHooks((data: any) => saveQuizHistory(data));
    useEffect(() => {
        if (!answerChoices || !examDataQuizPart) return;
        let timeoutId: NodeJS.Timeout | null = null;
        if (isTimeout) {
            toast.warning('Bạn đã hết giờ làm bài');
        }
        if (isEnded || isTimeout) {
            const dataScore = calculateScore(answerChoices, countQuestionQuizDetail, examDataQuizPart);
            // setScore(Number(dataScore?.score || 0));
            setAnswerCorrectCount(Number(dataScore?.countCorrectAnswer || 0));
            // handleSaveTakeExam.mutate({
            //     quizId: quizDetail._id,
            //     score: dataScore?.score,
            //     answerChoices,
            //     quizShuffle: [...quizDetail.quiz],
            // });
            updateScoreStatus({
                classExamId: currentExamAttempt._id,
                body: {
                    score: dataScore?.score || 0,
                    status: isEnded ? 'submitted' : 'timeout',
                    answerChoices,
                },
            });
            timeoutId = setTimeout(() => {
                dispatch(resetTakeExam());
                const routeBackReplace = getRouteConfigParam(USER_DASHBOARD_ROUTER.CLASSROOM_DETAIL_PARAM, [classCode]);
                router.replace(routeBackReplace);
            }, 5000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isEnded, isTimeout]);
    // const updateAnswerChoices =
    useEffect(() => {
        if (Object.keys(answerChoices).length > 0) {
            updateAnswerChoices({
                classExamId: currentExamAttempt._id,
                answerChoices,
            });
        }
    }, [answerChoices]);
    return (
        <React.Fragment>
            <div className="w-full h-full flex justify-center items-center">
                <section className="flex flex-1 w-full sm:flex-col-reverse gap-3">
                    {examDataQuizPart && (
                        <Row gutter={[19, 12]}>
                            <Col xs={24} md={6}>
                                <TakeClassExamInfo />
                            </Col>
                            <Col xs={24} md={12}>
                                <ChooseAnswerClassExam />
                            </Col>
                            <Col xs={24} md={6}>
                                <TableClassExamQuestion />
                            </Col>
                        </Row>
                    )}
                </section>
            </div>
        </React.Fragment>
    );
};

export default TakeClassExamMain;
