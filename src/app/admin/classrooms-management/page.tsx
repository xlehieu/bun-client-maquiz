'use client';
import { useQuery } from '@tanstack/react-query';
import { message, Pagination } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useReducer, useState } from 'react';
import { PAGE_SIZE } from '@/common/constants';
import useMutationHooks from '@/hooks/useMutationHooks';
import * as ClassroomManagementService from '@/services/admin/classroommanagement.service';
import { toast } from 'sonner';
const active_type = {
    CHANGE_DISABLED: 'CHANGE_DISABLED',
    SET_CLASSROOM_LIST: 'SET_CLASSROOM_LIST',
};
const classroomManageReducer = (state: any, action: any) => {
    switch (action.type) {
        case active_type.SET_CLASSROOM_LIST: {
            if (action.payload.classrooms) return action.payload.classrooms;
            return state;
        }
        case active_type.CHANGE_DISABLED: {
            const classrooms = [...state];
            if (action.payload.id) {
                const idx = classrooms.findIndex((classrooms) => classrooms._id == action.payload.id);
                console.log(idx);
                console.log('before change', [...classrooms]);
                if (idx !== -1) {
                    classrooms[idx] = { ...classrooms[idx], isDisabled: !classrooms[idx].isDisabled };
                }
                console.log('after change', [...classrooms]);
                return [...classrooms];
            }
            return state;
        }
        default:
            return state;
    }
};
const ClassroomManagement = () => {
    const [classroomList, dispatchQuizzesList] = useReducer(classroomManageReducer, []);
    const [totalClassroom, setTotalClassroom] = useState(0);
    const classroomListQuery = useQuery({
        queryKey: ['quizzesListQuery'],
        queryFn: () => ClassroomManagementService.getClassroomList({}),
    });
    const getClassroomsListMutation = useMutationHooks((data: any) =>
        ClassroomManagementService.getClassroomList(data),
    );
    useEffect(() => {
        if (classroomListQuery.data) {
            setTotalClassroom(classroomListQuery.data?.total);
            dispatchQuizzesList({
                type: active_type.SET_CLASSROOM_LIST,
                payload: {
                    classrooms: classroomListQuery.data?.classrooms,
                },
            });
        } else if (classroomListQuery.isError) {
            message.error('Đã có lỗi xảy ra');
        }
    }, [classroomListQuery]);
    useEffect(() => {
        if (getClassroomsListMutation.isSuccess) {
            dispatchQuizzesList({
                type: active_type.SET_CLASSROOM_LIST,
                payload: {
                    classrooms: getClassroomsListMutation.data?.classrooms,
                },
            });
        }
    }, [getClassroomsListMutation]);
    const handlePageChange = (page: number) => {
        getClassroomsListMutation.mutate({ skip: (Number(page - 1) || 0) * PAGE_SIZE });
    };

    const changeQuizDisabledMutation = useMutationHooks((data: any) =>
        ClassroomManagementService.changeClassroomDisabled(data),
    );
    const handleChangeQuizDisabled = (id: string) => {
        if (!id) return toast.error('Không tìm thấy lớp học');
        changeQuizDisabledMutation.mutate({ id });
        dispatchQuizzesList({
            type: active_type.CHANGE_DISABLED,
            payload: {
                id,
            },
        });
        toast.success('Cập nhật trạng thái thành công');
        // setTimeout(() => {
        //     location.reload();
        // }, 1000);
    };
    useEffect(() => {
        console.log(classroomList);
    }, [classroomList]);
    return (
        <>
            <section className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl my-5 text-gray-700">DANH SÁCH LỚP HỌC</h1>
                    <p className="text-lg">
                        Tổng số: <span className="text-primary text-xl">{totalClassroom}</span>
                    </p>
                </div>
                <table className="w-full min-w-[640px] table-auto">
                    <thead>
                        <tr>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                <p className="block antialiased font-sans text-[13px] font-bold uppercase text-blue-gray-400">
                                    Lớp học
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased font-sans text-[13px] font-bold uppercase text-blue-gray-400">
                                    Mã lớp
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased font-sans text-[13px] font-bold uppercase text-blue-gray-400">
                                    Số thành viên
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased font-sans text-[13px] font-bold uppercase text-blue-gray-400">
                                    Ngày tạo
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased font-sans text-[13px] font-bold uppercase text-blue-gray-400">
                                    Chặn
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {classroomList?.map((classroom: any, idx: number) => (
                            <tr key={idx}>
                                {/* image */}
                                <td className="py-3 px-5 border-b border-blue-gray-50">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={classroom.thumb}
                                            alt="Avatar"
                                            className="inline-block relative object-cover object-center w-24 h-24 rounded-md"
                                        />
                                        <div>
                                            <p className="block antialiased font-sans text-normal leading-normal text-blue-gray-900 font-semibold">
                                                {classroom.name || ''}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                {/* student length */}
                                <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
                                    <p className="block antialiased font-sans text-base font-semibold text-blue-gray-600">
                                        {classroom?.classCode || ''}
                                    </p>
                                </td>
                                {/* student length */}
                                <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
                                    <p className="block antialiased font-sans text-base font-semibold text-blue-gray-600">
                                        {classroom?.students?.length || 0}
                                    </p>
                                </td>
                                {/* Ngày tạo */}
                                <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
                                    <p className="block antialiased font-sans text-basefont-semibold text-blue-gray-600">
                                        {classroom.createdAt ? dayjs(classroom.createdAt).format('DD/MM/YYYY') : 'null'}
                                    </p>
                                </td>
                                <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            onChange={() => handleChangeQuizDisabled(classroom._id)}
                                            checked={classroom.isDisabled}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-primary dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                                        <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-300"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    className="mt-3"
                    onChange={(e) => handlePageChange(e)}
                    defaultCurrent={1}
                    defaultPageSize={PAGE_SIZE}
                    total={totalClassroom || PAGE_SIZE}
                />
            </section>
        </>
    );
};

export default ClassroomManagement;
