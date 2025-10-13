import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
const axiosApplicationJson = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosApplicationJson.interceptors.response.use(
    (response) => response, // Trả về reponse nếu không có lỗi,)
    (error: AxiosError<any>) => {
        console.log(error);
        if (error.response) {
            const status = error.response.status;
            const message = (error.response.data as any)?.message || 'Có lỗi xảy ra';

            // Xử lý chung cho từng mã lỗi
            if (status === 401) {
                window.location.href = '/dang-nhap';
                return;
            }
            if (status === 403) {
                window.location.href = '/page-not-found';
                return;
            }

            // Nếu không phải 401 hoặc 403 thì reject với Error chuẩn hóa
            throw new Error(message);
        }
        throw new Error('Không thể kết nối đến server'); // Trả về l��i nếu có l��i
    },
);
axiosApplicationJson.interceptors.request.use((config) => {
    const token = localStorage.get('access_token');
    console.log(token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export default axiosApplicationJson;
