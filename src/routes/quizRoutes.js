import { lazy } from 'react';
import { quizRouter } from '~/config';
const SubLayout = lazy(() => import('~/layouts/SubLayout'));
const ReviewQuizPage = lazy(() => import('~/pages/QuizPage/ReviewQuizPage'));
const TakeQuizPage = lazy(() => import('~/pages/QuizPage/TakeQuizPage'));

const quizRoutes = [
    {
        path: `${quizRouter.reviewQuiz}/:slug`,
        component: ReviewQuizPage,
        layout: SubLayout,
    },
    {
        path: `${quizRouter.takeQuiz}/:slug`,
        component: TakeQuizPage,
        layout: SubLayout,
    },
];

export default quizRoutes;
