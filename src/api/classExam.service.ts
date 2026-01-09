import axiosCredentials from '@/config/axios.credential';
import { BodyCreateClassExam, ClassExamItem } from '@/@types/classExam.type';
import { ApiResponse } from '@/@types/api.type';

export const createClassExam = async (body: BodyCreateClassExam) => {
    const response = await axiosCredentials.post('/classExam', body);
    return response.data;
};
export const getClassExamDetail = async (id: string) => {
    const response = await axiosCredentials.get<ApiResponse<ClassExamItem>>(`/classExam/${id}`);
    return response.data.data;
};
