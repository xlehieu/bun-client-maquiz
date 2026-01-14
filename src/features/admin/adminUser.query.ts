import { QueryListParams } from '@/@types/queryParam.type';
import { getAdminUserListAPI } from '@/api/admin/usermanagement.service';
import { useQuery } from '@tanstack/react-query';

export const ADMIN_USER_QUERY_KEY = {
    ADMIN_USER_QUERY_KEY_LIST: 'ADMIN_USER_QUERY_KEY_LIST',
};
export const useAdminUserList = (params: QueryListParams<{ name?: string }>) => {
    return useQuery({
        queryKey: [ADMIN_USER_QUERY_KEY.ADMIN_USER_QUERY_KEY_LIST, JSON.stringify(params)],
        queryFn: () => getAdminUserListAPI(params),
        select(dataQuery) {
            const dataSelect = dataQuery.data.data;
            return {
                pagination: {
                    currentPage: dataSelect.currentPage || 0,
                    total: dataSelect.total || 0,
                    totalPage: dataSelect.totalPage || 0,
                },
                users: dataSelect.users || [],
            };
        },
    });
};
