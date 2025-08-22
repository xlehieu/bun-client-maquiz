'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import * as UserService from '@/services/user.service';
import QuizCard from '@/components/Quiz/QuizCard';
// import useMutationHooks from '@/hooks/useMutationHooks';
import { IQuiz } from '@/interface';

const HistoryAccessPage = () => {
    const [quizzes, setQuizzes] = useState<any>({});
    const userQuery = useQuery({
        queryKey: ['userQuery'],
        queryFn: () => UserService.getQuizzesAccessHistory({}),
    });
    //const getQuizzesAccessHistoryMutation = useMutationHooks(() => UserService.getQuizzesAccessHistory());
    //     data
    // :
    // (6) [{…}, {…}, {…}, {…}, {…}, {…}]
    // message
    // :
    // "Successfully fetched"
    // success
    // :
    // true
    useEffect(() => {
        if (userQuery.isSuccess) {
            setQuizzes(userQuery.data);
        }
        console.log('data', userQuery.data);
    }, [userQuery.data]);
    return (
        <section className="pb-5">
            <h1 className="text-3xl font-bold text-gray-500 text-center my-5">Lịch sử truy cập bài thi</h1>
            <div className="bg-white px-3 pt-3 pb-10 border rounded-lg shadow-md">
                <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {quizzes?.length > 0 &&
                        quizzes?.map((quiz: IQuiz, index: number) => (
                            <QuizCard
                                key={index}
                                time={quiz.createdAt}
                                questionCount={quiz.questionCount || 0}
                                imageSrc={quiz.thumb}
                                accessCount={quiz.accessCount}
                                examCount={quiz.examCount}
                                slug={quiz.slug}
                                name={quiz.name}
                                id={quiz._id}
                            />
                        ))}
                </div>
            </div>
        </section>
    );
};

export default HistoryAccessPage;
