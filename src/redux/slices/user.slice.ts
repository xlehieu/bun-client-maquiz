import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    name: '',
    email: '',
    phone: '',
    avatar: '',
    address: '',
    isAdmin: false,
    access_token: '',
    quizAccessHistory: [],
    favoriteQuiz: [] as any[],
};
export const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name, email, phone, address, avatar, isAdmin, access_token, quizAccessHistory, favoriteQuiz } =
                action.payload;
            //state này dựa trên thằng initstate
            state.name = name ? name : email;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.avatar = avatar;
            state.isAdmin = isAdmin;
            state.access_token = access_token;
            state.quizAccessHistory = quizAccessHistory;
            state.favoriteQuiz = favoriteQuiz;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.phone = '';
            state.address = '';
            state.avatar = '';
            state.isAdmin = false;
            state.access_token = '';
            state.quizAccessHistory = [];
            state.favoriteQuiz = [];
        },
        favoriteQuiz: (state, action) => {
            const quiz = action.payload;
            if (!quiz) return;
            if (!state.favoriteQuiz.some((q) => q.slug === quiz.slug)) {
                state.favoriteQuiz.push(quiz);
            } else {
                state.favoriteQuiz = state.favoriteQuiz.filter((q) => q.slug !== quiz.slug);
            }
        },
    },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser, favoriteQuiz } = userReducer.actions;

export default userReducer.reducer;
