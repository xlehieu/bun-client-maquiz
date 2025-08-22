import { lazy } from 'react';
import { userDashboardRouter } from '~/config';
import DashboardLayout from '~/layouts/DashboardLayout';
const HistoryAccessPage = lazy(() => import('~/pages/MyDashboard/AccessHistoryPage'));
const MainDashboard = lazy(() => import('~/pages/MyDashboard/MyLibraryPage'));
const MyQuizPage = lazy(() => import('~/pages/MyDashboard/MyQuizzesPage'));
const QuizDetailPage = lazy(() => import('~/pages/MyDashboard/QuizDetailPage'));
const EditMyQuizPage = lazy(() => import('~/pages/MyDashboard/EditMyQuizPage'));
const ClassroomsPage = lazy(() => import('~/pages/MyDashboard/ClassroomsPage'));
const ClassroomDetailPage = lazy(() => import('~/pages/MyDashboard/ClassroomsPage/ClassroomDetailPage'));
const userDashboardRoutes = [
    {
        path: userDashboardRouter.myDashboard,
        component: MainDashboard,
        layout: DashboardLayout,
        title: 'Dashboard',
    },
    {
        path: userDashboardRouter.historyAccess,
        component: HistoryAccessPage,
        layout: DashboardLayout,
        title: 'Đề thi đã truy cập',
    },
    {
        path: userDashboardRouter.myQuiz,
        component: MyQuizPage,
        layout: DashboardLayout,
        title: 'Đề thi của tôi',
    },
    {
        path: userDashboardRouter.myQuizDetail,
        component: QuizDetailPage,
        layout: DashboardLayout,
        title: 'Dashboard',
    },
    {
        path: userDashboardRouter.editMyQuiz,
        component: EditMyQuizPage,
        layout: DashboardLayout,
        title: 'Chỉnh sửa đề thi',
    },
    {
        path: userDashboardRouter.classroom,
        component: ClassroomsPage,
        layout: DashboardLayout,
        title: 'Lớp học',
    },
    {
        path: `${userDashboardRouter.classroom}/:classCode`,
        component: ClassroomDetailPage,
        layout: DashboardLayout,
        title: 'Lớp học',
    },
];

export default userDashboardRoutes;
