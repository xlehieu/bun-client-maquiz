'use client';
import congratsAnimation from '@/asset/animations/congratulations-2.json';
import Lottie from 'lottie-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
//component
import { QuestionType_1_2, QuizDetailRecord } from '@/@types/quiz.type';
import { AnswerChoices, AnswerChoiceType1_2, AnswerChoiceType3 } from '@/@types/shared.type';
import { saveQuizHistory } from '@/api/quizHistory.service';
import ChatBot from '@/components/UI/ChatBot';
import MAIN_ROUTE from '@/config/routes';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetTakeQuiz } from '@/redux/slices/takeQuiz.slice';
import { Button, Col, Row } from 'antd';
import 'aos/dist/aos.css';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { toast } from 'sonner';
import ChooseAnswer from '../../../../features/takeQuiz/components/ChooseAnswer';
import TableQuestion from '../../../../features/takeQuiz/components/TableQuestion';
import TakeQuizInfo from '../../../../features/takeQuiz/components/TakeQuizInfo';
// Loại 1 chỉ cần có 1 đáp án đúng
// Loại length đáp án đúng = length and all dung đáp án đúng trong quiz
// Tát cả bằng nhau question và answer
const calculateScore = (
    answerChoices: AnswerChoices,
    countQuestionQuizDetail: number,
    quizDetail: QuizDetailRecord,
) => {
    const quiz = [...(quizDetail?.quiz || [])];
    if (typeof answerChoices === 'object' && quiz?.length > 0) {
        let countCorrectAnswer = 0;
        //vào part
        Object.entries(answerChoices).forEach(([keyPart, value]) => {
            // entries trả về mảng, mảng đó lại chứa các mảng [key,value]
            if (typeof value === 'object') {
                //vào question và lấy được giá trị bằng value
                Object.entries(value).forEach(([keyQuestion, valueQuestion]) => {
                    if (
                        quiz?.[Number(keyPart)]?.questions?.[Number(keyQuestion)]?.questionType === 1 &&
                        typeof valueQuestion === 'object' &&
                        (valueQuestion as AnswerChoiceType1_2).isCorrect
                    ) {
                        countCorrectAnswer++;
                    } else if (
                        Array.isArray(valueQuestion) &&
                        quiz?.[Number(keyPart)]?.questions?.[Number(keyQuestion)]?.questionType === 2
                    ) {
                        const _answer = valueQuestion as AnswerChoiceType1_2[];
                        if (
                            (
                                quiz?.[Number(keyPart)]?.questions?.[Number(keyQuestion)] as QuestionType_1_2
                            ).answers?.filter((answer) => answer.isCorrect).length ===
                                _answer.filter((__answer) => __answer.isCorrect).length &&
                            _answer.every((__answer) => __answer.isCorrect)
                        ) {
                            countCorrectAnswer++;
                        }
                    } else if (
                        Array.isArray(valueQuestion) &&
                        quiz?.[Number(keyPart)]?.questions?.[Number(keyQuestion)]?.questionType === 3
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
const TakeQuizPageMain = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {
        answerChoices,
        currentQuizTakeDetail: quizDetail,
        isEnded,
        isTimeout,
        countQuestionQuizDetail,
    } = useAppSelector((state) => state.takeQuiz);
    const slug = useParams()?.slug as string;
    // useEffect(() => {
    //     dispatch(fetchQuizPreview(slug));
    // }, []);
    const [score, setScore] = useState(0);
    const [answerCorrectCount, setAnswerCorrectCount] = useState(0);
    const handleSaveTakeQuizHistory = useMutationHooks((data: any) => saveQuizHistory(data));
    useEffect(() => {
        if (!answerChoices || !quizDetail) return;
        if (isTimeout) {
            toast.warning('Bạn đã hết giờ làm bài');
        }
        if (isEnded || isTimeout) {
            const dataScore = calculateScore(answerChoices, countQuestionQuizDetail, quizDetail);
            setScore(Number(dataScore?.score || 0));
            setAnswerCorrectCount(Number(dataScore?.countCorrectAnswer || 0));
            handleSaveTakeQuizHistory.mutate({
                quizId: quizDetail._id,
                score: dataScore?.score,
                answerChoices,
                quizShuffle: [...quizDetail.quiz],
            });
        }
    }, [isEnded, isTimeout]);
    return (
        <React.Fragment>
            <div className="w-full h-full flex justify-center items-center">
                {!isEnded ? (
                    <section className="flex flex-1 w-full sm:flex-col-reverse gap-3">
                        {quizDetail && (
                            <Row gutter={[19, 12]}>
                                <Col xs={24} md={6}>
                                    <TakeQuizInfo mode="TakeQuiz" />
                                </Col>
                                <Col xs={24} md={12}>
                                    <ChooseAnswer />
                                </Col>
                                <Col xs={24} md={6}>
                                    <TableQuestion />
                                </Col>
                            </Row>
                        )}
                    </section>
                ) : (
                    <div className="relative w-full max-w-4xl mx-auto my-10 p-4">
                        {/* Lottie Animation Layer - Đặt làm Background hoặc Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                            <Lottie className="w-full h-full opacity-50" animationData={congratsAnimation} />
                        </div>

                        <div className="relative z-10 bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white flex flex-col items-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-8 uppercase tracking-wide">
                                Kết Quả Bài Làm
                            </h2>

                            <Row className="w-full" gutter={[24, 24]}>
                                {/* Cột 1: Điểm số - Circular */}
                                <Col xs={24} md={12}>
                                    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-6 items-center h-full transform transition hover:scale-[1.02]">
                                        <h5 className="text-gray-500 font-medium mb-4">Điểm của bạn</h5>
                                        <div className="w-32 md:w-40 relative">
                                            <CircularProgressbar
                                                value={score}
                                                maxValue={10}
                                                strokeWidth={10}
                                                styles={buildStyles({
                                                    pathColor:
                                                        score < 5 ? '#FF6B6B' : score < 7 ? '#FFD93D' : '#51CF66',
                                                    trailColor: '#f1f3f5',
                                                    strokeLinecap: 'round',
                                                })}
                                            />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                                <p className="text-4xl md:text-5xl font-black text-gray-800">{score}</p>
                                                <p className="text-xs text-gray-400 font-bold uppercase">
                                                    Thang điểm 10
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {/* Cột 2: Số câu đúng - Linear */}
                                <Col xs={24} md={12}>
                                    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-6 items-center h-full transform transition hover:scale-[1.02]">
                                        <h5 className="text-gray-500 font-medium mb-4">Độ chính xác</h5>
                                        <div className="mt-3 w-full flex flex-col items-center justify-center flex-1">
                                            <div className="text-5xl mb-2">
                                                {score >= 8 ? '🎯' : score >= 5 ? '👏' : '💪'}
                                            </div>
                                            <LinearProgressBarScore
                                                answerCorrectCount={answerCorrectCount}
                                                max={countQuestionQuizDetail}
                                            />
                                            <div className="mt-4 flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-gray-800">
                                                    {answerCorrectCount}
                                                </span>
                                                <span className="text-xl text-gray-400 font-medium">
                                                    / {countQuestionQuizDetail}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-1 italic">Câu trả lời đúng</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Nút hành động */}
                            <div className="mt-10 w-full flex justify-center">
                                <Button
                                    onClick={() => {
                                        dispatch(resetTakeQuiz());
                                        router.replace(MAIN_ROUTE.DISCOVER_QUIZ);
                                    }}
                                    className="h-auto px-12 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-white font-bold text-lg shadow-lg hover:shadow-indigo-200 hover:scale-105 transition-all"
                                >
                                    OK
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {quizDetail?.isUseChatBot && <ChatBot />}
        </React.Fragment>
    );
};
const LinearProgressBarScore = ({ answerCorrectCount, max }: { answerCorrectCount: number; max: number }) => {
    const percent = Math.min((answerCorrectCount / max) * 100, 100);

    const getColor = (percent: number) => {
        if (percent < 50) return 'linear-gradient(90deg, #FF6B6B, #FF8787)'; // Đỏ san hô
        if (percent < 80) return 'linear-gradient(90deg, #FFD93D, #FFEC99)'; // Vàng nắng
        return 'linear-gradient(90deg, #51CF66, #94D82D)'; // Xanh lá dịu
    };

    return (
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner border border-gray-50">
            <div
                style={{
                    width: `${percent}%`,
                    background: getColor(percent),
                    transition: 'width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
                className="h-full rounded-full"
            />
        </div>
    );
};
export default TakeQuizPageMain;
