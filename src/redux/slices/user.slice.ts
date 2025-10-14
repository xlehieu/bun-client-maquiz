import { getUserDetail } from '@/services/user.service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
export const fetchUserProfile = createAsyncThunk('profile/userProfile', async () => {
    const response = await getUserDetail();
    return response;
});
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
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            console.log("action.payloadaction.payloadaction.payload",action.payload);
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
        });
    }
});


// Action creators are generated for each case reducer function
export const { updateUser, resetUser, favoriteQuiz } = userReducer.actions;

export default userReducer.reducer;
