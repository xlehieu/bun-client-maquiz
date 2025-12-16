import axiosCredentials from '../config/axios.credential';
export const createPost = async (data: any) => {
    const { content } = data;
    if (!content) {
        return null;
    }
    const res = await axiosCredentials.post('/post', JSON.stringify(data));
    return res.data.data;
};
export const getPostsByClassroomId = async (data: any) => {
    const { classroomId } = data;
    const res = await axiosCredentials.get(`/post/${classroomId}/detail`);
    return res?.data?.data;
};
export const deletePostById = async (data: any) => {
    const { postIdToDelete } = data;
    if (!postIdToDelete) return null;
    const res = await axiosCredentials.delete(`/post/${postIdToDelete}`);
    return res?.data?.data;
};
