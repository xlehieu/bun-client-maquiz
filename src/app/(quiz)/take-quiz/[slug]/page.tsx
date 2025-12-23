'use client';
import congratsAnimation from '@/asset/animations/congratulations-2.json';
import Lottie from 'lottie-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
//component
import { ANSWER_CHOICE_ACTION } from '@/common/constants';
import ChatBot from '@/components/UI/ChatBot';
import siteRouter from '@/config';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchQuizPreview, resetTakeQuiz } from '@/redux/slices/takeQuiz.slice';
import { Button, Col, Row } from 'antd';
import 'aos/dist/aos.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { toast } from 'sonner';
import ChooseAnswer from './components/ChooseAnswer';
import TableQuestion from './components/TableQuestion';
import TakeQuizInfo from './components/TakeQuizInfo';
//end

const answerChoiceReducer = (state: any, action: any) => {
    switch (action.type) {
        case ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_1: {
            return {
                ...state,
                [action.payload.currentPartIndex]: {
                    ...state[action.payload.currentPartIndex],
                    [action.payload.currentQuestionIndex]: {
                        chooseIndex: action.payload.chooseIndex,
                        isCorrect: action.payload.isCorrect,
                    },
                },
            };
        }
        case ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_2: {
            const { currentPartIndex, currentQuestionIndex, chooseIndex, isCorrect } = action.payload;
            if (
                currentPartIndex !== undefined &&
                currentQuestionIndex !== undefined &&
                chooseIndex !== undefined &&
                isCorrect !== undefined
            ) {
                const choices = { ...state };
                // khi choices[currentPartIndex] là undefined thì phải set là một đối tượng không thì
                // kiểm tra choices[currentPartIndex][currentQuestionIndex] sẽ là đang truy cập đến thuộc tính của undefined nên lỗi
                // và đang là kiểm tra questionType = 1 nên sẽ kiểm tra là mảng
                if (!choices.hasOwnProperty(currentPartIndex)) choices[currentPartIndex] = {};
                if (Array.isArray(choices[currentPartIndex][currentQuestionIndex])) {
                    // nếu câu hỏi vừa chọn có trong answer choice rồi thì return
                    if (
                        choices[currentPartIndex][currentQuestionIndex].some(
                            (choice) => choice.chooseIndex === chooseIndex,
                        )
                    ) {
                        return state;
                    }
                    choices[currentPartIndex] = {
                        ...choices[currentPartIndex],
                        [currentQuestionIndex]: [
                            ...choices[currentPartIndex][currentQuestionIndex],
                            {
                                chooseIndex: chooseIndex,
                                isCorrect: isCorrect,
                            },
                        ],
                    };
                } else {
                    choices[currentPartIndex] = {
                        ...choices[currentPartIndex],
                        [currentQuestionIndex]: [
                            {
                                chooseIndex: chooseIndex,
                                isCorrect: isCorrect,
                            },
                        ],
                    };
                }
                return choices;
            }
            return state;
        }
        case ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_3: {
            //matchInfo sẽ có kiểu {answer,question}// sẽ có thêm current question
            const { currentPartIndex, currentQuestionIndex, matchQuestion } = action.payload;
            const choices = { ...state };
            if (!choices[currentPartIndex]) {
                choices[currentPartIndex] = {};
            }
            if (Array.isArray(matchQuestion)) {
                choices[currentPartIndex] = {
                    ...(choices?.[currentPartIndex] || {}),
                    [currentQuestionIndex]: [...(matchQuestion || [])],
                };
            }
            return choices;
        }
        default:
            return state;
    }
};
const checkQuestionCorrectQuestionType2 = (
    quizDetail: any,
    answerChoices: any,
    currentQuestionType: any,
    currentPartIndex: any,
    currentQuestionIndex: any,
) => {
    if (
        typeof quizDetail === 'undefined' &&
        typeof answerChoices === 'undefined' &&
        typeof currentQuestionType === 'undefined' &&
        typeof currentPartIndex === 'undefined' &&
        typeof currentQuestionIndex === 'undefined'
    )
        return;
    if (quizDetail.quiz && currentQuestionType === 2 && currentPartIndex in answerChoices) {
        if (currentQuestionIndex in answerChoices[currentPartIndex]) {
            const quiz = quizDetail.quiz;
            if (quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]) {
                const answers = quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.answers; // quiz detail
                const choices = answerChoices[currentPartIndex][currentQuestionIndex]; //answer choices
                if (Array.isArray(answers) && Array.isArray(choices)) {
                    let countAnswerCorrectInQuizDetail = 0;
                    answers.forEach((answer) => {
                        if (answer.isCorrect) return countAnswerCorrectInQuizDetail++;
                    }, 0);
                    let countAnswerCorrectInAnswerChoices = 0;
                    choices.forEach((choice) => {
                        if (choice.isCorrect) return countAnswerCorrectInAnswerChoices++;
                    }, 0);
                    const everyCorrect = choices.every((choice) => choice.isCorrect === true);
                    if (countAnswerCorrectInQuizDetail === countAnswerCorrectInAnswerChoices && everyCorrect) {
                        return true;
                    }
                    return false;
                }
            }
        }
    }
    return null;
};
// đếm số câu đúng trong 1 câu hỏi
const countCorrectAnswerQuizDetail = (question: any) => {
    if (!(question?.answers?.length > 0)) return 0;
    let count = 0;
    question.answers.forEach((answer: any) => {
        if (answer?.isCorrect) count++;
    });
    return count;
};
// đếm đáp án đúng trong câu trả lời
const countCorrectAnswerChoices = (answerChoices: any, quizDetail: any) => {
    let count = 0;
    console.log(answerChoices, quizDetail);
    //lặp qua từng phần
    Object.entries(answerChoices).forEach(([keyOfPart, valueOfPart]) => {
        if (typeof valueOfPart === 'object') {
            // đang tính theo question
            Object.entries(valueOfPart as any).forEach(([keyOfQuestion, valueOfQuestion]: any) => {
                // nếu là loại 1
                if (
                    typeof valueOfQuestion === 'object' &&
                    quizDetail.quiz[keyOfPart]?.questions[keyOfQuestion]?.questionType === 1
                ) {
                    if (valueOfQuestion?.isCorrect) {
                        console.log('OK 1');
                        count++;
                    }
                } else if (
                    Array.isArray(valueOfQuestion) &&
                    quizDetail.quiz[keyOfPart]?.questions[keyOfQuestion]?.questionType === 2
                ) {
                    //đếm xem đã chọn đủ số đáp án đúng chưa => check bằng length của đáp án được chọn so với số câu dúng của question đó
                    // => không quan tâm đến question answer có đúng hay không đã
                    if (
                        countCorrectAnswerQuizDetail(quizDetail.quiz[keyOfPart].questions[keyOfQuestion]) ===
                        valueOfQuestion.length
                    ) {
                        if (valueOfQuestion.every((answer) => answer.isCorrect === true)) {
                            console.log('OK 2');

                            count++;
                        }
                    }
                } else if (
                    Array.isArray(valueOfQuestion) &&
                    quizDetail.quiz[keyOfPart]?.questions[keyOfQuestion]?.questionType === 3
                ) {
                    // nếu tất cả giống nhau thì trả lời đúng
                    if (
                        valueOfQuestion.every(
                            (itemQuestionAnswer) => itemQuestionAnswer.question == itemQuestionAnswer.answer,
                        )
                    ) {
                        console.log('OK 3');
                        count++;
                    }
                }
            });
        }
    });
    return count;
};
const calculateScore = (answerChoices: any, countQuestionQuizDetail: any, quizDetail: any) => {
    if (typeof answerChoices === 'object' && typeof quizDetail === 'object' && quizDetail?.quiz?.length > 0) {
        let countCorrectAnswer = 0;
        //vào part
        Object.entries(answerChoices).forEach(([keyPart, value]: any) => {
            // entries trả về mảng, mảng đó lại chứa các mảng [key,value]
            if (typeof value === 'object') {
                //vào question và lấy được giá trị bằng value
                Object.entries(value).forEach(([keyQuestion, valueQuestion]: any) => {
                    if (
                        Array.isArray(valueQuestion) &&
                        countCorrectAnswerQuizDetail(quizDetail.quiz[keyPart].questions[keyQuestion]) ===
                            valueQuestion.length
                    ) {
                        if (valueQuestion.every((answer) => answer.isCorrect === true)) {
                            countCorrectAnswer++;
                        }
                    }
                    if (typeof valueQuestion === 'object') {
                        if (valueQuestion?.isCorrect) {
                            countCorrectAnswer++;
                        }
                    }
                });
            }
        });
        return Number(((countCorrectAnswer / countQuestionQuizDetail) * 10).toFixed(2));
    }
};
const TakeQuizPageMain = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {
        answerChoices,
        currentQuizPreviewDetail: quizDetail,
        isEnded,
        isFetching,
        currentPartIndex,
        currentQuestionIndex,
        currentQuestionType,
        isTimeout,
        countQuestionQuizDetail,
    } = useAppSelector((state) => state.takeQuiz);
    console.log(answerChoices);
    console.log('countQuestionQuizDetail', countQuestionQuizDetail);
    const slug = useParams()?.slug as string;
    useEffect(() => {
        dispatch(fetchQuizPreview(slug));
    }, []);
    const [score, setScore] = useState(0);
    const [answerCorrectCount, setAnswerCorrectCount] = useState(0);
    //   const handleSaveTakeQuizHistory = useMutationHooks((data: any) =>
    //     QuizHistoryService.saveQuizHistory(data)
    //   );
    useEffect(() => {
        if (!answerChoices || !quizDetail) return;
        if (isTimeout) {
            toast.warning('Bạn đã hết giờ làm bài');
        }
        if (isEnded || isTimeout) {
            const score = calculateScore(answerChoices, countQuestionQuizDetail, quizDetail) || 0;
            setScore(Number(score));
            // handleSaveTakeQuizHistory.mutate({
            //   quizId: quizDetail._id,
            //   score: score,
            //   answerChoices,
            // });
        }
        if (answerChoices) {
            const count = countCorrectAnswerChoices(answerChoices, quizDetail) || 0;
            setAnswerCorrectCount(count);
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
                                        <h5 className="">Điểm của bạn là:</h5>
                                        <div className="w-full md:w-1/2 mt-3">
                                            <CircularProgressbar
                                                styles={buildStyles({
                                                    textSize: '39px',
                                                    pathColor:
                                                        score < 5 ? '#ff0000' : score < 7 ? '#ffff00' : '#00ff00',
                                                    textColor: '#333',
                                                    trailColor: '#eee',
                                                })}
                                                className="text-center"
                                                value={score}
                                                maxValue={10}
                                                text={`${score}`}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div className="flex flex-col rounded-lg shadow-md border px-3 py-3 items-center h-full">
                                        <h5>Số câu đúng</h5>
                                        <div className="mt-3 w-full flex flex-col items-center justify-center flex-1 gap-3">
                                            <LinearProgressBar
                                                answerCorrectCount={answerCorrectCount}
                                                max={countQuestionQuizDetail}
                                            />
                                            <h5 className="text-[#333]">
                                                <span className="font-bold">{answerCorrectCount}</span>/
                                                <span className="text-green-500 font-bold">
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
                                    router.replace(siteRouter.discover);
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
