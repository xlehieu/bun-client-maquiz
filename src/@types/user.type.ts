export type UserDetail = {
    _id: string;
    email?: string;
    isAdmin?: boolean;
    phone?: string;
    address?: string;
    avatar?: string;
    name: string;
    quizAccessHistory: QuizAccessHistory[];
    favoriteQuiz: FavoriteQuiz[];
};
export type QuizAccessHistory = {
    _id?: string;
    name?: string;
    thumb: string;
    accessCount?: number;
    examCount?: number;
    questionCount?: number;
    slug: string;
    createdAt: string;
};
export type FavoriteQuiz = {
    _id?: string;
    name?: string;
    thumb: string;
    accessCount?: number;
    examCount?: number;
    questionCount?: number;
    slug: string;
    createdAt: string;
};
export type GeneralQuizInfo = {
    _id: string;
    name: string;
    thumb: string;
    accessCount: number;
    examCount: number;
    slug: string;
    createdAt: string;
};
//region refactor lại sau vì chưa cần
export type ExamHistoryRecord = {
    _id: string;
    user: string;
    quiz: GeneralQuizInfo;
    score: number;
    mode: string;
    answerChoices: [
        {
            '0': {
                '0': {
                    chooseIndex: 1;
                    isCorrect: true;
                };
                '1': {
                    chooseIndex: 2;
                    isCorrect: true;
                };
                '2': {
                    chooseIndex: 1;
                    isCorrect: true;
                };
                '3': {
                    chooseIndex: 0;
                    isCorrect: true;
                };
                '4': {
                    chooseIndex: 0;
                    isCorrect: true;
                };
                '5': {
                    chooseIndex: 2;
                    isCorrect: true;
                };
                '6': {
                    chooseIndex: 1;
                    isCorrect: true;
                };
                '7': {
                    chooseIndex: 0;
                    isCorrect: true;
                };
                '8': {
                    chooseIndex: 1;
                    isCorrect: true;
                };
                '9': {
                    chooseIndex: 2;
                    isCorrect: true;
                };
                '10': {
                    chooseIndex: 3;
                    isCorrect: true;
                };
                '11': {
                    chooseIndex: 3;
                    isCorrect: true;
                };
                '12': {
                    chooseIndex: 0;
                    isCorrect: true;
                };
                '13': {
                    chooseIndex: 0;
                    isCorrect: false;
                };
                '14': {
                    chooseIndex: 3;
                    isCorrect: true;
                };
            };
        },
    ];
    __v: 0;
};

export type BodyUpdateUser = {
    avatar: string;
    address: string;
    phone: string;
    name: string;
    email: string;
};
