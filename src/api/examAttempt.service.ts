import { ApiResponse } from '@/@types/api.type';
import { ExamAttempt } from '@/@types/classExam.type';
import {
    BodyCreateExamAttempt,
    BodyUpdateScoreAndStatusExamAttempt,
    ExamAttemptRecord,
} from '@/@types/examAttempt.type';
import { AnswerChoices } from '@/@types/shared.type';
import axiosCredentials from '@/config/axios.instance';

export const createExamAttempt = async (bodyCreateAttempt: BodyCreateExamAttempt) => {
    const response = await axiosCredentials.post<ApiResponse<ExamAttempt>>(`/examAttempt`, bodyCreateAttempt);
    return response.data;
};
export const getExamAttemptDetail = async (classExamId: string) => {
    const response = await axiosCredentials.get(`/examAttempt/${classExamId}`);
    return response.data.data;
};
export const getALLExamAttemptClassExam = async (params: { classExamId: string; classroomId: string }) => {
    const response = await axiosCredentials.get<ApiResponse<ExamAttemptRecord[]>>(`/examAttempt/view`, {
        params,
    });
    return response.data.data;
};
export const updateAnswerChoicesAPI = async (
    examAttemptId: string,
    body: {
        answerChoices: AnswerChoices;
    },
) => {
    const response = await axiosCredentials.patch(`/examAttempt/answerChoices/${examAttemptId}`, body);
    return response.data;
};
export const updateScoreAndStatusExamAPI = async (examAttemptId: string, body: BodyUpdateScoreAndStatusExamAttempt) => {
    const response = await axiosCredentials.patch<ApiResponse<ExamAttempt>>(
        `/examAttempt/submit/${examAttemptId}`,
        body,
    );
    return response.data;
};
