import { createSlice } from '@reduxjs/toolkit';
const initialState = {};
const answerChoiceReducer = createSlice({
    name: 'answerChoice',
    initialState,
    reducers: {
        addAnswerChoice: (state: any, action: any) => {
            state = { ...state };
            state[action.payload.currentPartIndex] = {
                ...state[action.payload.currentPartIndex],
                [action.payload.currentQuestionIndex]: {
                    chooseIndex: action.payload.answerIndex,
                    isCorrect: action.payload.isCorrect,
                },
            };
        },
    },
});
