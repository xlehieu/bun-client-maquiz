'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { createContext, ReactNode, useEffect, useState } from 'react';
import * as QuizService from '@/services/quiz.service';
import { toast } from 'sonner';
export const QuizDetailContext = createContext<any>(null);
export const SetQuizDetailContext = createContext<any>(null);
const QuizProvider = ({ children }: { children: ReactNode }) => {
    const params = useParams();
    const id = params?.id as string; // id từ param url
    const [quizDetail, setQuizDetail] = useState<any>({});
    const getQuizQuery = useQuery({
        queryKey: ['getQuizQuery', id],
        queryFn: () => QuizService.getQuizDetail(id),
    });
    useEffect(() => {
        if (getQuizQuery.isError) {
            toast.error('Lỗi!, không tìm thấy đề thi');
        }
        if (getQuizQuery.data) {
            setQuizDetail(getQuizQuery.data);
        }
    }, [getQuizQuery.data, getQuizQuery.isError]);
    return (
        <QuizDetailContext.Provider value={quizDetail}>
            <SetQuizDetailContext.Provider value={setQuizDetail}>{children}</SetQuizDetailContext.Provider>
        </QuizDetailContext.Provider>
    );
};
export default QuizProvider;
