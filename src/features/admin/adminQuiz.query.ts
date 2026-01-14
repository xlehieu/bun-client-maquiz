import { QueryListParams } from '@/@types/queryParam.type';
import { getAdminClassroomList } from '@/api/admin/classroommanagement.service';
import { getAdminQuizList } from '@/api/admin/quizmanagement.service';
import { useQuery } from '@tanstack/react-query';

export const ADMIN_QUIZ_QUERY_KEY = {
    ADMIN_QUIZ_QUERY_KEY_LIST: 'ADMIN_QUIZ_QUERY_KEY',
};
export const useAdminQuizList = (params: QueryListParams<{ keyword?: string }>) => {
    return useQuery({
        queryKey: [ADMIN_QUIZ_QUERY_KEY.ADMIN_QUIZ_QUERY_KEY_LIST, JSON.stringify(params)],
        queryFn: () => getAdminQuizList(params),
        select(dataQuery) {
            const dataSelect = dataQuery.data.data;
            return {
                pagination: {
                    currentPage: dataSelect.currentPage || 0,
                    total: dataSelect.total || 0,
                    totalPage: dataSelect.totalPage || 0,
                },
                quizzes: dataSelect.quizzes || [],
            };
        },
    });
};
