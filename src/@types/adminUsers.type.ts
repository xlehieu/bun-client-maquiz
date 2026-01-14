import { QuizPart } from './quiz.type';

export type AdminUserRecord = {
    _id: string;
    email: string;
    isAdmin: false;
    phone: string;
    active: boolean;
    quizzes: QuizPart[];
    // "myClassrooms": [],
    enrolledClassrooms: string[];
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    // __v: number;
    // examHistory: [];
    // favoriteQuiz: [];
    // quizAccessHistory: [];
    isActive: false;
};
