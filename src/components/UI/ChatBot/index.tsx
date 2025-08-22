'use client';

import { useEffect } from 'react';

export default function ChatBot() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://app.tudongchat.com/js/chatbox.js';
        script.async = true;
        console.log(script);
        script.onload = () => {
            if ((window as any)?.TuDongChat) {
                const tudong_chatbox = new (window as any).TuDongChat('qEQjnbsnIGbYBin7R31bh');
                tudong_chatbox.initial();
            }
            const iframe = document.querySelector('iframe');
            const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;

            const el = iframeDoc?.querySelector('.text-center.w-full.mt-5.py-3');
            if (el) {
                (el as any).style.display = 'none';
            }
        };
        console.log('HELLO CHAT BOT');
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    return null;
}
