import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentPartIndex, setCurrentQuestionIndex, setCurrentQuestionType } from '@/redux/slices/takeQuiz.slice';
import { checkCorrectAnswer } from '@/utils';
import { Col, Row } from 'antd';
import { questionTypeContent } from '../constants';

const TableQuestion = () => {
    const dispatch = useAppDispatch();
    const {
        currentPartIndex,
        answerChoices,
        currentQuizPreviewDetail: quizDetail,
        currentQuestionType,
        currentQuestionIndex,
    } = useAppSelector((state) => state.takeQuiz);
    return (
        <section>
            <Row gutter={[12, 12]} className="px-2 py-2 bg-white rounded shadow w-full mb-5">
                <Col xs={24} className="mb-2 flex-1 flex flex-row justify-between">
                    <p>Mục lục phần thi</p>
                </Col>
                <Col xs={24}>
                    <div className="grid grid-cols-2 gap-3 w-full">
                        {quizDetail?.quiz?.map((part, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    dispatch(setCurrentQuestionIndex(0));
                                    dispatch(setCurrentPartIndex(index));
                                }}
                                className={`${
                                    currentPartIndex === index ? 'bg-primary text-white' : 'text-black'
                                } border-2 rounded-lg min-h-10 font-medium transition-all`}
                            >
                                <p className="text-wrap">{part?.partName}</p>
                            </button>
                        ))}
                    </div>
                </Col>
            </Row>
            <Row gutter={[12, 12]} className="px-2 py-2 bg-white rounded shadow w-full">
                <Col xs={24} className="mb-2 flex-1 flex flex-row justify-between">
                    <p>Mục lục câu hỏi</p>
                    <p className="text-sm">{questionTypeContent[currentQuestionType || 0] || ''}</p>
                </Col>
                <Col xs={24}>
                    <div className="grid grid-cols-5 gap-3 w-full">
                        {quizDetail?.quiz[currentPartIndex]?.questions?.map?.((question, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    dispatch(setCurrentQuestionIndex(index));

                                    dispatch(setCurrentQuestionType(question.questionType));
                                }}
                                className={`${
                                    currentQuestionIndex === index
                                        ? 'border-primary !bg-primary text-white'
                                        : 'border-gray-300'
                                } border-2 rounded-lg min-w-10 h-10 font-medium transition-all ${
                                    checkCorrectAnswer({
                                        questionIndex: index,
                                        answerChoices,
                                        partIndex: currentPartIndex,
                                        quizDetail,
                                    }) === true && 'bg-green-700 border-green-700 text-white'
                                } ${
                                    checkCorrectAnswer({
                                        questionIndex: index,
                                        answerChoices,
                                        partIndex: currentPartIndex,
                                        quizDetail,
                                    }) === false && 'bg-red-600 border-red-600 text-white'
                                } 
                                `}
                            >
                                {Number(index + 1)}
                            </button>
                        ))}
                    </div>
                </Col>
            </Row>
        </section>
    );
};

export default TableQuestion;
