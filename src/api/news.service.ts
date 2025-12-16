import { INewsItem } from '@/interface';
import axiosCredentials from '../config/axios.credential';

export const getNews = async () => {
    const response = await axiosCredentials.get('/news');
    console.log(response.data);
    return response.data.data;
};

export const createNews = async ({ title, content }: { title: string; content: string }) => {
    try {
        const response = await axiosCredentials.post('/news', { title, content });
        if (response.data && response.status === 200) {
            return response.data.data;
        }
        throw new Error('Failed to create news');
    } catch (error) {
        throw error;
    }
};

export const updateNews = async ({ id, title, content }: INewsItem) => {
    try {
        const response = await axiosCredentials.put(`/news/${id}`, { title, content });
        if (response.data && response.status === 200) {
            return response.data.data;
        }
        throw new Error('Failed to update news');
    } catch (error) {
        throw error;
    }
};
export const deleteNews = async (id: string) => {
    try {
        const response = await axiosCredentials.delete(`/news/${id}`);
        if (response.data && response.status === 200) {
            return response.data.data;
        }
        throw new Error('Failed to delete news');
    } catch (error) {
        throw error;
    }
};
