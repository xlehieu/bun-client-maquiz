const MAIN_ROUTE = {
    HOME: '/',
    CONTACT: '/lien-he',
    NEWS: '/tin-tuc',
    PROFILE: '/thong-tin-tai-khoan',
    CREATE_QUIZ: '/tao-de-thi',
    DISCOVER_QUIZ: '/kham-pha',
    LOGINSUCCESS: '/login-success',
    LOGIN: '/auth/dang-nhap',
    REGISTER: '/auth/dang-ky',
    FORGOT_PASSWORD: '/auth/quen-mat-khau',
    RESET_PASSWORD: '/auth/reset-password',
    NOT_FOUND_PAGE: '/*',
};
export const USER_DASHBOARD_ROUTER = {
    MY_DASHBOARD: '/my-dashboard',
    HISTORY_ACCESS: '/my-dashboard/truy-cap-gan-day',
    MYQUIZ: '/my-dashboard/de-thi-cua-toi/',
    MY_QUIZ_DETAIL: '/my-dashboard/de-thi-cua-toi/:id',
    EDIT_MY_QUIZ_NO_PARAMS: '/my-dashboard/de-thi-cua-toi/chinh-sua/',
    EDIT_MY_QUIZ_WITH_ID: '/my-dashboard/de-thi-cua-toi/chinh-sua/:id',
    CLASSROOM: '/my-dashboard/lop-hoc',
    CREATE_CLASSROOM: '/my-dashboard/lop-hoc/tao-lop-hoc',
};
//có truyền reviewQuiz/:slug ok
export const quizRouter = {
    REVIEW_QUIZ: '/review-quiz',
    TAKE_QUIZ: '/take-quiz',
};
export const adminRouter = {
    USER_LIST: '/admin/users-management',
    USER_DETAIL: '/admin/users-management/detail',
    CLASSROOM_LIST: '/admin/classrooms-management',
    QUIZ_LIST: '/admin/quizzes-management',
    QUIZ_DETAIL: '/admin/quizzes-management/detail',
};
export default MAIN_ROUTE;
