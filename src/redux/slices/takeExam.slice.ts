import { QuizPart } from '@/@types/quiz.type';
import { AnswerChoices, AnswerChoiceType1_2 } from '@/@types/shared.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type TakeExamState = {
    currentQuizId?: string;
    currentPartIndex: number;
    currentQuestionIndex: number;
    examDataQuizPart: QuizPart[] | null;
    currentQuestionType?: number;
    isFetching: boolean;
    timePassQuestion: number;
    answerChoices: AnswerChoices;
    countQuestionQuizExam: number;
    isEnded: boolean;
    isTimeout: boolean;
};
const initStateTakeExam: TakeExamState = {
    isFetching: false,
    examDataQuizPart: null,
    currentPartIndex: 0,
    currentQuestionIndex: 0,
    timePassQuestion: 2000,
    countQuestionQuizExam: 0,
    isEnded: false,
    isTimeout: false,
    answerChoices: {},
};
const takeExamSlice = createSlice({
    name: 'takeExam',
    initialState: initStateTakeExam,
    reducers: {
        setExamTimePassQuestion: (state, action: PayloadAction<number>) => {
            state.timePassQuestion = action.payload;
        },
        setExamCurrentPartIndex: (state, action: PayloadAction<number>) => {
            state.currentPartIndex = action.payload;
        },
        setExamCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
            state.currentQuestionIndex = action.payload;
        },
        setExamCurrentQuestionType: (state, action: PayloadAction<number>) => {
            state.currentQuestionType = action.payload;
        },
        endTakeExam: (state) => {
            state.isEnded = true;
        },
        timeOutExam: (state) => {
            state.isTimeout = true;
        },
        setExamDataQuizPart: (state, action: PayloadAction<QuizPart[]>) => {
            state.examDataQuizPart = action.payload || null;
            if (state.examDataQuizPart) {
                state.countQuestionQuizExam = state.examDataQuizPart.reduce((acc, curPart) => {
                    return acc + (curPart?.questions?.length || 0);
                }, 0);
            }
        },
        chooseExamQuestionType1: (
            state,
            action: PayloadAction<{
                currentPartIndex: number;
                currentQuestionIndex: number;
                chooseIndex: number;
                isCorrect: boolean;
            }>,
        ) => {
            state.answerChoices = {
                ...(state.answerChoices || {}),
                [action.payload.currentPartIndex]: {
                    ...(state?.answerChoices?.[action.payload?.currentPartIndex] || {}),
                    [action.payload.currentQuestionIndex]: {
                        chooseIndex: action.payload.chooseIndex,
                        isCorrect: action.payload.isCorrect,
                    },
                },
            };
        },
        chooseExamQuestionType2: (
            state,
            action: PayloadAction<{
                currentPartIndex: number;
                currentQuestionIndex: number;
                chooseIndex: number;
                isCorrect: boolean;
            }>,
        ) => {
            const { currentPartIndex, currentQuestionIndex, chooseIndex, isCorrect } = action.payload;

            if (!state.answerChoices[currentPartIndex]) {
                state.answerChoices[currentPartIndex] = {};
            }

            const currentChoices = state.answerChoices?.[currentPartIndex]?.[currentQuestionIndex] ?? [];

            const choicesArray: AnswerChoiceType1_2[] = Array.isArray(currentChoices)
                ? [...(currentChoices as AnswerChoiceType1_2[])]
                : [];

            const existedIndex = choicesArray.findIndex((choice) => choice.chooseIndex === chooseIndex);
            if (existedIndex !== -1) {
                choicesArray.splice(existedIndex, 1);
            } else {
                choicesArray.push({
                    chooseIndex,
                    isCorrect,
                });
            }

            state.answerChoices[currentPartIndex][currentQuestionIndex] = choicesArray;
        },
        chooseExamQuestionType3: (
            state,
            action: PayloadAction<{
                currentPartIndex: number;
                currentQuestionIndex: number;
                matchQuestion: any;
            }>,
        ) => {
            const { currentPartIndex, currentQuestionIndex, matchQuestion } = action.payload;
            const choices = { ...state.answerChoices };
            if (!choices[currentPartIndex]) {
                choices[currentPartIndex] = {};
            }
            if (Array.isArray(matchQuestion)) {
                choices[currentPartIndex] = {
                    ...(choices?.[currentPartIndex] || {}),
                    [currentQuestionIndex]: [...(matchQuestion || [])],
                };
            }
            state.answerChoices = { ...choices };
        },
        setExamAnswerChoices: (state, action: PayloadAction<AnswerChoices>) => {
            state.answerChoices = action.payload || null;
        },
        resetTakeExam: () => {
            return { ...initStateTakeExam };
        },
    },
});
export const {
    setExamTimePassQuestion,
    setExamCurrentQuestionIndex,
    setExamCurrentPartIndex,
    endTakeExam,
    setExamCurrentQuestionType,
    timeOutExam,
    chooseExamQuestionType1,
    chooseExamQuestionType2,
    chooseExamQuestionType3,
    resetTakeExam,
    setExamDataQuizPart,
    setExamAnswerChoices,
} = takeExamSlice.actions;

export default takeExamSlice.reducer;
