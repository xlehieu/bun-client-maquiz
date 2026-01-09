import { QuizPart } from './quiz.type';
import { AnswerChoices } from './shared.type';

export type BodyCreateExamAttempt = {
    classExamId: string;
    classId: string;
    quizExam: QuizPart[];
};
export type BodyUpdateScoreAndStatusExamAttempt = {
    score: number;
    status: 'doing' | 'timeout' | 'submitted';
    answerChoices: AnswerChoices;
};
export type ExamAttemptRecord = {
    classExamId: string;
    classId: string;
    createdAt: string;
    score: number;
    status: 'doing' | 'timeout' | 'submitted';
    user: {
        _id: string;
        email: string;
        name: string;
        avatar?: string;
    };
};
