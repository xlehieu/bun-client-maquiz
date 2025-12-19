import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
type QuizState = {
  currentCreateQuizId?: string;
  currentQuizPartId: string;
};

const initStateQuiz: QuizState = {
  currentCreateQuizId: "689c55fc138c946973e6e330",
  currentQuizPartId: uuidv4(),
};

const createQuizSlice = createSlice({
  name: "quiz",
  initialState: initStateQuiz,
  reducers: {
    setCurrentCreateQuizId: (state, action: PayloadAction<string>) => {
      state.currentCreateQuizId = action.payload;
    },
    setCurrentQuizPartId: (state, action: PayloadAction<string>) => {
      state.currentQuizPartId = action.payload;
    },
  },
});
export const { setCurrentCreateQuizId, setCurrentQuizPartId } =
  createQuizSlice.actions;

export default createQuizSlice.reducer;
