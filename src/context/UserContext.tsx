'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUser } from '@/redux/slices/user.slice';
import * as UserService from '@/services/user.service';
export const UserContext = createContext<any>(null);
const UserProvide = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    useEffect(() => {
        if (user.email) return;
        dispatch(fetchUserProfile() as any);
    }, [user.email, dispatch]);
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export default UserProvide;
