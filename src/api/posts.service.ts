import { BodyCreatePost } from '@/types/post.type';
import axiosCredentials from '../config/axios.credential';
export const createPost = async (data: BodyCreatePost) => {
    const res = await axiosCredentials.post('/posts', data);
    return res.data.data;
};
export const getPostsByClassroomId = async (data: any) => {
    const { classroomId } = data;
    const res = await axiosCredentials.get(`/posts/${classroomId}/detail`);
    return res?.data?.data;
};
export const deletePostById = async (id: string) => {
    const res = await axiosCredentials.delete(`/posts/${id}`);
    return res?.data?.data;
};
