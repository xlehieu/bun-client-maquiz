import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

const ButtonBack = ({ children = 'Trở lại' }: { children?: React.ReactNode }) => {
    const router = useRouter();
    return (
        <button
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:opacity-70 rounded-xl px-5 py-2.5 font-bold transition-all duration-200 shadow-sm"
            onClick={(e) => {
                e.preventDefault();
                router.back();
            }}
        >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            {children}
        </button>
    );
};

export default ButtonBack;
