'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import QuizCard from '@/components/Quiz/QuizCard';
import * as UserService from '@/services/user.service';

const MyLibrary = () => {
    const userQuery = useQuery({
        queryKey: ['quizHistoryQuery'],
        queryFn: () => UserService.getUserDetail(),
    });
    useEffect(() => {
        document.title = 'My Dashboard';
    });
    console.log(userQuery.data);
    return (
        <>
            <section className="pb-5">
                <h1 className="text-3xl font-bold text-pink-300 text-center my-5">Đề thi yêu thích</h1>
                <div className="bg-white px-3 pt-3 pb-10 border rounded-lg shadow-md">
                    <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 gap-5">
                        {userQuery?.data?.favoriteQuiz?.map((quiz: any, index: number) => (
                            <QuizCard
                                key={index}
                                name={quiz?.name}
                                imageSrc={quiz?.thumb}
                                slug={quiz?.slug}
                                time={quiz?.createdAt}
                                accessCount={quiz?.accessCount}
                                onDelete={false}
                                examCount={quiz?.examCount}
                                questionCount={quiz?.questionCount}
                                id={quiz._id}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section className="pb-5">
                <h1 className="text-3xl font-bold text-amber-950 text-center my-5">Lịch sử làm bài thi</h1>
                <div className="bg-white px-3 pt-3 pb-10 border rounded-lg shadow-md">
                    <div className="grid grid-cols-2 gap-3">
                        {userQuery?.data?.examHistory?.map((exam: any, index: number) => (
                            <div className="flex border rounded" key={index}>
                                <img className="w-28 h-24 mr-3" src={exam?.quiz?.thumb} />
                                <div className="flex flex-col">
                                    <p className="text-lg">Tên bài thi: {exam?.quiz?.name}</p>
                                    <p className="text-lg">
                                        Điểm: <span className="text-red-600 text-2xl">{exam.score}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default MyLibrary;
