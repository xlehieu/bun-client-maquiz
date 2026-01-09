import { UseQueryOptionsCustom } from '@/@types/common.type';
import { ExamAttemptRecord } from '@/@types/examAttempt.type';
import { useQuery } from '@tanstack/react-query';
import { EXAM_QUERY_KEY } from '../classExam/classExam.query';
import { getALLExamAttemptClassExam } from '@/api/examAttempt.service';

export const useListExamAttemptByClassExamId = (
    { classExamId, classroomId }: { classroomId: string; classExamId: string },
    options?: UseQueryOptionsCustom<ExamAttemptRecord[]>,
) => {
    return useQuery({
        queryKey: [EXAM_QUERY_KEY.LIST_EXAM_ATTEMPT_CLASS_EXAM_ID],
        queryFn: () =>
            getALLExamAttemptClassExam({
                classExamId,
                classroomId,
            }),
        ...options,
    });
};
