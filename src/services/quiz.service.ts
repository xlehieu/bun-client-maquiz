import axiosCredentials from '../config/axios.credential';
import axiosApplicationJson from '../config/axios.default';
import { IQuerySkipLimit, IQuiz } from '@/interface';

export const getQuizzes = async (data: IQuerySkipLimit) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
        if (value != undefined) {
            params.append(key, String(value));
        }
    });
    const res = await axiosCredentials.get(`/quizzes/mine?${params}`);
    return res.data.data;
};
export const getQuizDetail = async (id: string) => {
    if (!id) null;
    const res = await axiosCredentials.get(`/quizzes/detail/${id}`);
    console.log('QUIZ DETAIL', res);
    return res.data.data; // data 1 là của axios còn data sau là của mình viết api trả về
};
export const createQuiz = async (data: IQuiz) => {
    const { name, description, school, subject, topic, schoolYear, educationLevel, thumb } = data;

    const res = await axiosCredentials.post(
        `/quizzes/create`,
        data,
    );
    return res.data.data;
};
export const createQuestion = async (data: any) => {
    const res = await axiosCredentials.put(`/quizzes/createQuestion`, data);
    return res.data.data;
};
export const updateQuizGeneralInfo = async (data: any) => {
    const res = await axiosCredentials.put(`/quizzes/updateGeneralInfo`,data);
    return res.data.data;
};
export const updateQuizQuestion = async (data: any) => {
    const res = await axiosCredentials.put(`/quizzes/updateQuestion`, data);

    return res.data.data;
};
export const getQuizPreviewBySlug = async (slug: string) => {
    if (!slug) return null;
    const res = await axiosApplicationJson.get(`/quizzes/preview/${slug}`);
    return res.data.data; // data 1 là của axios còn data sau là của mình viết api trả về
};
export const getQuizForExamBySlug = async (slug: string) => {
    if (!slug) {
        return null;
    }
    const res = await axiosCredentials.get(`/quizzes/forExam/${slug}`);
    return res.data.data; // data 1 là của axios còn data sau là của mình viết api trả về
};
export const deleteQuiz = async (data: IQuiz) => {
    const { id } = data;
    if (!id) {
        return null;
    }
    const res = await axiosCredentials.delete(`/quizzes/${id}/deleteQuiz`);

    return res.data.data;
};
export const getDiscoveryQuizzes = async (query: string) => {
    const res = await axiosApplicationJson.get(`/quizzes/discovery?${query}`);
    return res.data.data;
};
export const getQuizzesBySlugs = async (data: any) => {
    const { slugs } = data;
    if (!slugs || slugs.length === 0) return null;
    const query = encodeURIComponent(JSON.stringify(slugs));
    const res = await axiosCredentials.get(`/quizzes/getQuizzesBySlugs?slugs=${query}`);

    return res.data.data;
};
