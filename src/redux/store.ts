import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user.slice';
import quizReducer from './slices/quiz.slice';
export default configureStore({
    reducer: {
        user: userReducer,
        quiz: quizReducer,
    },
});
