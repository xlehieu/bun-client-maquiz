import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import siteRouter from '~/config';
import * as VerifyService from '~/services/verify.service';
import LoadingComponent from '../LoadingComponent';
const AdminGuard = ({ children }) => {
    const isAdmin = useQuery({ queryKey: ['isAdminQuery'], queryFn: () => VerifyService.verify() });
    //if (!isAdmin.data) return <Navigate to={'/page-not-found'} />;
    return <>{isAdmin.isPending ? <LoadingComponent /> : <>{children}</>}</>;
};

export default AdminGuard;
