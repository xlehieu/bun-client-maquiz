import axios from 'axios';
import axiosCredentials from '../config/axios.credential';
import axiosNoInterceptor from '../config/axios.nointerceptor';

//sử dụng headers để truyền token và thằng middleware phía backend sẽ nhận được token
//để kiểm tra xem có quyền lấy data người dùng không
export const getUserDetail = async () => {
    const res = await axiosNoInterceptor.get(`/users/detail`);
    return res?.data?.data;
};
export const register = async (data: any) => {
    const res = await axiosNoInterceptor.post(`/users/sign-up`, JSON.stringify(data));
    return res?.data?.data;
};
export const refreshToken = async () => {
    const res = await axios.post(`/users/refresh-token`, { withCredentials: true });
    return res;
};

export const updateUser = async (data: any) => {
    const res = await axiosCredentials.patch(`/users/update`, JSON.stringify(data));
    return res.data.data;
};
export const favoriteQuiz = async (data: any) => {
    const { id } = data;
    const res = await axiosCredentials.patch(`/users/favorite-quiz`, JSON.stringify({ quizId: id }));
    return res.data.data;
};

export const getMyFavoriteQuiz = async () => {
    const res = await axiosCredentials.get(`/users/favorite-quiz`);
    return res.data.data;
};

export const getQuizzesAccessHistory = async (data: any) => {
    const params = new URLSearchParams();
    if (data)
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && typeof value === 'string') {
                params.append(key, value);
            }
        });
    const res = await axiosCredentials.get(`/users/quizz-access-history?${params}`);
    return res?.data.data;
};
