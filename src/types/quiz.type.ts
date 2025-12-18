export type QuizDetailRecord = {
    _id: string;
    name?: string;
    description?: string;
    school?: string;
    subject: string;
    thumb: string;
    user: {
        _id: string;
        avatar: string;
        name: string;
    };
    quiz: QuizSection[];
    accessCount: number;
    examCount: number;
    topic: string;
    schoolYear: number;
    educationLevel: string[];
    slug: string;
    createdAt: string;
    nameNoAccent: string;
    updatedAt: string;
    deleted: boolean;
};
export type AnswerType_1_2 = {
    content: string;
    isCorrect: boolean;
};
export type QuestionType_1_2 = {
    questionType: number;
    questionContent: string;
    answers: AnswerType_1_2[];
};
export type QuizSection = {
    partName: string;
    questions: QuestionType_1_2[];
    isDisabled: boolean;
};

export type BodyCreateGeneralInformationQuiz = {
    name: string;
    description: string;
    school: string;
    subject: string[];
    topic: string[];
    schoolYear: number;
    educationLevel: string[];
    thumb: string;
};
