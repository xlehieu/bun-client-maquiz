import { CollectionDefault } from '@/@types/common.type';
import { createCollection, getListCollectionByName, updateCollection } from '@/api/collection.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCollection = (collection: string, queryKey: string[]) => {
    return useQuery({
        queryKey: queryKey,
        enabled: queryKey.length > 0,
        queryFn: () => getListCollectionByName(collection),
    });
};
export const useCreateSubject = (collection: string, keyInvalidate: string[]) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: <TBody = any>(data: TBody) => createCollection(collection, data),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: keyInvalidate,
            });
        },
    });
};
export const useUpdateSubject = <TDataUpdate = any>(collection: string, keyInvalidate: string[]) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { body: TDataUpdate; id: string }) => updateCollection(collection, data.id, data.body),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: keyInvalidate,
            });
        },
    });
};
