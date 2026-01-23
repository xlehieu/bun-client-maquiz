import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
export type DiscoverFilterState = {
    filter: {
        limit: number;
        skip: number;
        subject?: string;
        schoolYear?: number[];
        educationLevel?: string[];
        name?: string;
        school?: string;
    };
};
const discorveryInitState: DiscoverFilterState = {
    filter: { limit: 12, skip: 0, name: '' },
};

const authSlice = createSlice({
    name: 'discovery',
    initialState: discorveryInitState,
    reducers: {
        setFilterDiscovery: (state, action: PayloadAction<Partial<DiscoverFilterState['filter']>>) => {
            state.filter = {
                ...state.filter,
                ...action.payload,
            };
        },
    },
    extraReducers(builder) {
        builder;
    },
});
export const { setFilterDiscovery } = authSlice.actions;

export default authSlice.reducer;
