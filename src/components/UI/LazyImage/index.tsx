'use client'
import React, { memo, useState } from 'react';
import { FadeLoader } from 'react-spinners';
import { colors } from '@/common/constants';

const LazyImage = ({ src, alt, className = '', placeholder, children }: any) => {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
        <div className={className}>
            {children}
            {/* Placeholder (hiển thị trong khi ảnh chưa tải xong) */}
            {!isLoaded && (
                <div className="flex z-0 w-full h-full items-center justify-center bg-white">
                    {placeholder || <FadeLoader className="w-full h-full" color={colors?.primary ?? '#fff'} />}
                </div>
            )}

            {/* Ảnh chính */}
            <img
                src={src}
                alt={alt}
                className={`w-full z-0 h-full object-cover transition-opacity duration-1000 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsLoaded(true)}
                onError={() => setIsLoaded(true)} // Ẩn placeholder nếu ảnh bị lỗi
            />
        </div>
    );
};

export default memo(LazyImage);
