import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    quiz: [] as any[],
};
export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setQuiz: (state, action) => {
            state.quiz = action.payload;
        },
        deleteOneQuiz: (state, action) => {
            state.quiz.filter((q) => q._id !== action.payload.id);
        },
    },
});
export const { setQuiz, deleteOneQuiz } = quizSlice.actions;
export default quizSlice.reducer;
