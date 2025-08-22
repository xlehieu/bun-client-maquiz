import { lazy } from 'react';
import AdminGuard from '~/components/AdminGuard';
import { adminRouter } from '~/config';
import AdminLayout from '~/layouts/AdminLayout';
const UserManagement = lazy(() => import('~/pages/Admin/UserManagement'));
const UserDetail = lazy(() => import('~/pages/Admin/UserManagement/UserDetail'));

const ClassroomManagement = lazy(() => import('~/pages/Admin/ClassroomManagement'));
const QuizManagement = lazy(() => import('~/pages/Admin/QuizManagement'));
const QuizDetail = lazy(() => import('~/pages/Admin/QuizManagement/QuizDetail'));

const adminRoutes = {
    path: '',
    element: (
        <AdminGuard>
            <AdminLayout />
        </AdminGuard>
    ),
    children: [
        { path: adminRouter.userList, element: <UserManagement /> },
        { path: `${adminRouter.userDetail}/:id`, element: <UserDetail /> },
        { path: adminRouter.quizList, element: <QuizManagement /> },
        { path: `${adminRouter.quizDetail}/:id`, element: <QuizDetail /> },
        { path: adminRouter.classroomList, element: <ClassroomManagement /> },
    ],
};
export default adminRoutes;
