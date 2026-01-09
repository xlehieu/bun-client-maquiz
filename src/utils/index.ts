import { QuestionType_1_2, QuizDetailRecord, QuizPart } from '@/@types/quiz.type';
import { AnswerChoices, AnswerChoiceType1_2, AnswerChoiceType3 } from '@/@types/shared.type';

export const isJsonString = (data: any) => {
    try {
        JSON.parse(data);
    } catch (err) {
        return false;
    }
    return true;
};
export const showImage = (img: any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });
};
export function boDau(str: string) {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

export const isNumber = (number: number) => {
    try {
        return !isNaN(Number(number)); // isNaN sẽ kiểm tra đầu vào nếu không phải là dạng số sẽ trả ra true
        // và chúng ta đang kiểm tra là số hay không nên để phủ định, nếu là dạng số thì sẽ true
    } catch {
        return false;
    }
};

export const handleCountQuestion = (quiz: QuizPart[]) => {
    if (Array.isArray(quiz)) {
        return quiz.reduce((accumulator, partCurrent) => {
            return accumulator + partCurrent?.questions?.length;
        }, 0);
    }
    return 0;
};

export const shuffleArray = (arr: any[]) => {
    if (!Array.isArray(arr)) return arr;
    const newArr = [...arr];
    // chỉ lặp đến i =1 vì khi arr[0] đảo với arr[0] thì không cần thiết
    for (let i = newArr.length - 1; i > 0; i--) {
        const randomPos = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[randomPos]] = [newArr[randomPos], newArr[i]];
    }
    return newArr;
};
type GetClassNameQuestionType = {
    answerChoices: AnswerChoices;
    questionType?: number;
    currentPartIndex: number;
    currentQuestionIndex: number;
    isCorrectAnswerRender: boolean;
    indexAnswer: number;
};
const classNameCorrect = '!bg-green-700 text-white';
const classNameIncorrect = '!bg-red-600 text-white';
export const getClassNameQuestion = ({
    answerChoices,
    questionType,
    currentPartIndex,
    currentQuestionIndex,
    isCorrectAnswerRender,
    indexAnswer,
}: GetClassNameQuestionType) => {
    if (questionType == 1) {
        if (
            currentPartIndex in answerChoices &&
            (answerChoices?.[currentPartIndex]?.[currentQuestionIndex] as AnswerChoiceType1_2)?.isCorrect &&
            isCorrectAnswerRender
        )
            return classNameCorrect;
        else if (
            currentPartIndex in answerChoices &&
            (answerChoices?.[currentPartIndex]?.[currentQuestionIndex] as AnswerChoiceType1_2)?.isCorrect === false &&
            (answerChoices?.[currentPartIndex]?.[currentQuestionIndex] as AnswerChoiceType1_2)?.chooseIndex ===
                indexAnswer
        ) {
            return classNameIncorrect;
        }
    } else if (questionType == 2 && currentPartIndex in answerChoices) {
        const choices = answerChoices[currentPartIndex][currentQuestionIndex];
        if (Array.isArray(choices)) {
            // tìm xem trong answer choice có questionIndex render không? nếu có thì return về isCorrect của nó
            const foundChoice = choices.find((choice) => (choice as AnswerChoiceType1_2).chooseIndex === indexAnswer);
            const check = foundChoice ? (foundChoice as AnswerChoiceType1_2).isCorrect : null;
            if (check === true) return classNameCorrect;
            else if (check === false) return classNameIncorrect;
        }
    }
};
export const checkQuestionCorrectQuestionType2 = (
    currentQuizDetail: { quiz: QuizPart[] } | null,
    answerChoices: any,
    currentQuestionType: number,
    currentSectionIndex: number,
    currentQuestionIndex: number,
) => {
    if (
        typeof currentQuizDetail === 'undefined' &&
        typeof answerChoices === 'undefined' &&
        typeof currentQuestionType === 'undefined' &&
        typeof currentSectionIndex === 'undefined' &&
        typeof currentQuestionIndex === 'undefined'
    )
        return;
    if (currentQuizDetail?.quiz && currentQuestionType === 2 && currentSectionIndex in answerChoices) {
        if (currentQuestionIndex in answerChoices[currentSectionIndex]) {
            const quiz = currentQuizDetail.quiz;
            if (quiz[currentSectionIndex].questions[currentQuestionIndex]) {
                const answers = (quiz[currentSectionIndex].questions[currentQuestionIndex] as QuestionType_1_2).answers; // quiz detail
                const choices = answerChoices[currentSectionIndex][currentQuestionIndex]; //answer choices
                if (Array.isArray(answers) && Array.isArray(choices)) {
                    let countAnswerCorrectInQuizDetail = 0;
                    answers.forEach((answer) => {
                        if (answer.isCorrect) return countAnswerCorrectInQuizDetail++;
                    }, 0);
                    let countAnswerCorrectInAnswerChoices = 0;
                    choices.forEach((choice) => {
                        if (choice.isCorrect) return countAnswerCorrectInAnswerChoices++;
                    }, 0);
                    const everyCorrect = choices.every((choice) => choice.isCorrect === true);
                    if (countAnswerCorrectInQuizDetail === countAnswerCorrectInAnswerChoices && everyCorrect) {
                        return true;
                    }
                    return false;
                }
            }
        }
    }
    return null;
};
export const checkCorrectAnswer = ({
    questionIndex,
    partIndex,
    answerChoices,
    quizDetail,
}: {
    questionIndex: number;
    partIndex: number;
    answerChoices: AnswerChoices;
    quizDetail: QuizDetailRecord;
}) => {
    if (partIndex in (answerChoices || {})) {
        if (
            questionIndex in answerChoices[partIndex] &&
            quizDetail?.quiz[partIndex]?.questions[questionIndex].questionType === 1
        ) {
            return (answerChoices[partIndex][questionIndex] as AnswerChoiceType1_2)?.isCorrect;
        } else if (
            questionIndex in answerChoices[partIndex] &&
            quizDetail?.quiz[partIndex]?.questions[questionIndex].questionType === 2
        ) {
            return checkQuestionCorrectQuestionType2(quizDetail, answerChoices, 2, partIndex, questionIndex);
        } else if (
            questionIndex in answerChoices[partIndex] &&
            quizDetail?.quiz[partIndex]?.questions[questionIndex].questionType === 3
        ) {
            if (
                (answerChoices?.[partIndex]?.[questionIndex] as AnswerChoiceType3[])?.every?.(
                    (itemQuestionAnswer) =>
                        itemQuestionAnswer?.question?.replace?.('question', '') ===
                        itemQuestionAnswer?.answer?.replace?.('answer', ''),
                )
            ) {
                return true;
            }
            return false;
        }
    }
    return null;
};
export function hasValidTextInHTML(html: string) {
    const strippedText = html.replace(/<\/?p>/g, '').trim(); // Xóa thẻ <p> nhưng giữ nội dung
    return strippedText.length > 0;
}
