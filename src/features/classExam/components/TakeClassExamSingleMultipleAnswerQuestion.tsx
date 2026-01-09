'use client';
import { questionTypeContent } from '@/common/constants';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import { chooseQuestionType1, chooseQuestionType2 } from '@/redux/slices/takeQuiz.slice';
import { QuestionType_1_2 } from '@/@types/quiz.type';
import { AnswerChoiceType1_2 } from '@/@types/shared.type';
// import { getClassNameQuestion } from '@/utils';
import { Checkbox, Radio } from 'antd';
import HTMLReactParser from 'html-react-parser/lib/index';
import { chooseExamQuestionType1, chooseExamQuestionType2 } from '@/redux/slices/takeExam.slice';

// Phần  giữa (chọn đáp án)
const sanitizeHTML = (html: any) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.body.querySelectorAll('p,span');

    elements.forEach((el: any) => {
        if (el.style && el.style.backgroundColor) {
            el.style.backgroundColor = ''; // Loại bỏ background-color
            el.style.color = ''; // Loại bỏ color
        }
    });

    return doc.body.innerHTML;
};
const TakeClassExamSingleMultipleAnswerQuestion = ({ autoNextQuestion }: { autoNextQuestion: () => void }) => {
    const { examDataQuizPart, currentQuestionIndex, currentPartIndex, currentQuestionType, answerChoices } =
        useAppSelector((state) => state.takeExam);
    const dispatch = useAppDispatch();
    const handleGetChooseIndexAnswer = (indexInRenderAnswer: number) => {
        if (currentQuestionType === 1 && currentPartIndex in (answerChoices || {})) {
            if (currentQuestionIndex in answerChoices[currentPartIndex]) {
                if (
                    (answerChoices[currentPartIndex][currentQuestionIndex] as AnswerChoiceType1_2).chooseIndex ===
                    indexInRenderAnswer
                )
                    return true;
            }
        }
        if (currentQuestionType === 2 && currentPartIndex in answerChoices) {
            const choices = answerChoices[currentPartIndex][currentQuestionIndex];
            if (Array.isArray(choices)) {
                // tìm xem trong answer choice có index render không? nếu có thì return về isCorrect của nó
                const foundChoice = choices.find(
                    (choice) => (choice as AnswerChoiceType1_2).chooseIndex == indexInRenderAnswer,
                );
                return foundChoice ? true : false;
            }
        }
        return false;
    };
    const handleChooseAnswerQuestion1 = (chooseIndex: number, isCorrect: boolean) => {
        // if (answerChoices?.[currentPartIndex]?.[currentQuestionIndex]) return;
        dispatch(
            chooseExamQuestionType1({
                currentPartIndex,
                currentQuestionIndex,
                chooseIndex,
                isCorrect,
            }),
        );
        autoNextQuestion();
    };
    const handleChooseAnswerQuestion2 = (chooseIndex: number, isCorrect: boolean) => {
        dispatch(
            chooseExamQuestionType2({
                currentPartIndex,
                currentQuestionIndex,
                chooseIndex,
                isCorrect,
            }),
        );
        // autoNextQuestion();
    };
    return (
        <div className="flex flex-col h-full bg-white p-4 md:p-6">
            {/* Header: Số câu & Loại câu hỏi */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">
                        {currentQuestionIndex + 1}
                    </span>
                    <span className="font-bold text-slate-700">Câu hỏi</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {questionTypeContent?.[currentQuestionType || 1]}
                </div>
            </div>

            {/* Nội dung câu hỏi */}
            <div className="mb-8 text-lg font-semibold text-slate-800 leading-relaxed">
                {HTMLReactParser(
                    (examDataQuizPart?.[currentPartIndex]?.questions?.[currentQuestionIndex] as QuestionType_1_2)
                        .questionContent || '',
                )}
            </div>

            {/* Danh sách câu trả lời */}
            <div className="flex flex-col gap-4">
                {(
                    examDataQuizPart?.[currentPartIndex]?.questions?.[currentQuestionIndex] as QuestionType_1_2
                )?.answers.map((answer, index: number) => {
                    const isChecked = handleGetChooseIndexAnswer(index);

                    // Lấy class từ function của bạn (giả sử nó trả về các class như 'bg-green-500', 'bg-red-500',...)
                    // const statusClass = getClassNameQuestion({
                    //     answerChoices,
                    //     currentPartIndex,
                    //     currentQuestionIndex,
                    //     isCorrectAnswerRender: answer.isCorrect,
                    //     questionType: currentQuestionType,
                    //     indexAnswer: index,
                    // });

                    return (
                        <label
                            key={index}
                            className={`
          relative flex items-center p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer select-none
          ${isChecked ? 'border-blue-500 bg-blue-50' : ''} 
          ${!isChecked ? 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-md' : ''}
        `}
                        >
                            <div className="mr-4 flex items-center">
                                {examDataQuizPart?.[currentPartIndex]?.questions?.[currentQuestionIndex]
                                    ?.questionType === 1 ? (
                                    <Radio
                                        onChange={() => handleChooseAnswerQuestion1(index, answer.isCorrect)}
                                        checked={isChecked}
                                        className="scale-125 custom-radio"
                                    />
                                ) : (
                                    <Checkbox
                                        onChange={() => handleChooseAnswerQuestion2(index, answer.isCorrect)}
                                        checked={isChecked}
                                        className="scale-125 custom-checkbox"
                                    />
                                )}
                            </div>

                            <div className="flex-1 text-base font-semibold leading-relaxed">
                                {HTMLReactParser(sanitizeHTML(answer.content))}
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default TakeClassExamSingleMultipleAnswerQuestion;
