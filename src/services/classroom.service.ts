import { ICreateClassroom, IGetAndEnrollClassroomDetail, IUpdateInfoClassroom } from '@/interface';
import axiosCredentials from '@/config/axios.credential';

export const createClassroom = async (data: ICreateClassroom) => {
    const { classroomName, subjectName } = data;
    if (!classroomName?.trim() || !subjectName?.trim()) {
        throw new Error('Tên lớp học và tên môn học không thể bỏ trống');
    }
    const response = await axiosCredentials.post(
        '/classrooms/create',
        JSON.stringify({
            name: classroomName,
            subject: subjectName,
        }),
    );
    return response.data?.data;
};
export const getUserClassrooms = async () => {
    const response = await axiosCredentials.get('/classrooms/mine');
    return response.data?.data;
};
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const getClassroomDetail = async (data: IGetAndEnrollClassroomDetail) => {
    const { classCode } = data;
    if (!classCode) return null;
    const params = new URLSearchParams();
    Object.entries({ classCode }).forEach(([key, value]) => {
        if (value !== undefined) {
            params.append(key, String(value));
        }
    });
    if (!classCode?.trim()) throw new Error('Lỗi');
    const res = await axiosCredentials.get(`/classrooms/detail?${params}`);

    return res.data.data;
};
export const enrollInClassroom = async (data: IGetAndEnrollClassroomDetail) => {
    const { classCode } = data;
    if (!classCode?.trim()) throw new Error('Vui lòng nhập mã lớp');
    const res = await axiosCredentials.patch('/classrooms/enroll', JSON.stringify({ classCode }));

    return res.data.data;
};
export const updateInfoClassroom = async (data: IUpdateInfoClassroom) => {
    const { classCode, name, subject, thumb } = data;
    if (!classCode?.trim()) throw new Error('Vui lòng nhập mã lớp');
    if (!name?.trim() || !subject?.trim()) {
        throw new Error('Tên lớp học và tên môn học không thể bỏ trống');
    }
    const res = await axiosCredentials.patch(
        '/classrooms/info',
        JSON.stringify({
            classCode,
            name,
            subject,
            thumb,
        }),
    );

    return res.data.data;
};
