'use client';
import Xarrow from 'react-xarrows';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';

import { shuffleArray } from '@/utils';
import { Button, Modal } from 'antd';
import { TakeMatchingQuestionContext } from '@/context/TakeQuizContext';
import { ANSWER_CHOICE_ACTION } from '@/common/constants';

export default function TakeMatchQuestion({
    quizDetail,
    currentQuestionIndex,
    currentQuestionType,
    currentPartIndex,
    dispatchAnswerChoices,
    answerChoices,
    NextQuestion,
}: {
    quizDetail: any;
    currentQuestionIndex: number;
    currentQuestionType: number;
    currentPartIndex: number;
    dispatchAnswerChoices: any;
    answerChoices: any;
    NextQuestion: any;
}) {
    //Xử lý câu hỏi
    const { shuffleMatchQuestion, setShuffleMatchQuestion, answerMatchingQuestion, dispatchAnswerMatchingQuestion } =
        useContext(TakeMatchingQuestionContext);
    const refQuestion = useRef<any[]>([]);
    const [elementCurrentMouseDown, setElementCurrentMouseDown] = useState('');
    const [xArrows, setXArrows] = useState<any[]>([]);
    const [dragging, setDragging] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    useEffect(() => {
        // refQuestion.current.forEach((el: any, i) => {
        //     if (el) {
        //         const rect = el?.getBoundingClientRect();
        //         console.log(`Box ${i}:`, rect.x, rect.y);
        //     }
        // });
        if (Object.keys(shuffleMatchQuestion).length <= 0 && currentQuestionType == 3) {
            const matchQuestions = shuffleArray(
                quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.matchQuestions?.map(
                    (matchItem: any) => {
                        return {
                            questionContent: matchItem?.questionContent || null,
                            match: matchItem?.match,
                        };
                    },
                ),
            );
            const matchAnswers = shuffleArray(
                quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.matchQuestions?.map(
                    (matchItem: any) => {
                        return {
                            answer: matchItem?.answer || null,
                            match: matchItem?.match,
                        };
                    },
                ),
            );
            setShuffleMatchQuestion((preShuffle: any) => {
                let newShuffle = { ...preShuffle };
                newShuffle = {
                    ...newShuffle,
                    [currentPartIndex]: {
                        [currentQuestionIndex]: {
                            matchQuestions,
                            matchAnswers,
                        },
                    },
                };
                return newShuffle;
            });
        }
        const answerValue =
            answerMatchingQuestion?.[currentPartIndex]?.[currentQuestionIndex]?.map((item: any) => {
                if (item.question && item.answer) {
                    return { start: `question-${item.question}`, end: `answer-${item.answer}` };
                }
            }) || [];
        setXArrows([...answerValue]);
    }, [shuffleMatchQuestion, answerMatchingQuestion]);
    const [keyXArrows, setKeyXArrows] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (xArrows.length > 0) {
            setKeyXArrows(new Date().getTime() + Math.random());
            setTimeout(() => {
                setLoading(true);
            }, 500);
        }
        console.log(xArrows);
    }, [xArrows]);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, indexElement: number, match: any) => {
        e.preventDefault(); // chặn default drag
        setDragging(true);
        const startId = e.currentTarget.id;
        if (startId) setElementCurrentMouseDown(startId);
        setXArrows((prevValue: any[]) => {
            const newValue = [...prevValue];
            // tìm index trong mảng và chỉnh sửa index đó {idx và indexElement hoàn toàn khác nhau}
            const idxArr = newValue?.findIndex((item) => item?.indexStart === indexElement);
            if (idxArr === -1) {
                newValue.push({
                    start: startId,
                    indexStart: indexElement,
                });
            } else {
                newValue[idxArr] = {
                    start: startId,
                    indexStart: indexElement,
                };
            }
            return newValue;
        });
        setCurrentQuestion(match);
        dispatchAnswerMatchingQuestion({
            payload: {
                currentPartIndex,
                currentQuestionIndex,
                question: match,
            },
        });
    };
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>, indexElement: number, match: any) => {
        const endId = e.currentTarget.id;
        // nếu nhả chuột vào ô hiện tại thì return, xóa luôn current element

        if (elementCurrentMouseDown === endId) {
            setElementCurrentMouseDown('');
            return;
        }
        //lấy id của current => gán vào thằng nhả ra là ok
        setXArrows((prevValue: any[]) => {
            const newValue = [...prevValue];
            // tìm index trong mảng và chỉnh sửa index đó {idx và indexElement hoàn toàn khác nhau}
            const idxArr = newValue?.findIndex((item) => item?.start === elementCurrentMouseDown);
            if (newValue && newValue.length > 0 && newValue?.[idxArr]) {
                newValue[idxArr] = {
                    ...newValue[idxArr],
                    end: endId,
                    indexEnd: indexElement,
                };
            }
            return newValue;
        });
        dispatchAnswerMatchingQuestion({
            // Không có action
            payload: {
                currentPartIndex,
                currentQuestionIndex,
                answer: match,
                currentQuestion: currentQuestion,
            },
        });
        setElementCurrentMouseDown('');
        setDragging(false);
    };

    const mouseRef = useRef<HTMLDivElement>(null);

    // di chuyển div ẩn theo chuột
    const containerRef = useRef<HTMLDivElement>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (mouseRef.current && containerRef) {
                const rect = containerRef.current?.getBoundingClientRect();
                mouseRef.current.style.left = e.clientX - (rect?.x || 0) + 'px';
                mouseRef.current.style.top = e.clientY - (rect?.y || 0) + 'px';
                setLeft(e.clientX);
                setTop(e.clientY);
            }
        };
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
        }
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [dragging]);
    // Hết xử lý câu hỏi
    const handleConfirm = () => {
        const matchQuestion = answerMatchingQuestion?.[currentPartIndex]?.[currentQuestionIndex];
        dispatchAnswerChoices({
            type: ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_3,
            payload: {
                currentPartIndex,
                currentQuestionIndex,
                matchQuestion,
            },
        });
        setOpenModal(false);
    };
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    return (
        <>
            <div className="relative w-full" ref={containerRef}>
                <div className="grid grid-cols-2 gap-32">
                    <div className="flex flex-col gap-10">
                        {shuffleMatchQuestion?.[currentPartIndex]?.[currentQuestionIndex]?.matchQuestions?.map(
                            (matchQuestion: any, index: number) => (
                                <div
                                    key={index + Math.random()}
                                    ref={(el) => {
                                        refQuestion.current[index] = el;
                                    }}
                                    id={`question-${matchQuestion.match}`}
                                    onMouseDown={(e) => handleMouseDown(e, matchQuestion.match, matchQuestion.match)}
                                    className="px-2 py-2 bg-amber-500"
                                >
                                    {matchQuestion?.questionContent}
                                </div>
                            ),
                        )}
                    </div>
                    <div className="flex flex-col gap-10">
                        {shuffleMatchQuestion?.[currentPartIndex]?.[currentQuestionIndex]?.matchAnswers?.map(
                            (matchAnswer: any, index: number) => (
                                <div
                                    key={index + Math.random()}
                                    ref={(el) => {
                                        refQuestion.current[index] = el;
                                    }}
                                    id={`answer-${matchAnswer.match}`}
                                    onMouseUp={(e) => handleMouseUp(e, matchAnswer.match, matchAnswer.match)}
                                    className="px-2 py-2 bg-blue-500"
                                >
                                    {matchAnswer?.answer}
                                </div>
                            ),
                        )}
                    </div>
                </div>
                <Fragment key={keyXArrows}>
                    {loading &&
                        xArrows?.map((el: any, index: number) => (
                            <Fragment key={index}>
                                {el?.start && el?.end && (
                                    <Xarrow
                                        color="#f28b30"
                                        headSize={3}
                                        strokeWidth={3}
                                        start={el.start}
                                        end={el.end}
                                    />
                                )}
                            </Fragment>
                        ))}
                </Fragment>
                {/* div ẩn bám theo chuột */}
                <div
                    id="mousePointer"
                    ref={mouseRef}
                    style={{
                        position: 'absolute',
                        width: 1,
                        height: 1,
                        pointerEvents: 'none', // tránh block chuột
                    }}
                />

                {/* Xarrow khi drag */}
                {dragging && elementCurrentMouseDown && (
                    <Xarrow
                        key={left + top}
                        start={elementCurrentMouseDown}
                        end="mousePointer"
                        color="#f28b30"
                        headSize={3}
                        strokeWidth={3}
                    />
                )}
                <div className="flex flex-1 justify-end">
                    <Button className="mt-4" onClick={handleOpenModal}>
                        Xác nhận
                    </Button>
                </div>
            </div>
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={handleConfirm}
                centered
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p>Xác nhận sau khi xác nhận sẽ không còn được trả lời lại</p>
            </Modal>
        </>
    );
}
