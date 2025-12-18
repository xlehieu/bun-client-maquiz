'use client'
import React from 'react';
import { ClockLoader } from 'react-spinners';
import { colors } from '@/common/constants';
const LoadingComponent = ({ isLoading, children }: { isLoading?: boolean; children?: React.ReactNode }) => {
    return (
        <>
            {isLoading && (
                <div className="inset-0 absolute flex flex-col gap-2 items-center justify-center bg-[#fffdf3]/50">
                    <ClockLoader color={colors.primary} size={100} className="" />
                    <div>
                        <p className="text-primary-bold font-bold">Maquiz</p>
                    </div>
                </div>
            )}
            {children}
        </>
    );
};

export default LoadingComponent;
