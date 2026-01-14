import { ApiResponse } from '@/@types/api.type';
import axiosInstance from '../../config/axios.instance';
import { AdminUserRecord } from '@/@types/adminUsers.type';
import { QueryListParams } from '@/@types/queryParam.type';

export const getAdminUserListAPI = async (params: QueryListParams<{ name?: string }>) => {
    return axiosInstance.get<
        ApiResponse<{
            total: number;
            users: AdminUserRecord[];
            currentPage: number;
            totalPage: number;
            limit: number;
        }>
    >(`/admin/user-management/userList`, {
        params,
    });
};
export const changeActiveUser = async (id: string) => {
    const res = await axiosInstance.patch(`/admin/user-management/activeUser/${id}`);
    if (res.data) {
        return res.data;
    }
};
export const getAdminUserDetail = async (id: string) => {
    return axiosInstance.get<ApiResponse<any>>(`/admin/user-management/detail/${id}`);
};
