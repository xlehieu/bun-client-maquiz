'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUserProfile } from '@/redux/slices/user.slice';
import React, { Fragment, useEffect } from 'react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { access_token } = useAppSelector((state) => state.auth);
    useEffect(() => {
        if (access_token) {
            dispatch(fetchUserProfile());
        }
    }, [access_token]);
    return <Fragment>{children}</Fragment>;
};

export default AppLayout;
