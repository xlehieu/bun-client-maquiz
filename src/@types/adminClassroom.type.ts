import { UserDetail } from './user.type';

export type AdminClassroomRecord = {
    _id: string;
    classCode: string;
    name: string;
    subject: string;
    teacher: string;
    teacherInfo: UserDetail;
    students: string[];
    post: [];
    thumb: string;
    createdAt: string;
    updatedAt: string;
    __v: 9;
    posts: string[];
    isDisabled: boolean;
    isAdminDisabled: boolean;
    classExams: string[];
};
