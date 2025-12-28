'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMyClassroom } from '@/redux/slices/classrooms.slice';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'antd';
import { useLayoutEffect, useState } from 'react';
import ListClassroom from './components/ListClassroom';
import ModalCreateClassroom from './components/ModalCreateClassroom';
import ModalEnrollClassroom from './components/ModalEnrollClassroom';

const ClassroomsPageMain = () => {
    const dispatch = useAppDispatch();
    const { enrolledClassrooms, myClassrooms } = useAppSelector((state) => state.classroom);
    const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
    const [isOpenModalEnroll, setIsOpenModalEnroll] = useState(false);
    useLayoutEffect(() => {
        if (enrolledClassrooms.length <= 0 || myClassrooms.length <= 0) dispatch(fetchMyClassroom());
    }, []);
    return (
        <>
            <div className="flex justify-between my-5 w-full">
                <h4 className="font-medium text-gray-500">Lớp học</h4>
            </div>
            <section className="w-full min-h-screen bg-white px-8 rounded-xl shadow-lg flex flex-col">
                <div className="w-full border-b flex justify-end">
                    <Dropdown
                        overlay={
                            <div className="flex flex-col shadow-md bg-white" tabIndex={-1}>
                                <button
                                    onClick={() => setIsOpenModalEnroll(true)}
                                    className="text-gray-600 duration-200 px-4 py-2 text-left hover:rounded hover:bg-black/5"
                                >
                                    Tham gia lớp học
                                </button>
                                <button
                                    onClick={() => setIsOpenModalCreate(true)}
                                    className="text-gray-600 duration-200 px-4 py-2 text-left hover:rounded hover:bg-black/5"
                                >
                                    Tạo lớp học
                                </button>
                            </div>
                        }
                    >
                        <button className="mr-3 px-2 py-2">
                            <FontAwesomeIcon icon={faPlus} className="text-3xl md:text-xl text-gray-500" />
                        </button>
                    </Dropdown>
                </div>
                <ListClassroom />
            </section>
            <ModalCreateClassroom isOpen={isOpenModalCreate} onClose={() => setIsOpenModalCreate(false)} />
            <ModalEnrollClassroom isOpen={isOpenModalEnroll} onClose={() => setIsOpenModalEnroll(false)} />
        </>
    );
};
export default ClassroomsPageMain;
