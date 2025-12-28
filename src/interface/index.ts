export interface IUpdateInfoClassroom {
    classCode: string;
    name: string;
    subject: string;
    thumb: any;
}
export interface IGetAndEnrollClassroomDetail {
    classCode?: string;
}
export interface ILoginForm {
    email: string;
    password: string;
}
export type INewsItem = {
    _id?: string;
    id?: string;
    title?: string;
    content?: string;
    // thêm các field khác nếu có
};
export type IUser = {
    access_token: string;
    address: string;
    avatar: any;
    email: string;
    favoriteQuiz: any[];
    isAdmin: boolean;
    name: string;
    phone: string;
    quizAccessHistory: any[];
};
export type IQuiz = {
    _id?: string;
    id?: string;
    name?: string;
    slug?: string;
    time?: number;
    questionCount?: number;
    accessCount?: number;
    examCount?: number;
    description?: string;
    school?: string;
    subject?: string;
    thumb?: string;
    user?: IUser; // Lưu ý dùng Types.ObjectId thay vì mongoose.Schema.Types.ObjectId
    quiz?: any[];
    createdAt?: number; // Optional nếu sử dụng timestamps trong schema
    updatedAt?: number; // Optional nếu sử dụng timestamps trong schema
    topic?: string;
    schoolYear?: number;
    educationLevel?: string[];
    nameNoAccent?: string;
    isDisabled?: boolean;
    isUseChatBot?: boolean;
};
export type IQuerySkipLimit = {
    skip?: number;
    limit?: number;
};
