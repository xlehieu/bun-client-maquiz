import { getExamHistory, getUserDetail } from '@/api/user.service';
import { ExamHistoryRecord, GeneralQuizInfo, UserDetail } from '@/types/user.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
type UserState = {
    isFetchingExamHistory: boolean;
    examHistory: ExamHistoryRecord[];
    userProfile: UserDetail | null;
};
const initialState: UserState = {
    isFetchingExamHistory: false,
    examHistory: [],
    userProfile: null,
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
        updateUser: (state, action) => {
            const { name, email, phone, address, avatar, isAdmin, access_token, quizAccessHistory, favoriteQuiz } =
                action.payload;
            //state này dựa trên thằng initstate
        },
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
                // state.isFetching=true
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                // state.isFetching=false
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
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            console.log("action.payloadaction.payloadaction.payload",action.payload);
            const { name, email, phone, address, avatar, isAdmin, access_token, quizAccessHistory, favoriteQuiz } =
                action.payload;
            //state này dựa trên thằng initstate
        },
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
                // state.isFetching=true
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                // state.isFetching=false
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
export const { updateUser, resetUser, favoriteQuiz } = userSlice.actions;

export default userSlice.reducer;
