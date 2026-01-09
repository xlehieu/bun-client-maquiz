import { UseQueryOptions } from '@tanstack/react-query';
import { ClassExamItem } from './classExam.type';

export type CollectionDefault = {
    _id: string;
    MaMuc: number;
    TenMuc: string;
};
export type UseQueryOptionsCustom<T, TSelect = T> = Omit<UseQueryOptions<T, Error, TSelect>, 'queryKey' | 'queryFn'>;
