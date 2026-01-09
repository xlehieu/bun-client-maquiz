import { getQuizPreviewBySlug } from '@/api/quiz.service';
import { MappingMatchQuestion, MatchQuestion, QuestionType_1_2, QuizDetailRecord } from '@/@types/quiz.type';
import { AnswerChoices, AnswerChoiceType1_2 } from '@/@types/shared.type';
import { shuffleArray } from '@/utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { toast } from 'sonner';
import { ClassExamItem } from '@/@types/classExam.type';
import { getClassExamDetail } from '@/api/classExam.service';
export type ShuffleType = 'part' | 'question' | 'answer';
type TakeQuizState = {
    currentQuizId?: string;
    currentPartIndex: number;
    currentQuestionIndex: number;
    currentQuizTakeDetail: QuizDetailRecord | null;
    currentQuestionType?: number;
    isFetching: boolean;
    timePassQuestion: number;
    answerChoices: AnswerChoices;
    countQuestionQuizDetail: number;
    isEnded: boolean;
    isTimeout: boolean;
};
const initStateTakeQuiz: TakeQuizState = {
    isFetching: false,
    currentQuizTakeDetail: null,
    currentPartIndex: 0,
    currentQuestionIndex: 0,
    timePassQuestion: 2000,
    countQuestionQuizDetail: 0,
    isEnded: false,
    isTimeout: false,
    answerChoices: {},
};
export const fetchTakeQuiz = createAsyncThunk('quiz/fetchQuizDetail', async (slug: string) => {
    try {
        const response = await getQuizPreviewBySlug(slug);
        return response.data;
    } catch (err) {
        toast.error('Lỗi server, không tìm thấy bài trắc nghiệm!');
    }
});
export const fetchClassExamDetail = createAsyncThunk('exam/fetchClassExam', async (idClassExam: string) => {
    try {
        const response = await getClassExamDetail(idClassExam);
        return response;
    } catch (err) {
        toast.error('Lỗi');
    }
});
const takeQuizSlice = createSlice({
    name: 'takeQuiz',
    initialState: initStateTakeQuiz,
    reducers: {
        setTimePassQuestion: (state, action: PayloadAction<number>) => {
            state.timePassQuestion = action.payload;
        },
        setCurrentPartIndex: (state, action: PayloadAction<number>) => {
            state.currentPartIndex = action.payload;
        },
        setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
            state.currentQuestionIndex = action.payload;
        },
        setCurrentQuestionType: (state, action: PayloadAction<number>) => {
            state.currentQuestionType = action.payload;
        },
        endTakeQuiz: (state) => {
            state.isEnded = true;
        },
        timeOut: (state) => {
            state.isTimeout = true;
        },
        setCurrentQuizTake: (state, action: PayloadAction<QuizDetailRecord>) => {
            state.currentQuizTakeDetail = action.payload || null;
        },
        shuffleQuiz: (state, action: PayloadAction<ShuffleType[]>) => {
            const checkShuffleAnswer = action.payload.includes('answer');
            const checkShuffleQuestion = action.payload.includes('question');
            const checkShufflePart = action.payload.includes('part');
            if (state.currentQuizTakeDetail?.quiz) {
                //part
                //các phần thi nằm trong này
                const newQuiz = state.currentQuizTakeDetail?.quiz?.map((part) => {
                    // const partDetail = { ...part };
                    const newDataPart = part.questions?.map((question) => {
                        // const newAnswer = { ...question };
                        // // if (checkShuffleAnswer)
                        // //     if (
                        // //         (newAnswer.questionType === 1 || newAnswer.questionType === 2) &&
                        // //         (newAnswer as QuestionType_1_2).answers
                        // //     ) {
                        // //         (newAnswer as QuestionType_1_2).answers = shuffleArray(
                        // //             (newAnswer as QuestionType_1_2).answers,
                        // //         );
                        // //     }
                        return {
                            ...question,
                            answers: checkShuffleAnswer
                                ? shuffleArray((question as QuestionType_1_2).answers)
                                : (question as QuestionType_1_2).answers,
                        };
                    });
                    return {
                        ...part,
                        questions: checkShuffleQuestion ? shuffleArray(newDataPart) : newDataPart,
                    };
                    // return newPart;
                });
                state.currentQuizTakeDetail.quiz = checkShufflePart ? shuffleArray(newQuiz) : newQuiz;
            }
        },
        chooseQuestionType1: (
            state,
            action: PayloadAction<{
                currentPartIndex: number;
                currentQuestionIndex: number;
                chooseIndex: number;
                isCorrect: boolean;
            }>,
        ) => {
            state.answerChoices = {
                ...(state.answerChoices || {}),
                [action.payload.currentPartIndex]: {
                    ...(state?.answerChoices?.[action.payload?.currentPartIndex] || {}),
                    [action.payload.currentQuestionIndex]: {
                        chooseIndex: action.payload.chooseIndex,
                        isCorrect: action.payload.isCorrect,
                    },
                },
            };
        },
        chooseQuestionType2: (
            state,
            action: PayloadAction<{
                currentPartIndex: number;
                currentQuestionIndex: number;
                chooseIndex: number;
                isCorrect: boolean;
            }>,
        ) => {
            const { currentPartIndex, currentQuestionIndex, chooseIndex, isCorrect } = action.payload;
            if (
                currentPartIndex !== undefined &&
                currentQuestionIndex !== undefined &&
                chooseIndex !== undefined &&
                isCorrect !== undefined
            ) {
                const choices = { ...state.answerChoices };
                // khi choices[currentPartIndex] là undefined thì phải set là một đối tượng không thì
                // kiểm tra choices[currentPartIndex][currentQuestionIndex] sẽ là đang truy cập đến thuộc tính của undefined nên lỗi
                // và đang là kiểm tra questionType = 1 nên sẽ kiểm tra là mảng
                if (!choices.hasOwnProperty(currentPartIndex)) choices[currentPartIndex] = {};
                if (Array.isArray(choices[currentPartIndex][currentQuestionIndex])) {
                    // nếu câu hỏi vừa chọn có trong answer choice rồi thì return
                    if (
                        !choices[currentPartIndex][currentQuestionIndex].some(
                            (choice) => (choice as AnswerChoiceType1_2).chooseIndex === chooseIndex,
                        )
                    ) {
                        (choices as any)[currentPartIndex] = {
                            ...choices[currentPartIndex],
                            [currentQuestionIndex]: [
                                ...choices[currentPartIndex][currentQuestionIndex],
                                {
                                    chooseIndex: chooseIndex,
                                    isCorrect: isCorrect,
                                },
                            ],
                        };
                    }
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
                state.answerChoices = { ...choices };
            }
        },
        chooseQuestionType3: (
            state,
            action: PayloadAction<{
                currentPartIndex: number;
                currentQuestionIndex: number;
                matchQuestion: any;
            }>,
        ) => {
            const { currentPartIndex, currentQuestionIndex, matchQuestion } = action.payload;
            const choices = { ...state.answerChoices };
            if (!choices[currentPartIndex]) {
                choices[currentPartIndex] = {};
            }
            if (Array.isArray(matchQuestion)) {
                choices[currentPartIndex] = {
                    ...(choices?.[currentPartIndex] || {}),
                    [currentQuestionIndex]: [...(matchQuestion || [])],
                };
            }
            state.answerChoices = { ...choices };
        },
        resetTakeQuiz: () => {
            return { ...initStateTakeQuiz };
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTakeQuiz.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchTakeQuiz.rejected, (state) => {
                state.isFetching = false;
            })
            .addCase(fetchTakeQuiz.fulfilled, (state, action) => {
                state.isFetching = false;
                const quizFetch = action.payload?.data;
                if (quizFetch) {
                    let countQuestion = 0;
                    state.currentQuizTakeDetail = {
                        ...quizFetch,
                        quiz: quizFetch?.quiz?.map((part) => {
                            countQuestion += part.questions.length;
                            return {
                                ...part,
                                questions: part?.questions?.map((question) => {
                                    if (question.questionType === 3) {
                                        const matchQuestion = (question as MatchQuestion).matchQuestions;
                                        const mappingMatchQuestion: MappingMatchQuestion = {
                                            optionMatchQuestion_Question: [],
                                            optionMatchQuestion_Answer: [],
                                        };
                                        matchQuestion.forEach((itemMatchQuestion) => {
                                            const answerId = itemMatchQuestion._id || itemMatchQuestion.answerId;
                                            mappingMatchQuestion.optionMatchQuestion_Question.push({
                                                questionContent: itemMatchQuestion.questionContent,
                                                answerId: answerId,
                                            });
                                            mappingMatchQuestion.optionMatchQuestion_Answer.push({
                                                answer: itemMatchQuestion.answer,
                                                answerId: answerId,
                                            });
                                        });
                                        return {
                                            ...question,
                                            mappingMatchQuestion: {
                                                optionMatchQuestion_Answer: shuffleArray(
                                                    mappingMatchQuestion.optionMatchQuestion_Answer,
                                                ),
                                                optionMatchQuestion_Question: shuffleArray(
                                                    mappingMatchQuestion.optionMatchQuestion_Question,
                                                ),
                                            },
                                        };
                                    }

                                    return question;
                                }),
                            };
                        }),
                    };
                    state.countQuestionQuizDetail = countQuestion;
                    if (state?.currentQuizTakeDetail?.quiz?.length > 0)
                        state.currentQuestionType = state?.currentQuizTakeDetail?.quiz[0]?.questions?.[0]?.questionType;
                }
            });
        // .addCase(fetchClassExamDetail.fulfilled, (state, action) => {
        //     state.currentClassExam = action.payload?.data || null;
        // });
    },
});
const takeQuizPersistConfig = {
    key: 'takeQuiz',
    storage,
    whitelist: ['currentSectionIndex', 'currentQuestionIndex'],
    blackList: ['currentClassExam'],
};
export const {
    setTimePassQuestion,
    setCurrentQuestionIndex,
    setCurrentPartIndex,
    shuffleQuiz,
    endTakeQuiz,
    setCurrentQuestionType,
    timeOut,
    chooseQuestionType1,
    chooseQuestionType2,
    chooseQuestionType3,
    resetTakeQuiz,
    setCurrentQuizTake,
} = takeQuizSlice.actions;

export default persistReducer(takeQuizPersistConfig, takeQuizSlice.reducer);
