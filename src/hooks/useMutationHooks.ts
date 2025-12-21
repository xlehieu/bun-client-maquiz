'use client';
import { useMutation } from '@tanstack/react-query';

// Giữ đúng chữ ký: nhận `callback`, return mutation.
// Thêm generics để TVariables không bị suy ra thành void.
const useMutationHooks = <TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    callback: (variables: TVariables) => Promise<TData> | TData,
) => {
    const mutation = useMutation<TData, TError, TVariables, TContext>({
        mutationFn: (variables: TVariables) => Promise.resolve(callback(variables)),
    });
    return mutation;
};

export default useMutationHooks;
