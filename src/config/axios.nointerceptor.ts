import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
const axiosNoInterceptor = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosNoInterceptor.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
        console.log(error);
        if (error.response) {
            const message = (error.response.data as any)?.message || 'Có lỗi xảy ra';
            // Nếu không phải 401 hoặc 403 thì reject với Error chuẩn hóa
            throw new Error(message);
        }
        throw new Error('Không thể kết nối đến server');
    },
);
axiosNoInterceptor.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    console.log(token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosNoInterceptor;
