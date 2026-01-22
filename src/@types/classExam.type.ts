import { QuizDetailRecord, QuizPart } from './quiz.type';
import { AnswerChoices } from './shared.type';
export type ClassExamStatus = 'draft' | 'open' | 'closed';

export type BodyCreateClassExam = {
    classId: string;
    quizId: string;
    startTime: string;
    endTime: string;
    duration: number;
    // maxAttempts: number;
};

export type ClassExamItem = {
    _id: string;
    type: 'classExam';
    classId: string;
    quizDetail: QuizDetailRecord;
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
type ExamAttemptStatus = 'doing' | 'timeout' | 'submitted';
export type ExamAttempt = {
    _id: string;
    userId: string;
    classId: string;
    classExamId: string;
    quizExam: QuizPart[];
    score: number;
    status: ExamAttemptStatus;
    createdAt: string;
    updatedAt: string;
    answerChoices?: AnswerChoices;
};
