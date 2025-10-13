'use client'
import React from 'react';
import { ClockLoader, MoonLoader } from 'react-spinners';
import { colors } from '@/common/constants';
const LoadingIcon = ({
    width = 32,
    height = 32,
    className = '',
}: {
    width?: number;
    height?: number;
    className?: string;
}) => {
    return (
        <div className={`w-[${width}] h-[${height}] ${className}`}>
            <MoonLoader color={colors.primary} size={width} />
        </div>
    );
};

export default LoadingIcon;
