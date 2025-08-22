import { questionTypeContent } from '@/common/constants';
import { shuffleArray } from '@/utils';
import HTMLReactParser from 'html-react-parser/lib/index';
import React, { Fragment } from 'react';

const QuestionDetail = ({ question, index }: { question: any; index: number }) => {
    if ([1, 2].includes(question?.questionType))
        return (
            <div className={`mt-3 ${index !== 0 && 'border-t'}`}>
                <div className="flex flex-wrap">
                    <span className="text-camdat font-bold mr-1">Câu: {index + 1}</span>
                    {HTMLReactParser(question?.questionContent)}
                    <p className="ml-1">({questionTypeContent[question?.questionType]})</p>
                </div>
                <div className="flex flex-wrap flex-col">
                    {question?.answers &&
                        question?.answers?.map((answer: any, index: number) => (
                            <div key={index}>{HTMLReactParser(answer.content)}</div>
                        ))}
                </div>
            </div>
        );
    else if (Number(question?.questionType) === 3) {
        const matchQuestionContent = shuffleArray(
            question?.matchQuestions?.map((matchQuestion: any) => {
                return {
                    questionContent: matchQuestion.questionContent,
                    match: matchQuestion.match,
                };
            }),
        );
        const matchQuestionAnswers = shuffleArray(
            question?.matchQuestions?.map((matchQuestion: any) => {
                return {
                    answer: matchQuestion.answer,
                    match: matchQuestion.match,
                };
            }),
        );
        return (
            <div className={`mt-3 ${index !== 0 && 'border-t'}`}>
                <span className="text-camdat font-bold mr-1">Câu: {index + 1}</span>(
                {questionTypeContent[question?.questionType]})
                <div className="grid grid-cols-2">
                    {question?.matchQuestions &&
                        question?.matchQuestions?.map((matchQuestion: any, index: number) => (
                            <Fragment key={index}>
                                <div className=" mt-2">
                                    {HTMLReactParser(matchQuestionContent?.[index]?.questionContent || '')}
                                </div>
                                <div className=" mt-2">
                                    {HTMLReactParser(matchQuestionAnswers?.[index]?.answer || '')}
                                </div>
                            </Fragment>
                        ))}
                </div>
            </div>
        );
    }
    return null;
};
const QuizPreviewQuestion = ({ quizDetail, currentPartIndex }: any) => {
    return (
        <div className="relative">
            {quizDetail.quiz[currentPartIndex]?.questions instanceof Array && (
                <div className="relative">
                    {quizDetail.quiz[currentPartIndex]?.questions?.length <= 5 ? (
                        <div className="mt-2 h-96 no-horizontal-scroll maquiz-scroll pb-10">
                            {quizDetail.quiz[currentPartIndex]?.questions?.map((question: any, index: number) => (
                                <QuestionDetail key={index} question={question} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-2 h-96 no-horizontal-scroll maquiz-scroll pb-10">
                            {quizDetail.quiz[currentPartIndex]?.questions
                                ?.slice(0, 5)
                                .map((question: any, index: number) => (
                                    <QuestionDetail key={index} question={question} index={index} />
                                ))}
                        </div>
                    )}
                    <div className="absolute w-full px-5 py-2 bottom-0 bg-yellow-500">
                        <p className="font-bold text-white">
                            Bạn đang xem ở chế độ xem trước, hãy bắt đầu ôn thi nào!!!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPreviewQuestion;
