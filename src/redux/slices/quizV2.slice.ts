import { getQuizPreviewBySlug } from '@/api/quiz.service';
import { QuizDetailRecord } from '@/types/quiz.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { toast } from 'sonner';
type QuizState = {
    isFetching: boolean;
    currentQuizId?: string;
    currentQuizDetail: QuizDetailRecord | null;
};
export const fetchQuizPreview = createAsyncThunk('quiz/fetchQuizDetail', async (slug: string) => {
    try {
        const response = await getQuizPreviewBySlug(slug);
        return response.data;
    } catch (err) {
        toast.error('Lỗi server, không tìm thấy bài trắc nghiệm!');
    }
});
const initStateQuiz: QuizState = {
    isFetching: false,
    currentQuizDetail: null,
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState: initStateQuiz,
    reducers: {},
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
export const {} = quizSlice.actions;

export default quizSlice.reducer;
