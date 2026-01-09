import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { Action, configureStore, ThunkAction, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // localStorage
import userSlice from './slices/user.slice';
import quizReducer from './slices/quiz.slice';
import authReducer from './slices/auth.slice';
import takeQuizReducer from './slices/takeQuiz.slice';
import questionTypeReducer from './slices/questionType.slice';
import classroomReducer from './slices/classrooms.slice';
import takeExamReducer from './slices/takeExam.slice';
const rootReducer = combineReducers({
    auth: authReducer,
    user: userSlice,
    quiz: quizReducer,
    takeQuiz: takeQuizReducer,
    questionType: questionTypeReducer,
    classroom: classroomReducer,
    takeExam: takeExamReducer,
});
const persistConfig = {
    key: 'root',
    storage,
    whitelist: [], // chỉ lưu 2 thằng này
    blacklist: [], // muốn bỏ thằng nào thì thêm vào đây
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
