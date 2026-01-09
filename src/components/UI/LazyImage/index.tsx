'use client';
import React, { memo, useState, useEffect } from 'react';
import { Spin } from 'antd';

type LazyImageProp = {
    src?: string; // Thường là string URL
    alt?: string;
    className?: string;
    skeletonClassName?: string; // Custom riêng cho khung loading
};

const LazyImage = ({ src, alt, className = '', skeletonClassName = '' }: LazyImageProp) => {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
        // Reset trạng thái khi src thay đổi
        if (src) {
            setStatus('loading');
            setCurrentSrc(src);
        } else {
            setStatus('error');
        }
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* 1. Placeholder / Skeleton: Hiển thị khi đang loading */}
            {status === 'loading' && (
                <div
                    className={`absolute inset-0 z-10 flex items-center justify-center bg-slate-100 animate-pulse ${skeletonClassName}`}
                >
                    {/* Bạn có thể dùng Spin của Antd hoặc một Icon mờ */}
                    <Spin size="small" className="text-primary" />
                </div>
            )}

            {/* 2. Fallback khi ảnh lỗi */}
            {status === 'error' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-200 text-slate-400 p-2 text-center">
                    <span className="text-lg">🖼️</span>
                    <span className="text-[10px] mt-1 font-medium">No Image</span>
                </div>
            )}

            {/* 3. Thẻ Image chính */}
            <img
                src={currentSrc}
                alt={alt || 'MaQuiz Image'}
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
                    status === 'loaded' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-lg'
                }`}
                onLoad={() => setStatus('loaded')}
                onError={() => setStatus('error')}
                loading="lazy" // Tận dụng lazy load trình duyệt
            />
        </div>
    );
};

export default memo(LazyImage);
