import { BodyCreateExamAttempt, BodyUpdateScoreAndStatusExamAttempt } from '@/@types/examAttempt.type';
import { createExamAttempt, updateAnswerChoicesAPI, updateScoreAndStatusExamAPI } from '@/api/examAttempt.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EXAM_QUERY_KEY } from './classExam.query';
import { AnswerChoices } from '@/@types/shared.type';
import { toast } from 'sonner';

export const useCreateExamAttempt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bodyCreate: BodyCreateExamAttempt) => createExamAttempt(bodyCreate),

        onSuccess: (data) => {
            console.log('useCreateExamAttempt', data.data._id);
            // nếu cần sync lại data
            queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEY.EXAM_ATTEMPT, data.data.classExamId],
            });
        },
    });
};
export const useUpdateAnswerChoices = () => {
    return useMutation({
        mutationFn: ({ classExamId, answerChoices }: { classExamId: string; answerChoices: AnswerChoices }) =>
            updateAnswerChoicesAPI(classExamId, { answerChoices }),
    });
};
export const useUpdateScoreStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ classExamId, body }: { classExamId: string; body: BodyUpdateScoreAndStatusExamAttempt }) =>
            updateScoreAndStatusExamAPI(classExamId, body),
        onSuccess: (data) => {
            // nếu cần sync lại data
            // console.log('CHECKKKK', data.data);
            toast.success('Nộp bài thi thành công');
            queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEY.EXAM_ATTEMPT, data.data.classExamId],
            });
        },
    });
};
