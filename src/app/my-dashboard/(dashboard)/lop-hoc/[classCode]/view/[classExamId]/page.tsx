'use client';
import ButtonBack from '@/components/UI/ButtonBack';
import { ExamHistoryList } from '@/features/examAttempt/components/ExamAttempList';
import { useListExamAttemptByClassExamId } from '@/features/examAttempt/examAttempt.query';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchClassroomDetail } from '@/redux/slices/classrooms.slice';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const ViewClassExam = () => {
    const dispatch = useAppDispatch();
    const { classExamId, classCode } = useParams<{ classExamId: string; classCode: string }>();

    const { classroomDetail } = useAppSelector((state) => state.classroom);
    const { data: listExamAttempt = [] } = useListExamAttemptByClassExamId(
        {
            classExamId,
            classroomId: classroomDetail?._id || '',
        },
        {
            refetchOnMount: true,
            enabled: !!classExamId && !!classroomDetail?._id,
            staleTime: 0, // luôn stale
            gcTime: 0, // ❗ xoá cache ngay khi unmount (v4)
        },
    );
    useEffect(() => {
        if (!classroomDetail?._id) {
            dispatch(fetchClassroomDetail(classCode));
        }
    }, [classCode]);
    return (
        <section className="min-h-screen mt-3">
            <ButtonBack />
            <ExamHistoryList records={listExamAttempt} />
        </section>
    );
};

export default ViewClassExam;
