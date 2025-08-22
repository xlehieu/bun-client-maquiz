import React from 'react';
import { ClockLoader } from 'react-spinners';
import { colors } from '@/common/constants';
const LoadingComponent = () => {
    return (
        <div className="w-full h-screen relative">
            <ClockLoader color={colors.primary} size={100} className="absolute mx-auto top-1/2 -translate-y-full" />
        </div>
    );
};

export default LoadingComponent;
