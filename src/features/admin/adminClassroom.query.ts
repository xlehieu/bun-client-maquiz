import { QueryListParams } from '@/@types/queryParam.type';
import { getAdminClassroomList } from '@/api/admin/classroommanagement.service';
import { useQuery } from '@tanstack/react-query';

export const ADMIN_CLASSROOM_QUERY_KEY = {
    ADMIN_USER_QUERY_KEY_LIST: 'ADMIN_CLASSROOM_QUERY_KEY_LIST',
};
export const useAdminClassroomList = (params: QueryListParams<{ keyword?: string }>) => {
    return useQuery({
        queryKey: [ADMIN_CLASSROOM_QUERY_KEY.ADMIN_USER_QUERY_KEY_LIST, JSON.stringify(params)],
        queryFn: () => getAdminClassroomList(params),
        select(dataQuery) {
            const dataSelect = dataQuery.data.data;
            return {
                pagination: {
                    currentPage: dataSelect.currentPage || 0,
                    total: dataSelect.total || 0,
                    totalPage: dataSelect.totalPage || 0,
                },
                classrooms: dataSelect.classrooms || [],
            };
        },
    });
};
