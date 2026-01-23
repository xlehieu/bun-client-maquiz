import { ApiResponse } from '@/@types/api.type';
import { BodyCreateGeneralInformationQuiz, BodyUpsertQuestionQuiz, QuizDetailRecord } from '@/@types/quiz.type';
import { IQuerySkipLimit } from '@/interface';
import axiosCredentials from '../config/axios.instance';

export const getMyQuizzes = async (params?: Partial<IQuerySkipLimit>) => {
    const res = await axiosCredentials.get<
        ApiResponse<{
            total: number;
            currentPage: number;
            totalPages: number;
            quizzes: QuizDetailRecord[];
        }>
    >(`/quizzes/mine`, { params });
    return res.data.data;
};
export const getQuizDetailAPI = async (id: string) => {
    if (!id) null;
    const res = await axiosCredentials.get<ApiResponse<QuizDetailRecord>>(`/quizzes/detail/${id}`);
    return res.data.data; // data 1 là của axios còn data sau là của mình viết api trả về
};
export const createGeneralInformationQuiz = async (body: BodyCreateGeneralInformationQuiz) => {
    const res = await axiosCredentials.post(`/quizzes/create`, body);
    return res.data.data;
};
export const createQuestion = async (data: BodyUpsertQuestionQuiz) => {
    const res = await axiosCredentials.put(`/quizzes/createQuestion`, JSON.stringify(data));
    return res.data.data;
};
// region Update
export const updateQuizGeneralInfo = async (id: string, data: BodyCreateGeneralInformationQuiz) => {
    const res = await axiosCredentials.put(`/quizzes/updateGeneralInfo/${id}`, data);
    return res.data.data;
};
export const updateQuizQuestion = async (data: BodyUpsertQuestionQuiz) => {
    const res = await axiosCredentials.put<ApiResponse<QuizDetailRecord>>(`/quizzes/updateQuestion`, data);
    return res.data.data;
};
export const getQuizPreviewBySlug = async (slug: string) => {
    return axiosCredentials.get<ApiResponse<QuizDetailRecord>>(`/quizzes/preview/${slug}`);
};
export const getQuizForExamBySlug = async (slug: string) => {
    if (!slug) {
        return null;
    }
    const res = await axiosCredentials.get(`/quizzes/forExam/${slug}`);
    return res.data.data; // data 1 là của axios còn data sau là của mình viết api trả về
};
export const deleteQuiz = async (id: string) => {
    if (!id) {
        return null;
    }
    const res = await axiosCredentials.delete(`/quizzes/${id}/deleteQuiz`);
    return res.data.data;
};
export const getDiscoveryQuizzes = async (params: any) => {
    const buildParam = buildParams(params);
    const res = await axiosCredentials.get<
        ApiResponse<{
            quizzes: QuizDetailRecord[];
            total: number;
        }>
    >(`/quizzes/discovery`, {
        params: buildParam,
    });

    return res.data.data;
};
export const getQuizzesBySlugs = async (data: any) => {
    const { slugs } = data;
    if (!slugs || slugs.length === 0) return null;
    const query = encodeURIComponent(JSON.stringify(slugs));
    const res = await axiosCredentials.get(`/quizzes/getQuizzesBySlugs?slugs=${query}`);

    return res.data.data;
};
export const changeUserQuizDisabled = async (id: string) => {
    return axiosCredentials.patch(`/quizzes/disabledQuiz/${id}`);
};
const buildParams = (params: Record<string, any>) => {
    const result: Record<string, any> = {};

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            result[key] = value.join(',');
        } else {
            result[key] = value;
        }
    });

    return result;
};
