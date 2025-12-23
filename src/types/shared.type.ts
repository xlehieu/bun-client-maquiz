export type AnswerChoiceType1_2 = {
    chooseIndex: number;
    isCorrect: boolean;
};
export type AnswerChoiceType3 = {
    question: string;
    match: string;
    answer?: string;
};
export type AnswerChoices = Record<
    number,
    Record<number, AnswerChoiceType1_2 | AnswerChoiceType1_2[] | AnswerChoiceType3[]>
>;
