'use client';
import congratsAnimation from '@/asset/animations/congratulations-2.json';
import Lottie from 'lottie-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
//component
import { ANSWER_CHOICE_ACTION } from '@/common/constants';
import ChatBot from '@/components/UI/ChatBot';
import MAIN_ROUTE from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchQuizPreview, resetTakeQuiz } from '@/redux/slices/takeQuiz.slice';
import { Button, Col, Row } from 'antd';
import 'aos/dist/aos.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { toast } from 'sonner';
import ChooseAnswer from './components/ChooseAnswer';
import TableQuestion from './components/TableQuestion';
import TakeQuizInfo from './components/TakeQuizInfo';
import { AnswerChoices, AnswerChoiceType1_2, AnswerChoiceType3 } from '@/types/shared.type';
import { QuestionType_1_2, QuizDetailRecord } from '@/types/quiz.type';
import useMutationHooks from '@/hooks/useMutationHooks';
import { saveQuizHistory } from '@/api/quizHistory.service';
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
        return { score: Number(((countCorrectAnswer / countQuestionQuizDetail) * 10).toFixed(2)), countCorrectAnswer };
    }
};
const TakeQuizPageMain = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {
        answerChoices,
        currentQuizPreviewDetail: quizDetail,
        isEnded,
        isTimeout,
        countQuestionQuizDetail,
    } = useAppSelector((state) => state.takeQuiz);
    console.log('quizDetailquizDetailquizDetail', quizDetail);
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
                                <Col xs={24} md={5}>
                                    <TakeQuizInfo />
                                </Col>
                                <Col xs={24} md={13}>
                                    <ChooseAnswer />
                                </Col>
                                <Col xs={24} md={6}>
                                    <TableQuestion />
                                </Col>
                            </Row>
                        )}
                    </section>
                ) : (
                    <div className="inset-0 relative w-full mx-5 my-5 md:mx-10 md:my-10">
                        <div className="text-black w-full bg-white shadow rounded px-5 py-5 flex flex-col items-center justify-center">
                            <Row className="w-full" gutter={[12, 12]}>
                                <Col xs={24} md={8}>
                                    <div className="flex flex-col rounded-lg shadow-md border px-3 py-3 items-center h-full">
                                        <h5 className="text-[20px]">Điểm của bạn là:</h5>
                                        <div className="w-full md:w-1/2 mt-3 relative">
                                            <CircularProgressbar
                                                styles={buildStyles({
                                                    textSize: '39px',
                                                    pathColor:
                                                        score < 5 ? '#ff0000' : score < 7 ? '#ffff00' : '#00ff00',
                                                    textColor: '#333',
                                                    trailColor: '#eee',
                                                })}
                                                // className="flex justify-between items-center"
                                                value={score}
                                                maxValue={10}
                                                // text={`${score}`}
                                            />
                                            <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2">
                                                <p className="text-[39px] text-primary-bold font-semibold">{score}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div className="flex flex-col rounded-lg shadow-md border px-3 py-3 items-center h-full">
                                        <h5 className="text-[20px]">Số câu đúng</h5>
                                        <div className="mt-3 w-full flex flex-col items-center justify-center flex-1 gap-3">
                                            <LinearProgressBar
                                                answerCorrectCount={answerCorrectCount}
                                                max={countQuestionQuizDetail}
                                            />
                                            <h5 className="text-[#333]">
                                                <span className="font-bold text-[20px]">{answerCorrectCount}</span>/
                                                <span className="text-primary text-[20px] font-bold">
                                                    {countQuestionQuizDetail}
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Button
                                onClick={() => {
                                    dispatch(resetTakeQuiz());
                                    router.replace(MAIN_ROUTE.DISCOVER_QUIZ);
                                }}
                                type="primary"
                                className="z-[99999] mt-5"
                                // className="bg-primary text-3xl px-3 py-3 mt-6 md:px-2 md:py-2 md:mt-10   z-20 text-white font-bold md:text-lg rounded-md"
                            >
                                OK
                            </Button>
                        </div>
                        <div className="w-full md:w-full absolute md:-bottom-64 z-10">
                            <Lottie className="w-full" animationData={congratsAnimation} />
                        </div>
                    </div>
                )}
            </div>
            {quizDetail?.isUseChatBot && <ChatBot />}
        </React.Fragment>
    );
};
const LinearProgressBar = ({ answerCorrectCount, max }: any) => {
    const percent = (answerCorrectCount / max) * 100;
    const getColor = (percent: any) => {
        if (percent < 50) return '#ff0000'; // đỏ
        if (percent < 70) return '#ffff00'; // vàng
        return '#00ff00'; // xanh
    };
    return (
        <div
            style={{
                width: '100%',
                background: '#eee',
                borderRadius: '8px',
                overflow: 'hidden',
                height: '20px',
            }}
        >
            <div
                style={{
                    width: `${percent}%`,
                    height: '100%',
                    backgroundColor: getColor(percent),
                    transition: 'width 0.5s ease',
                }}
            />
        </div>
    );
};
const reducerMatchingQuestion = (state: any, action: any) => {
    //matchInfo sẽ có kiểu {answer,question}// sẽ có thêm current question
    const { currentPartIndex, currentQuestionIndex } = action.payload;
    const choices = { ...state };
    if (!choices.hasOwnProperty(currentPartIndex)) {
        choices[currentPartIndex] = {};
    }
    // trường hợp đã có 1 câu trả lời bất kỳ
    if (
        choices[currentPartIndex]?.[currentQuestionIndex] &&
        Array.isArray(choices[currentPartIndex][currentQuestionIndex])
    ) {
        //tìm ra câu trả lời, nếu không có thì add mới, nếu có thì chỉnh sửa
        const idx = choices[currentPartIndex][currentQuestionIndex].findIndex(
            (item: any) => item?.question == action?.payload?.currentQuestion,
        );
        if (idx !== -1) {
            const newValueItem = {
                ...choices[currentPartIndex][currentQuestionIndex][idx],
            };
            if (action.payload.answer) {
                newValueItem.answer = action.payload.answer;
            }
            choices[currentPartIndex][currentQuestionIndex][idx] = {
                ...newValueItem,
            };
            //trường hợp nếu chưa có (nhưng đã chọn đáp án câu khác)
        } else {
            // không xác định đưuọc lỗi, nhưng phải check trước khi push, nếu có rồi thì không push nữa
            if (
                !choices[currentPartIndex][currentQuestionIndex].some(
                    (item: any) => item?.question === action.payload.question,
                )
            ) {
                choices[currentPartIndex][currentQuestionIndex].push({
                    question: action.payload.question,
                });
            }
        }
    }
    //trường hợp đầu tiên
    else {
        //trường hợp nếu chưa có gì
        choices[currentPartIndex] = {
            ...choices[currentPartIndex],
            [currentQuestionIndex]: [{ question: action.payload.question }],
        };
    }
    return choices;
};

// const TakeQuizPage = () => {
//   return (
//     <TakeQuizProvider answerChoiceReducer={answerChoiceReducer}>
//       <ShuffleProvider reducerMatchingQuestion={reducerMatchingQuestion}>
//         <TakeQuizPageMain />
//       </ShuffleProvider>
//     </TakeQuizProvider>
//   );
// };
export default TakeQuizPageMain;
