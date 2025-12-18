'use client'
import React, { useEffect, useState } from 'react';
const useDebounce = (value: any, delay = 500) => {
    const [debouncedValue, setDebounceValue] = useState(value);
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounceValue(value);
        }, delay);
        return () => clearTimeout(timerId);
    }, [value]);
    return debouncedValue;
};
export default useDebounce;
