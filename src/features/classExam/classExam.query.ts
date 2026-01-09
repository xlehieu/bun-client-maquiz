import { ApiResponse } from '@/@types/api.type';
import { ClassExamItem, ExamAttempt } from '@/@types/classExam.type';
import { UseQueryOptionsCustom } from '@/@types/common.type';
import { ExamAttemptRecord } from '@/@types/examAttempt.type';
import { getClassExamDetail } from '@/api/classExam.service';
import { getALLExamAttemptClassExam, getExamAttemptDetail } from '@/api/examAttempt.service';
import { useQuery } from '@tanstack/react-query';
// thử dùng
export const EXAM_QUERY_KEY = {
    CLASS_EXAM_DETAIL: 'CLASS_EXAM_DETAIL',
    EXAM_ATTEMPT: 'EXAM_ATTEMPT',
    LIST_EXAM_ATTEMPT_CLASS_EXAM_ID: 'LIST_EXAM_ATTEMPT_CLASS_EXAM_ID',
};
export const useClassExam = (classExamId?: string, options?: UseQueryOptionsCustom<ClassExamItem>) =>
    useQuery({
        queryKey: [EXAM_QUERY_KEY.CLASS_EXAM_DETAIL, classExamId],
        queryFn: () => getClassExamDetail(classExamId!),
        enabled: !!classExamId && classExamId !== undefined,
        ...options,
    });
export const useExamAttempt = (classExamId?: string, options?: UseQueryOptionsCustom<ExamAttempt>) => {
    // lấy theo classExamId => BE lo tìm theo user
    return useQuery({
        queryKey: [EXAM_QUERY_KEY.EXAM_ATTEMPT, classExamId],
        queryFn: () => getExamAttemptDetail(classExamId!),
        enabled: !!classExamId && classExamId !== undefined,
        ...options,
    });
};
