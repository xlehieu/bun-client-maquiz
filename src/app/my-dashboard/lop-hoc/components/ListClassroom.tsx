import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React from 'react';
import ClassroomCard from './ClassroomCard';
import { Spin } from 'antd';

const ListClassroom = () => {
    const { enrolledClassrooms, myClassrooms, isLoading } = useAppSelector((state) => state.classroom);
    return (
        <Spin spinning={isLoading}>
            {myClassrooms?.length > 0 && (
                <>
                    <div className="flex flex-col items-center justify-center w-full p-4">
                        <h2 className="text-xl font-bold text-gray-600">Lớp học của tôi</h2>
                    </div>
                    <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
                        {myClassrooms?.map((classroom: any, index: number) => (
                            <div key={index}>
                                <ClassroomCard isMyClassroom={true} classroom={classroom} />
                            </div>
                        ))}
                    </div>
                </>
            )}
            {enrolledClassrooms?.length > 0 && (
                <>
                    <div className="flex flex-col items-center justify-center w-full p-4">
                        <h2 className="text-xl font-bold text-gray-600">Lớp học đang tham gia</h2>
                    </div>
                    <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
                        {enrolledClassrooms?.map((classroom: any, index: number) => (
                            <div key={index}>
                                <ClassroomCard classroom={classroom} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </Spin>
    );
};

export default ListClassroom;
