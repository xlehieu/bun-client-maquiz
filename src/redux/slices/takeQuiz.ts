import { getQuizPreviewBySlug } from '@/api/quiz.service';
import { QuizDetailRecord } from '@/types/quiz.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { toast } from 'sonner';
type TakeQuizState = {
    currentQuizId?: string;
    currentSectionIndex: number;
    currentQuestionIndex: number;
    currentQuizDetail: QuizDetailRecord | null;
    currentQuestionType?: number;
    isFetching: boolean;
    timePassQuestion: number;
    answerChoices?: any;
};
const initStateTakeQuiz: TakeQuizState = {
    isFetching: false,
    currentQuizDetail: null,
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
                state.currentQuizDetail = action.payload?.data || null;
            });
    },
});
const takeQuizPersistConfig = {
    key: 'takeQuiz',
    storage,
    whitelist: ['currentSectionIndex', 'currentQuestionIndex'],
};
export const { setCurrentQuestionIndex, setCurrentSectionIndex } = takeQuizSlice.actions;

export default persistReducer(takeQuizPersistConfig, takeQuizSlice.reducer);
