import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type QuizState = {
    currentCreateQuizId?: string;
};

const initStateQuiz: QuizState = {
    currentCreateQuizId: '689c55fc138c946973e6e330',
};

const createQuizSlice = createSlice({
    name: 'quiz',
    initialState: initStateQuiz,
    reducers: {
        setCurrentCreateQuizId: (state, action: PayloadAction<string>) => {
            state.currentCreateQuizId = action.payload;
        },
    },
});
export const { setCurrentCreateQuizId } = createQuizSlice.actions;

export default createQuizSlice.reducer;
