import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type AdminState = {
    adminUserFilter: {
        skip: number;
        limit: number;
        name?: string;
    };
    adminClassroomFilter: {
        skip: number;
        limit: number;
        keyword?: string;
    };
    adminQuizFilter: {
        skip: number;
        limit: number;
        keyword?: string;
    };
};
const initStateAdmin: AdminState = {
    adminUserFilter: {
        limit: 20,
        skip: 0,
    },
    adminClassroomFilter: {
        limit: 20,
        skip: 0,
    },
    adminQuizFilter: {
        limit: 20,
        skip: 0,
    },
};

const adminFilterSlice = createSlice({
    name: 'admin',
    initialState: initStateAdmin,
    reducers: {
        setAdminUserFilter(state, action: PayloadAction<Partial<AdminState['adminUserFilter']>>) {
            state.adminUserFilter = {
                ...state.adminUserFilter,
                ...action.payload,
            };
        },
        setAdminClassroomFilter(state, action: PayloadAction<Partial<AdminState['adminClassroomFilter']>>) {
            state.adminClassroomFilter = {
                ...state.adminClassroomFilter,
                ...action.payload,
            };
        },
        setAdminQuizFilter(state, action: PayloadAction<Partial<AdminState['adminQuizFilter']>>) {
            state.adminQuizFilter = {
                ...state.adminQuizFilter,
                ...action.payload,
            };
        },
    },
});

export const { setAdminUserFilter, setAdminClassroomFilter, setAdminQuizFilter } = adminFilterSlice.actions;

export default adminFilterSlice.reducer;
