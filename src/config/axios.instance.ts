import { useAppSelector } from "@/redux/hooks";
import axios, { AxiosError } from "axios";
import { store } from "@/redux/store";
import { setAccessToken } from "@/redux/slices/auth.slice";
const axiosCredentials = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosCredentials.interceptors.request.use((config) => {
  const state = store.getState();
  const access_token = state.auth.access_token;
  if (access_token) {
    config.headers.Authorization = "Bearer " + access_token;
  }
  return config;
});
axiosCredentials.interceptors.response.use(
  (response) => response, // Trả về reponse nếu không có lỗi,)
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || "Có lỗi xảy ra";
      if (typeof window === "undefined") {
        // Tránh lỗi khi prerender / SSR
        return Promise.reject(error);
      }
      // Xử lý chung cho từng mã lỗi
      if (status === 401) {
        store.dispatch(setAccessToken(null));
        window.location.href = "/auth/dang-nhap";
        return;
      }

      // Nếu không phải 401 hoặc 403 thì reject với Error chuẩn hóa
      throw new Error(message);
    }
    throw new Error("Không thể kết nối đến server"); // Trả về l��i nếu có l��i
  }
);

export default axiosCredentials;
