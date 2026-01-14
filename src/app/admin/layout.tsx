'use client';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUserProfile } from '@/redux/slices/user.slice';
import React, { Fragment, useEffect } from 'react';
import NotFound from '../not-found';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { userProfile, isFetchingUserProfile } = useAppSelector((state) => state.user);
    useEffect(() => {
        console.log('userProfile', userProfile);
        if (!userProfile?._id) {
            dispatch(fetchUserProfile());
        }
    }, []);
    // if (isFetchingUserProfile) return <LoadingComponent />;
    return (
        <Fragment>
            {!userProfile?.isAdmin && !isFetchingUserProfile ? (
                <NotFound />
            ) : (
                <DashboardLayout>{children}</DashboardLayout>
            )}
        </Fragment>
    );
};

export default Layout;
