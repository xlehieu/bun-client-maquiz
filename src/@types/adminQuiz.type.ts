import { QuizDetailRecord } from './quiz.type';

export type AdminQuizRecord = Omit<QuizDetailRecord, 'user'> & {
    userInfo: QuizDetailRecord['user'];
};
