import { getQuizPreviewBySlug } from '@/api/quiz.service';
import { MappingMatchQuestion, MatchQuestion, QuestionType_1_2, QuizDetailRecord } from '@/types/quiz.type';
import { shuffleArray } from '@/utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { toast } from 'sonner';
type ShuffleType = 'part' | 'question' | 'answer';
type TakeQuizState = {
    currentQuizId?: string;
    currentSectionIndex: number;
    currentQuestionIndex: number;
    currentQuizPreviewDetail: QuizDetailRecord | null;
    currentQuestionType?: number;
    isFetching: boolean;
    timePassQuestion: number;
    answerChoices?: any;
};
const initStateTakeQuiz: TakeQuizState = {
    isFetching: false,
    currentQuizPreviewDetail: null,
    currentSectionIndex: 0,
    currentQuestionIndex: 0,
    timePassQuestion: 2000,
};
export const fetchQuizPreview = createAsyncThunk('quiz/fetchQuizDetail', async (slug: string) => {
    try {
        const response = await getQuizPreviewBySlug(slug);
        return response.data;
    } catch (err) {
        toast.error('Lỗi server, không tìm thấy bài trắc nghiệm!');
    }
});
const takeQuizSlice = createSlice({
    name: 'takeQuiz',
    initialState: initStateTakeQuiz,
    reducers: {
        setTimePassQuestion: (state, action: PayloadAction<number>) => {
            state.timePassQuestion = action.payload;
        },
        setCurrentSectionIndex: (state, action: PayloadAction<number>) => {
            state.currentSectionIndex = action.payload;
        },
        setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
            state.currentQuestionIndex = action.payload;
        },
        setQuestionType: (state, action: PayloadAction<number>) => {
            state.currentQuestionType = action.payload;
        },
        shuffleQuiz: (state, action: PayloadAction<ShuffleType[]>) => {
            const checkShuffleAnswer = action.payload.includes('answer');
            const checkShuffleQuestion = action.payload.includes('question');
            const checkShufflePart = action.payload.includes('part');
            if (state.currentQuizPreviewDetail?.quiz) {
                //part
                const newPart = state.currentQuizPreviewDetail.quiz.map((part) => {
                    //rồi shuffle question lên
                    const newQuestion = part.questions.map((question) => {
                        const newAnswer = { ...question };
                        if (checkShuffleAnswer)
                            if (
                                (newAnswer.questionType === 1 || newAnswer.questionType === 2) &&
                                (newAnswer as QuestionType_1_2).answers
                            ) {
                                (newAnswer as QuestionType_1_2).answers = shuffleArray(
                                    (newAnswer as QuestionType_1_2).answers,
                                );
                            }
                        return newAnswer;
                    });
                    return checkShuffleQuestion ? shuffleArray(newQuestion) : newQuestion;
                    // return newPart;
                });
                state.currentQuizPreviewDetail.quiz = checkShufflePart ? shuffleArray(newPart) : newPart;
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchQuizPreview.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchQuizPreview.rejected, (state) => {
                state.isFetching = false;
            })
            .addCase(fetchQuizPreview.fulfilled, (state, action) => {
                state.isFetching = false;
                const quizFetch = action.payload?.data;
                if (quizFetch) {
                    state.currentQuizPreviewDetail = {
                        ...quizFetch,

                        quiz: quizFetch.quiz.map((part) => {
                            return {
                                ...part,
                                questions: part.questions.map((question) => {
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
                }
            });
    },
});
const takeQuizPersistConfig = {
    key: 'takeQuiz',
    storage,
    whitelist: ['currentSectionIndex', 'currentQuestionIndex'],
};
export const { setCurrentQuestionIndex, setCurrentSectionIndex, shuffleQuiz } = takeQuizSlice.actions;

export default persistReducer(takeQuizPersistConfig, takeQuizSlice.reducer);
