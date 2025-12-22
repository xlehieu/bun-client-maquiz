import { QuestionType_1_2, QuizDetailRecord } from "@/types/quiz.type";

export const checkQuestionCorrectQuestionType2 = (
  currentQuizDetail: QuizDetailRecord | null,
  answerChoices: any,
  currentQuestionType: number,
  currentSectionIndex: number,
  currentQuestionIndex: number
) => {
  if (
    typeof currentQuizDetail === "undefined" &&
    typeof answerChoices === "undefined" &&
    typeof currentQuestionType === "undefined" &&
    typeof currentSectionIndex === "undefined" &&
    typeof currentQuestionIndex === "undefined"
  )
    return;
  if (
    currentQuizDetail?.quiz &&
    currentQuestionType === 2 &&
    currentSectionIndex in answerChoices
  ) {
    if (currentQuestionIndex in answerChoices[currentSectionIndex]) {
      const quiz = currentQuizDetail.quiz;
      if (quiz[currentSectionIndex].questions[currentQuestionIndex]) {
        const answers = (
          quiz[currentSectionIndex].questions[
            currentQuestionIndex
          ] as QuestionType_1_2
        ).answers; // quiz detail
        const choices =
          answerChoices[currentSectionIndex][currentQuestionIndex]; //answer choices
        if (Array.isArray(answers) && Array.isArray(choices)) {
          let countAnswerCorrectInQuizDetail = 0;
          answers.forEach((answer) => {
            if (answer.isCorrect) return countAnswerCorrectInQuizDetail++;
          }, 0);
          let countAnswerCorrectInAnswerChoices = 0;
          choices.forEach((choice) => {
            if (choice.isCorrect) return countAnswerCorrectInAnswerChoices++;
          }, 0);
          const everyCorrect = choices.every(
            (choice) => choice.isCorrect === true
          );
          if (
            countAnswerCorrectInQuizDetail ===
              countAnswerCorrectInAnswerChoices &&
            everyCorrect
          ) {
            return true;
          }
          return false;
        }
      }
    }
  }
  return null;
};
export const questionTypeContent: Record<number, string> = {
  1: "Câu hỏi một đáp án",
  2: "Câu hỏi nhiều đáp án",
  3: "Câu hỏi nối đáp án",
};
