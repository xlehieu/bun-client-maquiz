const siteRouter = {
    home: '/',
    contact: '/lien-he',
    news: '/tin-tuc',
    profile: '/thong-tin-tai-khoan',
    createQuiz: '/tao-de-thi',
    discover: '/kham-pha',
    loginSuccess: '/login-success',
    signIn: '/auth/dang-nhap',
    signUp: '/auth/dang-ky',
    forgotPassword: '/auth/quen-mat-khau',
    resetPassword: '/auth/reset-password',
    notFoundPage: '/*',
};
export const userDashboardRouter = {
    myDashboard: '/my-dashboard',
    historyAccess: '/my-dashboard/truy-cap-gan-day',
    myQuiz: '/my-dashboard/de-thi-cua-toi/',
    myQuizDetail: '/my-dashboard/de-thi-cua-toi/:id',
    editMyQuizNoParam: '/my-dashboard/de-thi-cua-toi/chinh-sua/',
    editMyQuiz: '/my-dashboard/de-thi-cua-toi/chinh-sua/:id',
    classroom: '/my-dashboard/lop-hoc',
    createClassroom: '/my-dashboard/lop-hoc/tao-lop-hoc',
};
//có truyền reviewQuiz/:slug ok
export const quizRouter = {
    reviewQuiz: '/review-quiz',
    takeQuiz: '/take-quiz',
};
export const adminRouter = {
    userList: '/admin/users-management',
    userDetail: '/admin/users-management/detail',
    classroomList: '/admin/classrooms-management',
    quizList: '/admin/quizzes-management',
    quizDetail: '/admin/quizzes-management/detail',
};
export default siteRouter;
