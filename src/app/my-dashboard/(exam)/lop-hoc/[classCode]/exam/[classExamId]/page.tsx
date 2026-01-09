'use client';
import { BodyCreateExamAttempt } from '@/@types/examAttempt.type';
import { MappingMatchQuestion, MatchQuestion, QuestionType_1_2 } from '@/@types/quiz.type';
import { createExamAttempt } from '@/api/examAttempt.service';
import TakeClassExamMain from '@/features/classExam/components/TakeClassExamMain';
import { useClassExam, useExamAttempt } from '@/features/classExam/classExam.query';
import Timer from '@/features/takeQuiz/components/Timer';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { shuffleArray } from '@/utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useParams, useRouter } from 'next/navigation';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useCreateExamAttempt } from '@/features/classExam/classExam.mutation';
import { setExamAnswerChoices, setExamCurrentQuestionType, setExamDataQuizPart } from '@/redux/slices/takeExam.slice';
import AlreadySubmitted from '@/features/classExam/components/AlreadySubmitted';
import { getRouteConfigParam, USER_DASHBOARD_ROUTER } from '@/config/routes';
import ErrorState from '@/components/UI/ErrorState';
import LoadingComponent from '@/components/UI/LoadingComponent';
dayjs.extend(duration);
const TakeExam = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { userProfile } = useAppSelector((state) => state.user);
    const { classExamId, classCode } = useParams<{ classExamId?: string; classCode?: string }>();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { data: currentClassExam, isLoading: isLoadingClassExam } = useClassExam(classExamId);
    // Quiz trong thằng currentExamAttempt chỉ dùng để SHUFFLE không dùng để làm đề thi
    //

    //
    //=> sau khi thằng currentExamAttempt được gọi thì lấy quiz đã shuffle để thi
    const { data: currentExamAttempt, isLoading: isLoadingExamtAttempt } = useExamAttempt(classExamId);
    // const { examDataQuizPart } = useAppSelector((state) => state.takeExam);
    const [isOpened, setIsOpened] = useState(false);
    const endTimeCounting = useMemo(() => {
        return dayjs(currentClassExam?.startTime).toDate();
        // return dayjs().add(5, 'second').toDate();
    }, [currentClassExam]);
    // useEffect(()=>{
    //     if(currentClassExam?.status==="")
    //     setIsSubmitted(true)
    // },[currentClassExam])
    const { mutate: createExamAttempt } = useCreateExamAttempt();
    // const { currentClassExam } = useAppSelector((state) => state.takeQuiz);
    useEffect(() => {
        // console.log('currentExamAttempt?.quizDetail', currentExamAttempt);
        if (typeof currentExamAttempt?.status === 'string' && currentExamAttempt?.status !== 'doing') {
            setIsSubmitted(true);
            return;
        }
        if (currentExamAttempt?.quizExam) {
            dispatch(setExamDataQuizPart(currentExamAttempt?.quizExam));
            dispatch(setExamCurrentQuestionType(currentExamAttempt?.quizExam?.[0]?.questions?.[0]?.questionType));
            if (currentExamAttempt.answerChoices) {
                dispatch(setExamAnswerChoices(currentExamAttempt.answerChoices));
            }
        }
    }, [currentExamAttempt]);
    if (isSubmitted) {
        return (
            <AlreadySubmitted
                onBack={() => {
                    const routeBackReplace = getRouteConfigParam(USER_DASHBOARD_ROUTER.CLASSROOM_DETAIL_PARAM, [
                        classCode || '',
                    ]);
                    router.replace(routeBackReplace);
                    router.replace(routeBackReplace);
                }}
            />
        );
    }
    return (
        <Fragment>
            {!isOpened ? (
                <div className="flex flex-col items-center justify-center mt-10">
                    <Timer
                        endTime={endTimeCounting}
                        onExpire={() => {
                            if (currentClassExam && userProfile?._id && !isLoadingExamtAttempt && !currentExamAttempt) {
                                const dataQuizDetail = { ...currentClassExam.quizDetail };

                                if (dataQuizDetail?.quiz) {
                                    //part
                                    //các phần thi nằm trong này
                                    const newQuiz = dataQuizDetail?.quiz?.map((part) => {
                                        const partDetail = { ...part };
                                        const newDataPart = part.questions?.map((questionMap) => {
                                            const question = { ...questionMap };

                                            if (
                                                (question.questionType === 1 || question.questionType === 2) &&
                                                (question as QuestionType_1_2).answers
                                            ) {
                                                (question as QuestionType_1_2).answers = shuffleArray(
                                                    (question as QuestionType_1_2).answers,
                                                );
                                            } else if (question.questionType === 3) {
                                                // if (question.questionType === 3) {
                                                const matchQuestion = (questionMap as MatchQuestion).matchQuestions;
                                                const mappingMatchQuestion: MappingMatchQuestion = {
                                                    optionMatchQuestion_Question: [],
                                                    optionMatchQuestion_Answer: [],
                                                };
                                                matchQuestion.forEach((itemMatchQuestion) => {
                                                    const answerId =
                                                        itemMatchQuestion._id || itemMatchQuestion.answerId;
                                                    mappingMatchQuestion.optionMatchQuestion_Question.push({
                                                        questionContent: itemMatchQuestion.questionContent,
                                                        answerId: answerId,
                                                    });
                                                    mappingMatchQuestion.optionMatchQuestion_Answer.push({
                                                        answer: itemMatchQuestion.answer,
                                                        answerId: answerId,
                                                    });
                                                });

                                                (question as MatchQuestion).mappingMatchQuestion = {
                                                    optionMatchQuestion_Answer: shuffleArray(
                                                        mappingMatchQuestion.optionMatchQuestion_Answer,
                                                    ),
                                                    optionMatchQuestion_Question: shuffleArray(
                                                        mappingMatchQuestion.optionMatchQuestion_Question,
                                                    ),
                                                };
                                                // };
                                            }
                                            return {
                                                ...question,
                                                answers: shuffleArray((questionMap as QuestionType_1_2).answers),
                                            };
                                        });
                                        return {
                                            ...part,
                                            questions: shuffleArray(newDataPart),
                                        };
                                        // return newPart;
                                    });
                                    dataQuizDetail.quiz = shuffleArray(newQuiz);
                                }
                                createExamAttempt({
                                    classExamId: currentClassExam?._id,
                                    classId: currentClassExam.classId,
                                    quizExam: dataQuizDetail.quiz,
                                });
                                setIsOpened(true);
                            } else if (
                                currentClassExam &&
                                userProfile?._id &&
                                !isLoadingExamtAttempt &&
                                currentExamAttempt
                            ) {
                                setIsOpened(true);
                            }
                        }}
                        size="lg"
                    />
                    <p className="mt-6 text-[20px] text-slate-500">BÀI THI SẼ BẮT ĐẦU</p>
                </div>
            ) : isOpened && !!currentClassExam && !!currentExamAttempt ? (
                <TakeClassExamMain currentClassExam={currentClassExam} currentExamAttempt={currentExamAttempt} />
            ) : isLoadingExamtAttempt || isLoadingClassExam ? (
                <LoadingComponent />
            ) : (
                <LoadingComponent />
            )}
        </Fragment>
    );
};

export default TakeExam;
