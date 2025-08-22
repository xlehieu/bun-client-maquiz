'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@/redux/slices/user.slice';
import * as UserService from '@/services/user.service';
export const UserContext = createContext<any>(null);
const UserProvide = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const handleUpdateUser = async () => {
        if (user.email) return;
        const res = await UserService.getUserDetail();
        if (res) {
            dispatch(updateUser({ ...res }));
        }
        return res;
    };
    const userQuery = useQuery({ queryKey: ['user'], queryFn: handleUpdateUser, enabled: !user.email });
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export default UserProvide;
