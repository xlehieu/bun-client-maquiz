import React, { memo, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

type TimerProps = {
    endTime: Date;
    onExpire?: () => void;
    size?: 'sm' | 'md' | 'lg';
};

const SIZE_MAP = {
    sm: { box: 'w-10 h-12 text-xl', label: 'text-[10px]', gap: 'gap-2' },
    md: { box: 'w-16 h-20 text-3xl', label: 'text-xs', gap: 'gap-3' },
    lg: { box: 'w-24 h-28 text-5xl', label: 'text-sm', gap: 'gap-4' },
};

const TimeUnit = ({ value, label, size }: { value: number; label: string; size: any }) => (
    <div className="flex flex-col items-center">
        <div
            className={`
            ${size.box} text-white
            flex items-center justify-center rounded-xl font-bold shadow-lg 
            relative overflow-hidden
        `}
        >
            <div className="absolute inset-0 bg-gradient-to-b bg-primary pointer-events-none" />
            <span className="z-10">{value.toString().padStart(2, '0')}</span>
            <div className="absolute w-full h-[1px] bg-black/20 top-1/2" />
        </div>
        <span className={`mt-2 font-semibold uppercase tracking-wider text-slate-500 ${size.label}`}>{label}</span>
    </div>
);

const Timer = ({ endTime, onExpire, size = 'md' }: TimerProps) => {
    const { seconds, minutes, hours, days, restart } = useTimer({
        expiryTimestamp: endTime,
        autoStart: false,
        onExpire,
    });
    useEffect(() => {
        if (endTime) {
            restart(endTime);
        }
    }, [endTime, restart]);
    const currentSize = SIZE_MAP[size];
    return (
        <div className={`flex items-center font-mono ${currentSize.gap}`}>
            {days > 0 && (
                <>
                    <TimeUnit value={days} label="Ngày" size={currentSize} />{' '}
                    <div className={`flex flex-col ${currentSize.box.split(' ')[1]} justify-center`}>
                        <span className="font-bold text-slate-400">:</span>
                        <div className="h-6" /> {/* Spacer cân đối với label */}
                    </div>
                </>
            )}

            <TimeUnit value={hours} label="Giờ" size={currentSize} />

            <div className={`flex flex-col ${currentSize.box.split(' ')[1]} justify-center`}>
                <span className="font-bold text-slate-400">:</span>
                <div className="h-6" /> {/* Spacer cân đối với label */}
            </div>

            <TimeUnit value={minutes} label="Phút" size={currentSize} />

            <div className={`flex flex-col ${currentSize.box.split(' ')[1]} justify-center`}>
                <span className="font-bold text-slate-400">:</span>
                <div className="h-6" />
            </div>

            <TimeUnit value={seconds} label="Giây" size={currentSize} />
        </div>
    );
};

export default Timer;
