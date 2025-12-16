import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
type TakeQuizState = {
    currentQuizId?: string;
};
const initStateTakeQuiz: TakeQuizState = {};

const takeQuizSlice = createSlice({
    name: 'takeQuiz',
    initialState: initStateTakeQuiz,
    reducers: {},
});
const takeQuizPersistConfig = {
    key: 'takeQuiz',
    storage,
    whitelist: [''],
};
export const {} = takeQuizSlice.actions;

export default persistReducer(takeQuizPersistConfig, takeQuizSlice.reducer);
