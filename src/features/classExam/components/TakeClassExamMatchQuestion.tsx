'use client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Xarrow from 'react-xarrows';

import { reactjxColors } from '@/common/constants';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { MatchQuestion } from '@/@types/quiz.type';
import { AnswerChoiceType3 } from '@/@types/shared.type';
import { Button, Modal } from 'antd';
import { chooseExamQuestionType3 } from '@/redux/slices/takeExam.slice';

type XArrowType = {
    question: string;
    match: string;
    answer?: string;
};

export default function TakeClassExamMatchQuestion({ autoNextQuestion }: { autoNextQuestion: () => void }) {
    const { examDataQuizPart, currentPartIndex, currentQuestionIndex, answerChoices } = useAppSelector(
        (state) => state.takeExam,
    );
    const dispatch = useAppDispatch();

    const refQuestion = useRef<any[]>([]);
    const [elementCurrentMouseDown, setElementCurrentMouseDown] = useState('');
    const [xArrows, setXArrows] = useState<XArrowType[]>([]);
    const [dragging, setDragging] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const mouseRef = useRef<HTMLDivElement>(null);
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
    }, [answerChoices, currentQuestionIndex, currentPartIndex]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, match: string) => {
        if (isDisabled) return;
        e.preventDefault();
        setDragging(true);
        const startId = e.currentTarget.id;
        if (startId) setElementCurrentMouseDown(startId);
        setXArrows((prevValue) => {
            const newValue = [...(prevValue || [])];
            const idxArr = newValue?.findIndex((item) => item?.match === match);
            if (idxArr === -1) {
                newValue.push({ question: startId, match });
            } else {
                newValue[idxArr] = { question: startId, match };
            }
            return newValue?.filter(Boolean);
        });
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>, match: any) => {
        if (isDisabled) return;
        const targetAnswerId = e.currentTarget.id;

        if (elementCurrentMouseDown === targetAnswerId) {
            setElementCurrentMouseDown('');
            setDragging(false);
            return;
        }

        setXArrows((prevValue) => {
            const newValue = [...prevValue];
            const idxArr = newValue?.findIndex((item) => item?.question === elementCurrentMouseDown);
            if (newValue && newValue.length > 0 && newValue?.[idxArr]) {
                newValue[idxArr] = { ...newValue[idxArr], answer: targetAnswerId };
            }
            return newValue?.filter(Boolean);
        });

        setElementCurrentMouseDown('');
        setDragging(false);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (mouseRef.current && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                mouseRef.current.style.left = e.clientX - rect.x + 'px';
                mouseRef.current.style.top = e.clientY - rect.y + 'px';
                setLeft(e.clientX);
                setTop(e.clientY);
            }
        };
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
        }
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [dragging]);

    const handleConfirm = () => {
        dispatch(
            chooseExamQuestionType3({
                currentPartIndex,
                currentQuestionIndex,
                matchQuestion: xArrows,
            }),
        );
        setOpenModal(false);
        autoNextQuestion();
    };

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);

    // Helper styles cho Xarrow
    const commonXarrowProps = {
        color: reactjxColors.primary,
        strokeWidth: 3,
        headSize: 4,
        path: 'smooth' as const, // Tạo đường cong mềm mại
        startAnchor: 'right' as const,
        endAnchor: 'left' as const,
        animateDrawing: 0.1, // Hiệu ứng vẽ đường nối
    };

    const currentQuestions = (examDataQuizPart?.[currentPartIndex]?.questions?.[currentQuestionIndex] as MatchQuestion)
        ?.mappingMatchQuestion;

    return (
        <>
            <div className="relative w-full p-6" ref={containerRef}>
                <div className="grid grid-cols-2 gap-x-24 gap-y-6">
                    {/* CỘT CÂU HỎI */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Vế trái</h4>
                        {currentQuestions?.optionMatchQuestion_Question?.map((optionQuestion, index) => (
                            <div
                                key={`q-${index}`}
                                id={`question-${optionQuestion.answerId}`}
                                onMouseDown={(e) => handleMouseDown(e, optionQuestion.answerId)}
                                className={`group relative px-4 py-4 bg-white border-2 rounded-2xl transition-all duration-200 cursor-crosshair
                  ${
                      elementCurrentMouseDown === `question-${optionQuestion.answerId}`
                          ? 'border-blue-500 shadow-md scale-[1.02]'
                          : 'border-slate-100 hover:border-blue-300 shadow-sm'
                  }
                  ${isDisabled ? 'opacity-80 cursor-not-allowed' : ''}
                `}
                            >
                                <div className="text-slate-700 font-medium">{optionQuestion.questionContent}</div>
                                {/* Điểm nối (dot) */}
                                <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-4 border-white rounded-full shadow-sm z-10 group-hover:scale-125 transition-transform" />
                            </div>
                        ))}
                    </div>

                    {/* CỘT ĐÁP ÁN */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 text-right">
                            Vế phải
                        </h4>
                        {currentQuestions?.optionMatchQuestion_Answer?.map((optionAnswer, index) => (
                            <div
                                key={`a-${index}`}
                                id={`answer-${optionAnswer.answerId}`}
                                onMouseUp={(e) => handleMouseUp(e, optionAnswer.answerId)}
                                className={`group relative px-4 py-4 bg-white border-2 rounded-2xl transition-all duration-200 cursor-pointer
                  ${
                      isDisabled
                          ? 'border-slate-200'
                          : 'border-slate-100 hover:border-emerald-300 shadow-sm hover:bg-emerald-50/30'
                  }
                  ${isDisabled ? 'cursor-not-allowed' : ''}
                `}
                            >
                                <div className="text-slate-700 font-medium">{optionAnswer?.answer}</div>
                                {/* Điểm nối (dot) */}
                                <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full shadow-sm z-10 group-hover:scale-125 transition-transform" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* RENDER CÁC ĐƯỜNG NỐI ĐÃ CHỐT */}
                <div className="pointer-events-none">
                    {xArrows?.map((el, index) => (
                        <Fragment key={`arrow-${index}`}>
                            {el?.question && el?.answer && (
                                <Xarrow {...commonXarrowProps} start={el.question} end={el.answer} />
                            )}
                        </Fragment>
                    ))}
                </div>

                {/* DIV ẨN BÁM THEO CHUỘT */}
                <div
                    id="mousePointer"
                    ref={mouseRef}
                    className="absolute w-1 h-1 pointer-events-none"
                    style={{ top: 0, left: 0 }}
                />

                {/* ĐƯỜNG NỐI KHI ĐANG KÉO (DRAGGING) */}
                {dragging && elementCurrentMouseDown && (
                    <Xarrow
                        {...commonXarrowProps}
                        start={elementCurrentMouseDown}
                        end="mousePointer"
                        // dashness={dragging ? { strokeLen: 10, nonStrokeLen: 10, animation: true } : false} // Hiệu ứng nét đứt khi đang kéo
                    />
                )}

                <div className="flex justify-end mt-10">
                    <Button
                        type="primary"
                        size="large"
                        className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                        disabled={isDisabled}
                        onClick={handleOpenModal}
                    >
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
                title={
                    <div className="flex items-center gap-2 text-amber-500">
                        <span>⚠️</span> <span>Xác nhận kết quả</span>
                    </div>
                }
                okButtonProps={{ className: 'rounded-lg' }}
                cancelButtonProps={{ className: 'rounded-lg' }}
            >
                <p className="text-slate-600">
                    Bạn có chắc chắn muốn xác nhận không? Sau khi xác nhận, các đường nối sẽ <b>không thể thay đổi</b>.
                </p>
            </Modal>
        </>
    );
}
