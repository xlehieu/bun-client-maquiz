import { CollectionDefault } from '@/@types/common.type';
import {
    createCollection,
    deleteCollection,
    getListCollectionByName,
    updateCollection,
} from '@/api/collection.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
export const COLLECTION_NAME = {
    SUBJECT: 'subject',
    SCHOOL: 'schools',
};
export const useCollection = (collection: string, queryKey: string[]) => {
    return useQuery({
        queryKey: queryKey,
        enabled: queryKey.length > 0,
        queryFn: () => getListCollectionByName(collection),
        select(dataQuery) {
            return dataQuery.data.data;
        },
    });
};
export const useCreateCollection = <TDataUpdate = any>(collection: string, keyInvalidate: string[]) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TDataUpdate) => createCollection(collection, data),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: keyInvalidate,
            });
        },
    });
};
export const useUpdateCollection = <TDataUpdate = any>(collection: string, keyInvalidate: string[]) => {
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
export const useDeleteCollection = (collection: string, keyInvalidate: string[]) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteCollection(collection, id),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: keyInvalidate,
            });
        },
    });
};
