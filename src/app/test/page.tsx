'use client';
import Xarrow from 'react-xarrows';
import React, { Fragment, useEffect, useRef, useState } from 'react';

export default function DoMatchQuestion() {
    const refQuestion = useRef<any[]>([]);
    const refAnswers = useRef<any[]>([]);
    const [elementCurrentMouseDown, setElementCurrentMouseDown] = useState('');
    const [xArrows, setXArrows] = useState<any[]>([]);
    const [dragging, setDragging] = useState(false);
    useEffect(() => {
        refQuestion.current.forEach((el: any, i) => {
            if (el) {
                const rect = el?.getBoundingClientRect();
                console.log(`Box ${i}:`, rect.x, rect.y);
            }
        });
    }, []);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, indexElement: number) => {
        e.preventDefault(); // chặn default drag
        setDragging(true);
        console.log(e.currentTarget.id);
        const startId = e.currentTarget.id;
        if (startId) setElementCurrentMouseDown(startId);
        console.log(refQuestion.current?.[indexElement]?.getBoundingClientRect());
        setXArrows((prevValue: any[]) => {
            const newValue = [...prevValue];
            // tìm index trong mảng và chỉnh sửa index đó {idx và indexElement hoàn toàn khác nhau}
            const idxArr = newValue.findIndex((item) => item.indexStart === indexElement);
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
    };
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>, indexElement: number) => {
        console.log(e.currentTarget.id);
        console.log(refQuestion.current?.[indexElement]?.getBoundingClientRect());
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
            const idxArr = newValue.findIndex((item) => item.start === elementCurrentMouseDown);
            console.log(idxArr);
            if (newValue && newValue.length > 0 && newValue?.[idxArr]) {
                newValue[idxArr] = {
                    ...newValue[idxArr],
                    end: endId,
                    indexEnd: indexElement,
                };
            }
            return newValue;
        });
        setElementCurrentMouseDown('');
        setDragging(false);
    };

    const mouseRef = useRef<HTMLDivElement>(null);

    // di chuyển div ẩn theo chuột
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (mouseRef.current) {
                mouseRef.current.style.left = e.clientX + 'px';
                mouseRef.current.style.top = e.clientY + 'px';
                setLeft(e.clientX);
                setTop(e.clientY);
                console.log(mouseRef.current.style.left, mouseRef.current.style.top);
            }
        };
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
        }
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [dragging]);
    return (
        <>
            <div className="grid grid-cols-2 gap-10">
                {Array.from({
                    length: 3,
                }).map((_, i) => (
                    <Fragment key={i}>
                        <div
                            ref={(el) => {
                                refQuestion.current[i] = el;
                            }}
                            id={`question-${i}`}
                            onMouseDown={(e) => handleMouseDown(e, i)}
                            className="h-[50px] w-[50px] bg-amber-500"
                        />
                        <div
                            ref={(el) => {
                                refAnswers.current[i] = el;
                            }}
                            id={`answer-${i}`}
                            onMouseUp={(e) => handleMouseUp(e, i)}
                            className="h-[50px] w-[50px] bg-blue-500"
                        />
                    </Fragment>
                ))}
            </div>
            {xArrows?.map((el: any, index: number) => (
                <Fragment key={index}>
                    {el.start && el.end && (
                        <Xarrow color="#f28b30" headSize={3} strokeWidth={3} start={el.start} end={el.end} />
                    )}
                </Fragment>
            ))}
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
                    key={top + left}
                    start={elementCurrentMouseDown}
                    end="mousePointer"
                    color="#f28b30"
                    headSize={3}
                    strokeWidth={3}
                />
            )}
        </>
    );
}
