'use client';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
import configEditor from '@/config/editor';
import React, { useState } from 'react';
import { LoadingOutlined, DeleteOutlined, PlusOutlined, DeliveredProcedureOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const CreateChooseQuesiton = ({
    questionContent,
    setQuestionContent,
    answers,
    setAnswers,
    questionType,
    onSendCallback,
}: any) => {
    // region QUIZ

    const handleAddAnswer = () => {
        setAnswers((preAnswers: any) => {
            preAnswers = [...preAnswers];
            preAnswers.push({ content: '', isCorrect: false });
            return preAnswers;
        });
    };
    //gửi callback lên trên
    onSendCallback(handleAddAnswer);
    const handleRemoveAnswers = (index: any) => {
        setAnswers((prevAnswers: any) => {
            prevAnswers = [...prevAnswers];
            prevAnswers.splice(index, 1);
            return prevAnswers;
        });
    };
    const handleChangeAnswer = (text: any, index: any) => {
        setAnswers((prevAnswers: any) => {
            prevAnswers = [...prevAnswers];
            prevAnswers[index].content = text;
            return prevAnswers;
        });
    };
    const handleChangeSingleChoice = (index: any) => {
        setAnswers((prevAnswers: any) => {
            prevAnswers = [...prevAnswers];
            prevAnswers.forEach((answers: any) => {
                answers.isCorrect = false;
            });
            prevAnswers[index].isCorrect = true;
            return prevAnswers;
        });
    };
    const handleChangeMultipleChoice = (index: any) => {
        setAnswers((prevAnswers: any) => {
            prevAnswers = [...prevAnswers];
            prevAnswers[index].isCorrect = !prevAnswers[index].isCorrect;
            return prevAnswers;
        });
    };
    //END
    return (
        <React.Fragment>
            {[1, 2].includes(questionType) && (
                <React.Fragment>
                    <div className="flex flex-col">
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
                            value={questionContent}
                            onBlur={(newContent) => setQuestionContent(newContent)} // preferred to use only this option to update the content for performance reasons
                            //onChange={setQuestionContent}
                        />
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <p className="font-semibold">Câu trả lời</p>
                        </div>
                        {answers?.map((answer: any, index: any) => (
                            <div key={index} className="flex flex-col mt-4">
                                <div className="flex justify-between content-center">
                                    <div className="flex">
                                        {questionType === 1 ? (
                                            <input
                                                name="isCorrect"
                                                checked={answer.isCorrect}
                                                onChange={(e) => handleChangeSingleChoice(index)}
                                                type="radio"
                                                className="mr-2"
                                                id={`${'answer' + index}`}
                                            />
                                        ) : (
                                            <input
                                                name="isCorrect"
                                                checked={answer.isCorrect}
                                                onChange={(e) => handleChangeMultipleChoice(index)}
                                                type="checkbox"
                                                className="mr-2"
                                                id={`${'answer' + index}`}
                                            />
                                        )}
                                        <label htmlFor={`${'answer' + index}`} className="flex-wrap content-center">
                                            Đáp án {`${index + 1}`}
                                        </label>
                                    </div>
                                    <Button onClick={() => handleRemoveAnswers(index)}>
                                        <p className="text-red-600">
                                            <DeleteOutlined className="mr-1" />
                                            Xóa đáp án
                                        </p>
                                    </Button>
                                </div>
                                <JoditEditor
                                    config={{
                                        ...configEditor,
                                        placeholder: `Nhập câu trả lời ${index + 1}`,
                                        askBeforePasteHTML: false,
                                        defaultActionOnPaste: 'insert_as_html',
                                    }}
                                    className="mt-2"
                                    value={answer.content}
                                    onBlur={(newContent) => handleChangeAnswer(newContent, index)} // preferred to use only this option to update the content for performance reasons
                                />
                            </div>
                        ))}
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default CreateChooseQuesiton;
