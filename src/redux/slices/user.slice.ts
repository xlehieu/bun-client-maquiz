import { getExamHistory, getUserDetail } from '@/api/user.service';
import { ExamHistoryRecord, GeneralQuizInfo, UserDetail } from '@/@types/user.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
type UserState = {
    isFetchingExamHistory: boolean;
    examHistory: ExamHistoryRecord[];
    userProfile: UserDetail | null;
    isFetchingUserProfile: boolean;
};
const initialState: UserState = {
    isFetchingExamHistory: false,
    examHistory: [],
    userProfile: null,
    isFetchingUserProfile: false,
};
export const fetchUserProfile = createAsyncThunk('auth/fetchUserProfile', async () => {
    try {
        const response = await getUserDetail();
        return response.data;
    } catch (err) {
        toast.error('Lỗi');
    }
});
export const fetchExamHistory = createAsyncThunk('user/fetchExamHistory', async () => {
    try {
        const resExamHistory = await getExamHistory();
        return resExamHistory.data;
    } catch (err) {
        toast.error('Có lỗi khi lấy dữ liệu lịch sử làm bài');
    }
});
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        favoriteQuiz: (state, action: PayloadAction<{ slug: string }>) => {
            const idx = state.userProfile?.favoriteQuiz.findIndex((item) => item?.slug === action?.payload?.slug);
            if (idx)
                if (idx == -1) {
                    state.userProfile?.favoriteQuiz?.push(action.payload as any);
                } else {
                    state.userProfile?.favoriteQuiz?.splice(idx, 1);
                }
        },
        resetUser: (state) => {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state, action) => {
                state.isFetchingUserProfile = true;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isFetchingUserProfile = false;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                // state.isFetching=false
                state.userProfile = action.payload?.data || null;
            })
            .addCase(fetchExamHistory.pending, (state) => {
                state.isFetchingExamHistory = true;
            })
            .addCase(fetchExamHistory.rejected, (state) => {
                state.isFetchingExamHistory = false;
            })
            .addCase(fetchExamHistory.fulfilled, (state, action) => {
                state.isFetchingExamHistory = false;
                state.examHistory = action.payload?.data || [];
            });
    },
});

// Action creators are generated for each case reducer function
export const { resetUser, favoriteQuiz } = userSlice.actions;

export default userSlice.reducer;
