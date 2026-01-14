import { QueryListParams } from '@/@types/queryParam.type';
import axiosInstance from '../../config/axios.instance';
import { ApiResponse } from '@/@types/api.type';
import { AdminClassroomRecord } from '@/@types/adminClassroom.type';
import { ClassroomDetailRecord } from '@/@types/classroom.type';

export const getAdminClassroomList = async (
    params: QueryListParams<{
        keyword?: string;
    }>,
) => {
    return axiosInstance.get<
        ApiResponse<{
            classrooms: AdminClassroomRecord[];
            currentPage: number;
            limit: number;
            total: number;
            totalPage: number;
        }>
    >(`/admin/classroom-management`, {
        params,
    });
};
export const changeClassroomDisabled = async (id: string) => {
    return axiosInstance.patch(`/admin/classroom-management/disabledClassroom/${id}`);
};
export const getAdminClassroomDetail = async (classId: string) => {
    return axiosInstance.get<ApiResponse<ClassroomDetailRecord>>(`/admin/classroom-management/${classId}`);
};
