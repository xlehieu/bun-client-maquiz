import axiosCredentials from '@/config/axios.instance';
import { ApiResponse } from '@/@types/api.type';
import { CollectionDefault } from '@/@types/common.type';

export const getListCollectionByName = async (collection: string) => {
    return axiosCredentials.get<ApiResponse<CollectionDefault[]>>(`/collection/${collection}`);
};
export const createCollection = async <T = any>(collection: string, body: T) => {
    return axiosCredentials.post<ApiResponse<T>>(`/collection/${collection}`, body);
};
export const updateCollection = async <T = any>(collection: string, id: string, body: T) => {
    return axiosCredentials.put<ApiResponse<T>>(`/collection/${collection}/${id}`, body);
};
export const deleteCollection = async <T = any>(collection: string, id: string) => {
    return axiosCredentials.delete<ApiResponse<T>>(`/collection/${collection}/${id}`);
};
