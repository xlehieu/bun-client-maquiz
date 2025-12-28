import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

const ButtonBack = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    return (
        <Button type="link" onClick={router.back}>
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            {children}
        </Button>
    );
};

export default ButtonBack;
