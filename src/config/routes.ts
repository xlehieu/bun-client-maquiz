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
    CLASSROOM_DETAIL_PARAM: '/my-dashboard/lop-hoc/:classCode',
    VIEW_EXAM_ATTEMPT: '/my-dashboard/lop-hoc/:classCode/view/:classExamId',
    CREATE_CLASSROOM: '/my-dashboard/lop-hoc/tao-lop-hoc',
    TAKE_CLASS_EXAM: '/my-dashboard/lop-hoc/:classCode/exam/:idClassExam',
};
//có truyền reviewQuiz/:slug ok
export const quizRouter = {
    REVIEW_QUIZ: '/review-quiz',
    TAKE_QUIZ: '/take-quiz',
};
export const ADMIN_ROUTER = {
    USER_LIST: '/admin/users-management',
    CLASSROOM_LIST: '/admin/classrooms-management',
    QUIZ_LIST: '/admin/quizzes-management',
    TAI_NGUYEN_HE_THONG: '/admin/tai-nguyen-he-thong',
};

export const getRouteConfigParam = (route: string, params: string[]) => {
    console.log(params);
    const routeSplit = route.split('/');
    let currentParam = 0; // Đổi const thành let
    return routeSplit.reduce((acc, currentValue) => {
        // Bỏ qua các phần tử rỗng do split("/") tạo ra ở đầu/cuối chuỗi
        if (currentValue === '') return acc;

        if (currentValue.startsWith(':')) {
            const p = params?.[currentParam++] || currentValue;
            return `${acc}/${p}`;
        }
        return `${acc}/${currentValue}`;
    }, '');
};
export default MAIN_ROUTE;
