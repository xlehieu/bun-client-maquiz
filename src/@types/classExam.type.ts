import { QuizDetailRecord } from "./quiz.type";
export type ClassExamStatus = "draft" | "open" | "closed";
export type BodyCreateClassExam = {
  classId: string;
  quizId: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxAttempts: number;
};

export type ClassExamItem = {
  _id: string;
  type: "classExam";
  classId: string;
  quizDetail: Omit<QuizDetailRecord, "quiz">;
  startTime: string;
  endTime: string;
  duration: number;
  maxAttempts: number;
  status: ClassExamStatus;
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
  isOpen: boolean;
};
