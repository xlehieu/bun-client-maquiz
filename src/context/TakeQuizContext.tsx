"use client";
import LoadingComponent from "@/components/UI/LoadingComponent";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { toast } from "sonner";
import * as QuizService from "@/api/quiz.service";
import { useAppSelector } from "@/redux/hooks";
export const TakeQuizContext = createContext<any>({});
export const TakeMatchingQuestionContext = createContext<any>({});
const TakeQuizProvider = ({
  children,
  answerChoiceReducer,
}: {
  children: ReactNode;
  answerChoiceReducer: any;
}) => {
  const slug = useParams()?.slug as string;
  //region GET QUIZ DETAIL BY SLUG
  const { currentQuizPreviewDetail } = useAppSelector(
    (state) => state.takeQuiz
  );
  const [timePass, setTimePass] = useState(2000);
  const [isEnded, setIsEnded] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerChoices, dispatchAnswerChoices] = useReducer(
    answerChoiceReducer,
    {}
  );
  const [currentQuestionType, setCurrentQuestionType] = useState(0);
  const [countAnswerChoices, setCountAnswerChoices] = useState(0);
  const [countQuestionQuizDetail, setCountQuestionQuizDetail] = useState(0);
  // set cho current question type khi vào bài thi và đếm số câu hỏi trong bài
  //     useEffect(() => {
  //         if (!currentQuizPreviewDetail?._id) return;
  //         if (currentQuizPreviewDetail.quiz) {
  //             if (currentQuizPreviewDetail?.quiz[currentQuestionIndex]?.questions[currentQuestionIndex])
  //                 setCurrentQuestionType(
  //                     queryQuizDetail.data?.quiz[currentQuestionIndex]?.questions[currentQuestionIndex]?.questionType ??
  //                         1,
  //                 );

  //             if (Array.isArray(queryQuizDetail.data.quiz)) {
  //                 setCountQuestionQuizDetail(() => {
  //                     return queryQuizDetail.data.quiz.reduce((accumulator: any, partDetail: any) => {
  //                         return (accumulator += partDetail.questions.length);
  //                     }, 0);
  //                 });
  //             }
  //         }
  //     }, [currentQuizPreviewDetail]);

  //Đếm tất cả số câu hỏi trong câu trả lời (answer choices)
  useEffect(() => {
    if (answerChoices) {
      let count = 0;
      Object.entries(answerChoices).forEach(([keyOfPart, valueOfPart]: any) => {
        if (typeof valueOfPart === "object") {
          Object.entries(valueOfPart).forEach(() => {
            count++;
          });
        }
      });
      setCountAnswerChoices(count);
    }
  }, [answerChoices]);
  //
  //Set currentQuestionType khi thay đổi câu hỏi
  useEffect(() => {
    if (currentQuizPreviewDetail) {
      const quiz = currentQuizPreviewDetail.quiz;
      if (quiz) {
        if (quiz[currentPartIndex]?.questions[currentQuestionIndex]) {
          setCurrentQuestionType(
            quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]
              ?.questionType
          );
        }
        if (
          currentQuestionIndex === quiz?.[currentPartIndex]?.questions?.length
        ) {
          if (currentPartIndex === quiz.length - 1) return;
          setCurrentPartIndex(currentPartIndex + 1);
          setCurrentQuestionIndex(0);
        }
      }
    }
  }, [currentQuestionIndex]);
  //     useEffect(() => {
  //         if (queryQuizDetail?.data) {
  //             const quiz = queryQuizDetail?.data?.quiz;
  //             if (quiz) {
  //                 if (quiz[currentPartIndex]?.questions[currentQuestionIndex]) {
  //                     setCurrentQuestionType(quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.questionType);
  //                 }
  //             }
  //         }
  //         setCurrentQuestionIndex(0);
  //     }, [currentPartIndex]);
  //END
  return (
    <TakeQuizContext.Provider
      value={{
        slug,
        currentQuizPreviewDetail,
        timePass,
        setTimePass,
        isEnded,
        setIsEnded,
        isTimeout,
        setIsTimeout,
        currentPartIndex,
        setCurrentPartIndex,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answerChoices,
        dispatchAnswerChoices,
        currentQuestionType,
        countAnswerChoices,
        countQuestionQuizDetail,
      }}
    >
      {children}
    </TakeQuizContext.Provider>
  );
};

export const ShuffleProvider = ({
  children,
  reducerMatchingQuestion,
}: {
  children: ReactNode;
  reducerMatchingQuestion: any;
}) => {
  const [shuffleMatchQuestion, setShuffleMatchQuestion] = useState<any>({});
  const [answerMatchingQuestion, dispatchAnswerMatchingQuestion] = useReducer(
    reducerMatchingQuestion,
    {}
  );
  return (
    <TakeMatchingQuestionContext.Provider
      value={{
        shuffleMatchQuestion,
        setShuffleMatchQuestion,
        answerMatchingQuestion,
        dispatchAnswerMatchingQuestion,
      }}
    >
      {children}
    </TakeMatchingQuestionContext.Provider>
  );
};
export default TakeQuizProvider;
