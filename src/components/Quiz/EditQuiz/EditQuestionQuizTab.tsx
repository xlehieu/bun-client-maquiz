'use client';
import dynamic from 'next/dynamic';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import * as QuizService from '@/services/quiz.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { LoadingOutlined } from '@ant-design/icons';
import { faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import useMutationHooks from '@/hooks/useMutationHooks';
const JoditEditor = dynamic(() => import('jodit-react'), {
    ssr: false,
});
import CreateQuizPart from '@/components/UI/CreateQuizPart';
import BlurBackground from '@/components/UI/BlurBackground';
import configEditor from '@/config/editor';
import { IQuiz } from '@/interface';
import { QuizDetailContext, SetQuizDetailContext } from '@/context/QuizContext';
import CreateMatchQuestion from '@/components/Quiz/Questions/CreateMatchQuestion';
import { Select } from 'antd';
const EditQuestionQuizTab = () => {
    const quizDetail = useContext(QuizDetailContext);
    const setQuizDetail = useContext(SetQuizDetailContext);
    //QUIZ INFORMATION
    // Xử lý lưu thông tin câu hỏi
    const [isActiveQuizPartNameDialog, setIsActiveQuizPartNameDialog] = useState(false);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // dành cho câu hỏi 1-n đáp án
    //Xử lý click chuyển phần thi
    const handleChangePartIndex = (index: number) => {
        setCurrentPartIndex(index);
        if (quizDetail.quiz?.[index]) {
            setCurrentQuestionIndex(0);
        }
    };
    const handleAddQuizPart = (quizPartName: string) => {
        setQuizDetail((preQuizDetail: any) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz.push({
                partName: quizPartName,
                questions: [
                    {
                        questionType: 1,
                        questionContent: '',
                        answers: [
                            {
                                content: '',
                                isCorrect: true,
                            },
                            {
                                content: '',
                                isCorrect: false,
                            },
                            {
                                content: '',
                                isCorrect: false,
                            },
                            {
                                content: '',
                                isCorrect: false,
                            },
                        ],
                    },
                ],
            });
            return preQuizDetail;
        });
        setCurrentQuestionIndex(0);
        setCurrentPartIndex(quizDetail.quiz.length - 1);
    };
    //Xử lý click thay đổi câu hỏi
    const handleChangeQuestionIndex = (index: number) => {
        setCurrentQuestionIndex(index);
    };
    //Xử lý thay đổi nội dung câu hỏi
    const handleChangeQuestionContent = (text: string) => {
        setQuizDetail((preQuizDetail: any) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].questionContent = text;
            return preQuizDetail;
        });
    };
    //Xử lý thay đổi loại câu hỏi
    const handleChangeQuestionType = (type: any) => {
        setQuizDetail((preQuizDetail: any) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].questionType = type;
            return preQuizDetail;
        });
    };
    //Xử lý thêm câu h��i
    const handleAddQuestion = () => {
        setCurrentQuestionIndex(quizDetail?.quiz[currentPartIndex]?.questions?.length);
        setQuizDetail((preQuizDetail: any) => {
            preQuizDetail = { ...preQuizDetail };
            if (preQuizDetail.quiz[currentPartIndex]) {
                preQuizDetail.quiz[currentPartIndex].questions.push({
                    questionType: 1,
                    questionContent: '',
                    answers: [
                        {
                            content: '',
                            isCorrect: true,
                        },
                        {
                            content: '',
                            isCorrect: false,
                        },
                        {
                            content: '',
                            isCorrect: false,
                        },
                        {
                            content: '',
                            isCorrect: false,
                        },
                    ],
                });
            } else {
                toast.error('Lỗi! Bạn phải thêm phần thi trước khi thêm câu hỏi mới');
            }
            return preQuizDetail;
        });
    };
    const handleRemoveQuizPart = (index: any) => {
        if (quizDetail?.quiz[index]) {
            setQuizDetail((preQuizDetail: any) => {
                preQuizDetail = { ...preQuizDetail };
                preQuizDetail.quiz.splice(index, 1);
                return preQuizDetail;
            });
        }
    };
    //Xử lý xóa câu hỏi
    const handleRemoveQuestion = () => {
        if (quizDetail.quiz) {
            setQuizDetail((preQuizDetail: any) => {
                preQuizDetail = { ...preQuizDetail };
                preQuizDetail?.quiz[currentPartIndex]?.questions?.splice(currentQuestionIndex, 1);
                return preQuizDetail;
            });
            if (quizDetail.quiz[currentPartIndex]?.questions?.length - 1 > 0) {
                setCurrentQuestionIndex((prevQuestionIndex) => {
                    if (prevQuestionIndex === 0) {
                        return 0;
                    } else {
                        return prevQuestionIndex - 1;
                    }
                });
            } else {
                handleRemoveQuizPart(currentPartIndex);
                setCurrentPartIndex((prevPartIndex) => {
                    if (prevPartIndex === 0) {
                        return 0;
                    } else {
                        return prevPartIndex - 1;
                    }
                });
                setCurrentQuestionIndex(0);
            }
        }
    };
    //Xử lý thêm đáp án
    const handleAddAnswer = () => {
        if (quizDetail) {
            setQuizDetail((preQuizDetail: any) => {
                preQuizDetail = { ...preQuizDetail };
                preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers.push({
                    content: '',
                    isCorrect: false,
                });
                return preQuizDetail;
            });
        }
    };
    //Xử lý xóa đáp án
    const handleRemoveAnswers = (index: number) => {
        setQuizDetail((preQuizDetail: any) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers.splice(index, 1);
            return preQuizDetail;
        });
    };
    //Xử lý thay đổi đáp án
    const handleChangeAnswer = (text: any, index: any) => {
        setQuizDetail((preQuizDetail: any) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers[index].content = text;
            return preQuizDetail;
        });
    };
    const handleChangeSingleChoice = (index: any) => {
        setQuizDetail((preQuizDetail: any) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers.forEach((answer: any) => {
                answer.isCorrect = false;
            });
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers[index].isCorrect = true;
            return preQuizDetail;
        });
    };
    const handleChangeMultipleChoice = (index: any) => {
        setQuizDetail((preQuizDetail: any) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers[index].isCorrect =
                !preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers[index].isCorrect;
            return preQuizDetail;
        });
    };
    //END

    // update quiz question handling mutation
    const updateQuizQuestionMutation = useMutationHooks((data: IQuiz) => QuizService.updateQuizQuestion(data));
    const handleUpdateQuizQuestion = () => {
        if (quizDetail?.quiz) {
            if (quizDetail.quiz.length) {
                updateQuizQuestionMutation.mutate({ id: quizDetail._id, quiz: quizDetail.quiz });
            }
        }
    };
    useEffect(() => {
        if (updateQuizQuestionMutation.isSuccess) {
            toast.success('Sửa các câu hỏi trắc nghiệm thành công');
            window.scrollTo({
                top: 140,
                behavior: 'smooth',
            });
            updateQuizQuestionMutation.reset();
        } else if (updateQuizQuestionMutation.isError) {
            toast.error((updateQuizQuestionMutation.error as { message: string }).message);
            updateQuizQuestionMutation.reset();
        }
    }, [updateQuizQuestionMutation.isError, updateQuizQuestionMutation.isSuccess]);
    ///TAB
    useEffect(() => {
        console.log('quiz', quizDetail);
    }, [quizDetail]);
    const OneNNAnswer = () => (
        <React.Fragment>
            {[1, 2].includes(quizDetail.quiz[currentPartIndex]?.questions[currentQuestionIndex]?.questionType) && (
                <React.Fragment>
                    <div className="flex flex-col mt-3">
                        <div className="mb-2">
                            <label className="font-semibold">Soạn câu hỏi</label>
                        </div>
                        <JoditEditor
                            config={{
                                ...configEditor,
                                placeholder: 'Nhập câu hỏi',
                                askBeforePasteHTML: false,
                                defaultActionOnPaste: 'insert_as_html',
                            }}
                            value={
                                quizDetail?.quiz &&
                                quizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]?.questionContent
                            }
                            onBlur={(text) => handleChangeQuestionContent(text)} // preferred to use only this option to update the content for performance reasons
                            //onChange={setQuestionContent}
                        />
                    </div>
                    <div className="flex flex-col mt-3">
                        <div>
                            <p className="font-semibold">Câu trả lời</p>
                        </div>
                        {quizDetail?.quiz &&
                            quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.answers?.map(
                                (answer: any, index: number) => (
                                    <div key={index} className="flex flex-col mt-4">
                                        <div className="flex justify-between content-center">
                                            <div className="flex text-xl pb-2">
                                                {quizDetail.quiz &&
                                                quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.questionType == 1 ? (
                                                    <input
                                                        name="isCorrect"
                                                        checked={answer.isCorrect}
                                                        onChange={(e) => handleChangeSingleChoice(index)}
                                                        type="radio"
                                                        className="mr-2 hover:cursor-pointer"
                                                        id={`${'answer' + index}`}
                                                    />
                                                ) : (
                                                    <input
                                                        name="isCorrect"
                                                        checked={answer.isCorrect}
                                                        onChange={(e) => handleChangeMultipleChoice(index)}
                                                        type="checkbox"
                                                        className="mr-2 hover:cursor-pointer"
                                                        id={`${'answer' + index}`}
                                                    />
                                                )}
                                                <label
                                                    htmlFor={`${'answer' + index}`}
                                                    className="flex-wrap content-center hover:cursor-pointer"
                                                >
                                                    Đáp án {`${index + 1}`}
                                                </label>
                                            </div>
                                            <button
                                                className="text-xl hover:cursor-pointer"
                                                onClick={() => handleRemoveAnswers(index)}
                                            >
                                                <p className="text-red-600">
                                                    <FontAwesomeIcon className="mr-1" icon={faTrash} />
                                                    Xóa đáp án
                                                </p>
                                            </button>
                                        </div>
                                        <JoditEditor
                                            config={{
                                                ...configEditor,
                                                placeholder: 'Nhập câu hỏi',
                                                askBeforePasteHTML: false,
                                                defaultActionOnPaste: 'insert_as_html',
                                            }}
                                            className="mt-2"
                                            value={answer.content}
                                            onBlur={(newContent) => handleChangeAnswer(newContent, index)} // preferred to use only this option to update the content for performance reasons
                                        />
                                    </div>
                                ),
                            )}
                    </div>
                    <button
                        onClick={handleAddAnswer}
                        className={
                            'w-full py-3 rounded-md border-4 mt-4 border-dashed border-primary hover:cursor-pointer'
                        }
                    >
                        <span className="text-primary font-bold">
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                            Thêm đáp án
                        </span>
                    </button>
                </React.Fragment>
            )}
        </React.Fragment>
    );
    const createQuestion: Record<number, ReactNode> = {
        1: <OneNNAnswer />,
        2: <OneNNAnswer />,
        3: (
            <CreateMatchQuestion
                quizDetail={quizDetail}
                setQuiz={setQuizDetail}
                currentPartIndex={currentPartIndex}
                currentQuestionIndex={currentQuestionIndex}
            />
        ),
    };

    return (
        <>
            <section className="w-full flex md:flex-row sm:flex-col gap-5">
                <div className="md:w-2/5 sm:w-full">
                    <div className="bg-white shadow-sm px-3 py-3 border rounded-md w-full">
                        <div className="flex justify-between">
                            <h5 className="pb-2">Phần thi</h5>
                            <button
                                className="outline-primary border-primary bg-primary rounded-md border-2 px-3 duration-300 transition-all hover:opacity-50 hover:cursor-pointer"
                                onClick={() => setIsActiveQuizPartNameDialog(true)}
                            >
                                <p className="text-primary font-bold">
                                    <FontAwesomeIcon icon={faPlus} className="text-white" />
                                </p>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {quizDetail?.quiz &&
                                quizDetail?.quiz.map((partDetail: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => handleChangePartIndex(index)}
                                        className={`${
                                            currentPartIndex === index
                                                ? 'bg-primary border-primary text-white'
                                                : 'border-gray-400 text-gray-700'
                                        } px-3 py-2 rounded-md border-2 transition-all duration-300 hover:cursor-pointer`}
                                    >
                                        {partDetail.partName}
                                    </button>
                                ))}
                        </div>
                    </div>
                    <CreateQuizPart
                        callback={(quizPartName: any) => handleAddQuizPart(quizPartName)}
                        isActiveQuizPartNameDialog={isActiveQuizPartNameDialog}
                        setIsActiveQuizPartNameDialog={setIsActiveQuizPartNameDialog}
                    />
                    <div className="bg-white shadow-sm px-3 py-3 border rounded-md w-full mt-5">
                        <div className="flex justify-between">
                            <h5 className="pb-2">Câu hỏi</h5>
                            <button
                                onClick={handleAddQuestion}
                                className="outline-primary border-primary bg-primary rounded-md border-2 px-3 duration-300 transition-all hover:opacity-50 hover:cursor-pointer"
                            >
                                <p className="text-primary font-bold">
                                    <FontAwesomeIcon icon={faPlus} className="text-white" />
                                </p>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4">
                            {quizDetail?.quiz &&
                                quizDetail?.quiz[currentPartIndex]?.questions.map((question: any, index: any) => (
                                    <button
                                        key={index}
                                        onClick={() => handleChangeQuestionIndex(index)}
                                        className={`${
                                            currentQuestionIndex === index
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white  border-gray-400 text-gray-700 '
                                        } hover:opacity-75 w-12 px-3 py-2 border-2 rounded-md duration-200 transition-all font-semibold hover:cursor-pointer`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                        </div>
                    </div>
                    <div className="mt-4 w-full flex justify-end bg-white py-3 px-4 rounded shadow-sm">
                        <button
                            onClick={handleUpdateQuizQuestion}
                            className="bg-primary px-4 py-2 text-white rounded transition-all hover:opacity-70 duration-300 hover:cursor-pointer"
                        >
                            {updateQuizQuestionMutation.isPending ? (
                                <LoadingOutlined className="mr-1" />
                            ) : (
                                <FontAwesomeIcon icon={faSave} className="mr-1" />
                            )}
                            Lưu
                        </button>
                    </div>
                </div>
                {quizDetail?.quiz?.length > 0 && (
                    <div className="md:flex-1 bg-white px-3 py-3 shadow-sm sm:w-full">
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <div className="mb-2">
                                    <label htmlFor="questionType" className="font-semibold">
                                        Loại câu hỏi
                                    </label>
                                </div>
                                <div>
                                    <Select
                                        id="questionType"
                                        className="sm:w-full lg:w-56"
                                        value={
                                            quizDetail?.quiz &&
                                            quizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]
                                                ?.questionType
                                        }
                                        onChange={(e) => handleChangeQuestionType(Number(e))}
                                    >
                                        <Select.Option value={1}>Một đáp án</Select.Option>
                                        <Select.Option value={2}>Nhiều đáp án</Select.Option>
                                        <Select.Option value={3}>Nối đáp án</Select.Option>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={handleRemoveQuestion}
                                    className="border-red-600 text-white bg-red-600 border-2 rounded-lg px-2 py-1  duration-300 transition-all hover:opacity-50 hover:cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                                    Xóa câu hỏi
                                </button>
                            </div>
                        </div>
                        {!isNaN(
                            Number(
                                quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.questionType,
                            ),
                        ) &&
                            createQuestion[
                                Number(
                                    quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]
                                        ?.questionType || 1,
                                )
                            ]}
                    </div>
                )}
            </section>
            <BlurBackground isActive={isActiveQuizPartNameDialog} />
        </>
    );
};
export default EditQuestionQuizTab;
