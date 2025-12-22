'use client';
import React, { ImgHTMLAttributes, memo, useState } from 'react';
import { FadeLoader } from 'react-spinners';
import { reactjxColors } from '@/common/constants';
import { Spin } from 'antd';
type LazyImageProp = {
    src?: string | Blob;
    alt?: string;
    className?: string;
    children?: React.ReactNode;
};
const LazyImage = ({ src, alt, className = '', children = null }: LazyImageProp) => {
    const [isLoaded, setIsLoaded] = useState(true);
    return (
        <div className={className}>
            {children}
            {/* Placeholder (hiển thị trong khi ảnh chưa tải xong) */}
            {isLoaded && (
                // <div className="flex z-0 w-full h-full items-center justify-center bg-white">
                //     {placeholder || <FadeLoader className="w-full h-full" color={colors?.primary ?? '#fff'} />}
                // </div>
                <div className="h-full flex flex-1 items-center justify-center">
                    <Spin />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`w-full z-0 h-full object-cover transition-opacity duration-1000 ${
                    !isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsLoaded(false)}
                onError={() => setIsLoaded(false)} // Ẩn placeholder nếu ảnh bị lỗi
            />
        </div>
    );
};

export default memo(LazyImage);
