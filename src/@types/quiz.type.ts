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
    quiz: QuizPart[];
    questionCount: number;
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
    isUseChatBot: boolean;
    isAdminDisabled: boolean;
    isDisabled: boolean;
};
export type AnswerType_1_2 = {
    content: string;
    isCorrect: boolean;
};
export type QuestionType_1_2 = {
    questionId: string;
    questionType: number;
    questionContent: string;
    answers: AnswerType_1_2[];
};
export type QuestionType_3 = {
    match: number;
    questionContent: string;
    answer: string;
    answerId: string;
    _id: string;
};
export type MappingMatchQuestion = {
    optionMatchQuestion_Question: OptionMatchQuestion_Question[];
    optionMatchQuestion_Answer: OptionMatchQuestion_Answer[];
};
export type MatchQuestion = {
    questionId: string;
    matchQuestions: QuestionType_3[];
    questionType: number;
    mappingMatchQuestion?: MappingMatchQuestion;
};
export type QuizPart = {
    partName: string;
    partId: string;
    questions: (QuestionType_1_2 | MatchQuestion)[];
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
    isUseChatBot: boolean;
};

export type BodyUpsertQuestionQuiz = {
    quizId: string;
    partId: string;
    questionId: string;
    partName: string;
    questionType: number;
    questionContent?: string;
    answers?: AnswerType_1_2[];
    matchQuestions?: QuestionType_3[];
};
export type OptionMatchQuestion_Question = {
    questionContent: string;
    answerId: string;
};
export type OptionMatchQuestion_Answer = {
    answer: string;
    answerId: string;
};
