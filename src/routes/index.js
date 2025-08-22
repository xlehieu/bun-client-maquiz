import siteRouter from '~/config';
import userDashboardRoutes from './userDashboardRoutes';
import quizRoutes from './quizRoutes';
import { lazy } from 'react';
import LoginSuccess from '~/pages/Site/LoginSuccessPage';
const SubLayout = lazy(() => import('~/layouts/SubLayout'));
const DefaultLayout = lazy(() => import('../layouts/DefaultLayout'));
const SignInUpLayout = lazy(() => import('~/layouts/SignInUpLayout'));
const NotFoundLayout = lazy(() => import('~/layouts/NotFoundLayout'));
//region PAGES
const HomePage = lazy(() => import('../pages/Site/HomePage/HomePage'));
const ContactPage = lazy(() => import('../pages/Site/ContactPage'));
const NewsPage = lazy(() => import('../pages/Site/NewsPage'));
const NotFoundPage = lazy(() => import('../pages/Site/NotFoundPage/NotFoundPage'));
const SignInPage = lazy(() => import('~/pages/Site/SignInPage'));
const SignUpPage = lazy(() => import('~/pages/Site/SignUpPage'));
const ProfileUser = lazy(() => import('~/pages/Site/ProfileUserPage'));
const CreateQuizPage = lazy(() => import('~/pages/QuizPage/CreateQuizPage'));
const DiscoverPage = lazy(() => import('~/pages/Site/DiscoveryPage'));
const ForgotPasswordPage = lazy(() => import('~/pages/Site/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('~/pages/Site/ResetPasswordPage'));
//end

export const publicRoutes = [
    { path: siteRouter.home, component: HomePage, title: 'Trang chủ' },
    { path: siteRouter.contact, component: ContactPage, title: 'Liên hệ em Hiếu' },
    { path: siteRouter.news, component: NewsPage, title: 'Tin tức' },
    { path: siteRouter.signIn, component: SignInPage, layout: SignInUpLayout, title: 'Đăng nhập' },
    { path: siteRouter.signUp, component: SignUpPage, layout: SignInUpLayout, title: 'Đăng ký' },
    { path: siteRouter.forgotPassword, component: ForgotPasswordPage, layout: SignInUpLayout, title: 'Quên mật khẩu' },
    { path: siteRouter.resetPassword, component: ResetPasswordPage, layout: SignInUpLayout, title: 'Đặt lại mật khẩu' },
    { path: siteRouter.profile, component: ProfileUser, layout: DefaultLayout },
    { path: siteRouter.createQuiz, component: CreateQuizPage, layout: DefaultLayout, title: 'Tạo đề thi' },
    { path: siteRouter.discover, component: DiscoverPage, layout: SubLayout, title: 'Khám phá' },
    { path: siteRouter.loginSuccess, component: LoginSuccess },

    // { path: router.reviewQuiz, component: QuizPages.ReviewQuizPage, layout: DefaultLayout },
    //Admin
    //Dashboard
    ...userDashboardRoutes,
    ...quizRoutes,
    { path: siteRouter.notFoundPage, component: NotFoundPage, layout: NotFoundLayout },
];
