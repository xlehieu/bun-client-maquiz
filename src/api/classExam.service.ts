import axiosCredentials from '@/config/axios.credential';
import { BodyCreateClassExam } from '@/types/classExam.type';

export const createClassExam = async (body: BodyCreateClassExam) => {
    const response = await axiosCredentials.post('/classExam', body);
    return response.data;
};
