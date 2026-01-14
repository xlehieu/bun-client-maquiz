import { QueryListParams } from '@/@types/queryParam.type';
import axiosCredentials from '../../config/axios.instance';
import { ApiResponse } from '@/@types/api.type';
import { QuizDetailRecord } from '@/@types/quiz.type';
import { AdminQuizRecord } from '@/@types/adminQuiz.type';

export const getAdminQuizList = async (params: QueryListParams<{ keyword?: string }>) => {
    return axiosCredentials.get<
        ApiResponse<{
            quizzes: AdminQuizRecord[];
            currentPage: number;
            limit: number;
            total: number;
            totalPage: number;
        }>
    >(`/admin/quiz-management`, {
        params,
    });
};
export const changeQuizDisabled = async (id: string) => {
    return axiosCredentials.patch(`/admin/quiz-management/disabledQuiz/${id}`);
};
export const getAdminQuizDetail = async (id: string) => {
    return axiosCredentials.get<ApiResponse<QuizDetailRecord>>(`/admin/quiz-management/${id}`);
};
