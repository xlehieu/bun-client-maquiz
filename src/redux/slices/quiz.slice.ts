import { getMyQuizzes, getQuizDetailAPI } from '@/api/quiz.service';
import { IQuerySkipLimit } from '@/interface';
import {
    AnswerType_1_2,
    BodyUpsertQuestionQuiz,
    MatchQuestion,
    QuestionType_1_2,
    QuestionType_3,
    QuizDetailRecord,
} from '@/@types/quiz.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv7 } from 'uuid';
type QuizState = {
    isFetching: boolean;
    listMyQuiz: QuizDetailRecord[];
    pagination: {
        total: number;
        currentPage: number;
    };
    quizDetail: QuizDetailRecord | null;
    currentCreateQuizId?: string;
    currentQuizPartId: string;
    currentUpdateQuestionQuizId?: string;
};
const initialState: QuizState = {
    isFetching: false,
    listMyQuiz: [],
    pagination: {
        total: 0,
        currentPage: 1,
    },
    quizDetail: null,
    currentQuizPartId: uuidv7(),
};
export const fetchQuizDetail = createAsyncThunk('quiz/fetchQuizDetail', async (id: string) => {
    try {
        const response = await getQuizDetailAPI(id);
        return response;
    } catch (error) {}
});
export const fetchMyListQuiz = createAsyncThunk('quiz/fetchMyQuiz', async (params?: Partial<IQuerySkipLimit>) => {
    try {
        const response = await getMyQuizzes(params);
        return response;
    } catch (error) {}
});
export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setCurrentCreateQuizId: (state, action: PayloadAction<string>) => {
            state.currentCreateQuizId = action.payload;
        },
        setCurrentQuizPartId: (state, action: PayloadAction<string>) => {
            state.currentQuizPartId = action.payload;
        },
        setCurrentUpdateQuestionQuizId: (state, action: PayloadAction<string>) => {
            state.currentUpdateQuestionQuizId = action.payload;
        },
        setQuizOfQuizDetail: (state, action: PayloadAction<Omit<BodyUpsertQuestionQuiz, 'quizId'>>) => {
            if (state.quizDetail?.quiz) {
                const questionType = action.payload.questionType;
                let question: Partial<MatchQuestion> | Partial<QuestionType_1_2> = {};
                if ([1, 2].includes(questionType)) {
                    question = {
                        questionId: action.payload.questionId,
                        questionType,
                        questionContent: action.payload.questionContent as string,
                        answers: action.payload.answers as any,
                    };
                } else if (questionType === 3) {
                    question = {
                        questionId: action.payload.questionId,
                        questionType,
                        matchQuestions: action.payload.matchQuestions,
                    };
                }
                const partChange = state.quizDetail.quiz.find((part) => part.partId === action.payload.partId);
                if (!partChange) {
                    state.quizDetail.quiz.push({
                        partId: action.payload.partId,
                        questions: [question as MatchQuestion | QuestionType_1_2],
                        partName: action.payload.partName,
                        isDisabled: false,
                    });
                } else {
                    const questionChange = partChange.questions.find(
                        (_question) => _question.questionId === action.payload.questionId,
                    );
                    if (!questionChange) {
                        partChange.questions.push(question as MatchQuestion | QuestionType_1_2);
                    } else {
                        if ([1, 2].includes(questionType)) {
                            (questionChange as QuestionType_1_2).questionContent = action.payload
                                .questionContent as string;
                            (questionChange as QuestionType_1_2).answers = action.payload.answers as AnswerType_1_2[];
                        } else if (questionType === 3) {
                            (questionChange as MatchQuestion).matchQuestions = action.payload
                                .matchQuestions as QuestionType_3[];
                        }
                    }
                }
            }
        },
        changeQuizPartName: (
            state,
            action: PayloadAction<{
                partId: string;
                partName: string;
            }>,
        ) => {
            const part = state.quizDetail?.quiz.find((part) => part.partId === action.payload.partId);
            console.log(part);
            if (part) {
                part.partName = action.payload.partName;
            }
        },
        setQuizDetail: (state, action: PayloadAction<QuizDetailRecord>) => {
            state.quizDetail = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuizDetail.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchQuizDetail.rejected, (state) => {
                state.isFetching = false;
            })
            .addCase(fetchQuizDetail.fulfilled, (state, action) => {
                state.isFetching = false;
                state.quizDetail = action.payload || null;
                const partId = action.payload?.quiz?.[0]?.partId;
                const questionId = action.payload?.quiz?.[0]?.questions?.[0]?.questionId;
                if (partId) {
                    state.currentQuizPartId = partId;
                }
                if (questionId) {
                    state.currentUpdateQuestionQuizId = questionId;
                }
            })
            .addCase(fetchMyListQuiz.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchMyListQuiz.rejected, (state) => {
                state.isFetching = false;
            })
            .addCase(fetchMyListQuiz.fulfilled, (state, action) => {
                state.isFetching = false;
                state.listMyQuiz = action.payload?.quizzes || [];
                state.pagination.total = action.payload?.total || 0;
                state.pagination.currentPage = action.payload?.currentPage || 0;
            });
    },
});
export const {
    setCurrentQuizPartId,
    setCurrentCreateQuizId,
    setCurrentUpdateQuestionQuizId,
    setQuizOfQuizDetail,
    setQuizDetail,
    changeQuizPartName,
} = quizSlice.actions;
export default quizSlice.reducer;
