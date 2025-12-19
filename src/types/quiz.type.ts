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
export type QuestionType_3 = {
  match: number;
  questionContent: string;
  answer: string;
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
  isUseChatBot: boolean;
};

export type BodyCreateQuestionQuiz = {
  quizId: string;
  partId: string;
  partName: string;
  questionType: string;
  questionContent?: string;
  answers?: AnswerType_1_2[];
  matchQuestions?: QuestionType_3[];
};
export type BodyUpdateQuestion = BodyCreateQuestionQuiz & {
  questionId: string;
};
