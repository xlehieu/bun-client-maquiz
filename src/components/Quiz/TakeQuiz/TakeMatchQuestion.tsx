'use client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Xarrow from 'react-xarrows';

import { reactjxColors } from '@/common/constants';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { chooseQuestionType3 } from '@/redux/slices/takeQuiz.slice';
import { MatchQuestion } from '@/types/quiz.type';
import { AnswerChoiceType3 } from '@/types/shared.type';
import { Button, Modal } from 'antd';
type XArrowType = {
    question: string;
    match: string;
    answer?: string;
};
export default function TakeMatchQuestion() {
    const {
        currentQuizPreviewDetail: quizDetail,
        currentPartIndex,
        currentQuestionIndex,
        answerChoices,
    } = useAppSelector((state) => state.takeQuiz);
    const dispatch = useAppDispatch();
    // const { shuffleMatchQuestion, setShuffleMatchQuestion, answerMatchingQuestion, dispatchAnswerMatchingQuestion } =
    //     useContext(TakeMatchingQuestionContext);
    const refQuestion = useRef<any[]>([]);
    const [elementCurrentMouseDown, setElementCurrentMouseDown] = useState('');
    const [xArrows, setXArrows] = useState<XArrowType[]>([]);
    const [dragging, setDragging] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const mouseRef = useRef<HTMLDivElement>(null);
    // di chuyển div ẩn theo chuột
    const containerRef = useRef<HTMLDivElement>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    useEffect(() => {
        const matchQuestion = [
            ...((answerChoices?.[currentPartIndex]?.[currentQuestionIndex] as AnswerChoiceType3[]) || []),
        ];
        setIsDisabled(currentQuestionIndex in (answerChoices?.[currentPartIndex] || {}) ? true : false);
        const timeout = setTimeout(() => {
            setXArrows(Array.isArray(matchQuestion) ? matchQuestion : []);
        }, 600);
        return () => clearTimeout(timeout);
    }, [answerChoices]);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, match: string) => {
        e.preventDefault(); // chặn default drag
        setDragging(true);
        const startId = e.currentTarget.id;
        if (startId) setElementCurrentMouseDown(startId);
        setXArrows((prevValue) => {
            const newValue = [...(prevValue || [])];
            // tìm index trong mảng và chỉnh sửa index đó {idx và indexElement hoàn toàn khác nhau}
            const idxArr = newValue?.findIndex((item) => item?.match === match);
            if (idxArr === -1) {
                newValue.push({
                    question: startId,
                    match,
                });
            } else {
                newValue[idxArr] = {
                    question: startId,
                    match,
                };
            }
            return newValue?.filter(Boolean);
        });
    };
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>, match: any) => {
        const targetAnswerId = e.currentTarget.id;
        // nếu nhả chuột vào ô hiện tại thì return, xóa luôn current element

        if (elementCurrentMouseDown === targetAnswerId) {
            setElementCurrentMouseDown('');
            return;
        }
        //lấy id của current => gán vào thằng nhả ra là ok
        setXArrows((prevValue) => {
            const newValue = [...prevValue];
            // start cũng đang là element current luôn => tìm ông nào bắt đầu bằng startId và gán thêm end => phần tử hiện tại vừa mouse up
            const idxArr = newValue?.findIndex((item) => item?.question === elementCurrentMouseDown);
            if (newValue && newValue.length > 0 && newValue?.[idxArr]) {
                newValue[idxArr] = {
                    ...newValue[idxArr],
                    answer: targetAnswerId,
                };
            }
            return newValue?.filter(Boolean);
        });
        // dispatchAnswerMatchingQuestion({
        //     // Không có action
        //     payload: {
        //         currentPartIndex,
        //         currentQuestionIndex,
        //         answer: match,
        //         currentQuestion: currentQuestion,
        //     },
        // });
        setElementCurrentMouseDown('');
        setDragging(false);
        // mouseRef.current = null;
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (mouseRef.current && containerRef) {
                const rect = containerRef.current?.getBoundingClientRect();
                mouseRef.current.style.left = e.clientX - (rect?.x || 0) + 'px';
                mouseRef.current.style.top = e.clientY - (rect?.y || 0) + 'px';
                // console.log(mouseRef.current.style.left, mouseRef.current.style.top);
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
        // const matchQuestion = answerMatchingQuestion?.[currentPartIndex]?.[currentQuestionIndex];
        // dispatchAnswerChoices({
        //     type: ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_3,
        //     payload: {
        //         currentPartIndex,
        //         currentQuestionIndex,
        //         matchQuestion,
        //     },
        // });
        dispatch(
            chooseQuestionType3({
                currentPartIndex,
                currentQuestionIndex,
                matchQuestion: xArrows,
            }),
        );
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
                        {(
                            quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex] as MatchQuestion
                        )?.mappingMatchQuestion?.optionMatchQuestion_Question?.map((optionQuestion, index) => (
                            <div
                                key={index + Math.random()}
                                ref={(el) => {
                                    refQuestion.current[index] = el;
                                }}
                                id={`question-${optionQuestion.answerId}`}
                                onMouseDown={(e) => handleMouseDown(e, optionQuestion.answerId)}
                                className="px-2 py-2 border-2 border-camdat rounded"
                            >
                                {optionQuestion.questionContent}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-10">
                        {(
                            quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex] as MatchQuestion
                        )?.mappingMatchQuestion?.optionMatchQuestion_Answer?.map((optionQuestion, index) => (
                            <div
                                key={index + Math.random()}
                                ref={(el) => {
                                    refQuestion.current[index] = el;
                                }}
                                id={`answer-${optionQuestion.answerId}`}
                                onMouseUp={(e) => handleMouseUp(e, optionQuestion.answerId)}
                                className="px-2 py-2 border-2 border-primary rounded"
                            >
                                {optionQuestion?.answer}
                            </div>
                        ))}
                    </div>
                </div>
                <Fragment key={top + left + Math.random()}>
                    {xArrows?.map((el, index) => (
                        <Fragment key={index}>
                            {el?.question && el?.answer && (
                                <Xarrow
                                    color={reactjxColors.primary}
                                    headSize={3}
                                    strokeWidth={3}
                                    start={el.question}
                                    end={el.answer}
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
                        top: 0,
                        left: 0,
                        pointerEvents: 'none', // tránh block chuột
                    }}
                />

                {/* Xarrow khi drag */}
                <Fragment key={left + top + Math.random()}>
                    {dragging && elementCurrentMouseDown && (
                        <Xarrow
                            start={elementCurrentMouseDown}
                            end="mousePointer"
                            color={reactjxColors.primary}
                            headSize={3}
                            strokeWidth={3}
                        />
                    )}
                </Fragment>
                <div className="flex flex-1 justify-end">
                    <Button className="mt-4" disabled={isDisabled} onClick={handleOpenModal}>
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
                title="Xác nhận⚠️⚠️⚠️⚠️⚠️"
            >
                <p>Xác nhận sau khi xác nhận sẽ không còn được trả lời lại</p>
            </Modal>
        </>
    );
}
