import { BodyCreateAdmin } from '@/@types/adminUsers.type';
import { createAdminAccount } from '@/api/admin/usermanagement.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ADMIN_USER_QUERY_KEY } from './adminUser.query';

export const useCreateAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: BodyCreateAdmin) => createAdminAccount(data),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: [ADMIN_USER_QUERY_KEY.ADMIN_USER_QUERY_KEY_LIST],
            });
        },
    });
};
