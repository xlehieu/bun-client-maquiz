import { ClassExamItem } from './classExam.type';

export type PostItem = {
    type: 'post';
    _id: string;
    createdBy: {
        avatar: string;
        name: string;
        email: string;
    };
    content: string;
    createdAt: string;
    quizzes: any[];
};
export type ClassroomDetailRecord = {
    _id: string;
    classCode: string;
    name: string;
    subject: string;
    teacher: {
        _id: string;
        avatar: string;
        name: string;
    };
    students: {
        _id: string;
        avatar: string;
        name: string;
        email?: string;
    }[];
    posts?: PostItem[];
    classExams: ClassExamItem[];
    examAndPostList: (ClassExamItem | PostItem)[];
    thumb: string;
};
export type BodyCreateClassroom = {
    classroomName: string;
    subjectName: string;
};
