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
    posts?: {
        createdBy: string;
        content: string;
        createdAt: string;
        quizzes: any[];
    }[];
    thumb: string;
};
export type BodyCreateClassroom = {
    classroomName: string;
    subjectName: string;
};
