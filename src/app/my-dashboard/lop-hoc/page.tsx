'use client';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useMutationHooks from '@/hooks/useMutationHooks';
import * as ClassroomService from '@/services/classroom.service';
import { LoadingOutlined } from '@ant-design/icons';
import { userDashboardRouter } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import ClassroomCard from '@/components/UI/ClassroomCard';
import { Modal } from 'antd';
const ModalContext = createContext<any>({});
const ClassroomListContext = createContext<any>({});
// region Context
const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isShowModal, setIsShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState('');
    const [contentModal, setContentModal] = useState(<></>);
    const [textHandleModal, setTextHandleModal] = useState('');
    return (
        <ModalContext.Provider
            value={{
                isShowModal,
                setIsShowModal,
                titleModal,
                setTitleModal,
                contentModal,
                setContentModal,
                textHandleModal,
                setTextHandleModal,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};

const ClassroomListProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['userClassroom'],
        queryFn: () => ClassroomService.getUserClassrooms(),
        // srefetchOnWindowFocus: false, // Khi user quay lại tab, tự động fetch lại
    });
    return (
        <ClassroomListContext.Provider value={{ classList: data, isLoadingQuery: isLoading }}>
            {children}
        </ClassroomListContext.Provider>
    );
};

//region Class list component
const ClassroomList = () => {
    const { classList } = useContext(ClassroomListContext);
    return (
        <>
            {classList?.myClassrooms?.length > 0 && (
                <>
                    <div className="flex flex-col items-center justify-center w-full p-4">
                        <h2 className="text-xl font-bold text-gray-600">Lớp học của tôi</h2>
                    </div>
                    <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
                        {classList?.myClassrooms?.map((classroom: any, index: number) => (
                            <div key={index}>
                                <ClassroomCard isMyClassroom={true} classroom={classroom} />
                            </div>
                        ))}
                    </div>
                </>
            )}
            {classList?.enrolledClassrooms?.length > 0 && (
                <>
                    <div className="flex flex-col items-center justify-center w-full p-4">
                        <h2 className="text-xl font-bold text-gray-600">Lớp học đang tham gia</h2>
                    </div>
                    <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
                        {classList?.enrolledClassrooms?.map((classroom: any, index: number) => (
                            <div key={index}>
                                <ClassroomCard classroom={classroom} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};
//region JOIN CLASS ROOM
const EnrolledClassroomContent = ({ handleClick }: any) => {
    const router = useRouter();
    const [classCode, setClassCode] = useState('');
    const enrollInClassMutation = useMutationHooks((data: { classCode: string }) =>
        ClassroomService.enrollInClassroom(data),
    );
    const handleClickEnroll = () => {
        if (!classCode?.trim()) return toast.error('Vui lòng nhập mã lớp học');
        enrollInClassMutation.mutate({ classCode });
    };
    if (handleClick) {
        handleClick(handleClickEnroll);
    }
    useEffect(() => {
        if (enrollInClassMutation.isError) {
            toast.error((enrollInClassMutation?.error as { message: string }).message);
        } else if (enrollInClassMutation.isSuccess) {
            toast.success('Tham gia lớp học thành công');
            router.push(`${userDashboardRouter.classroom}/${classCode}`);
        }
    }, [enrollInClassMutation.isError, enrollInClassMutation.isSuccess]);
    return (
        <div className="flex flex-col w-full">
            {/* ta phải đặt class peer vào phần tử muốn lắng nghe,
         và thêm peer-... vào phần tử muốn thay đổi
         ví dụ phải đặt peer vào input
         và đặt peer-placeholder-shown:top1/2 nghĩa là khi placeholder của input
        được hiển thị thì phần tử có peer-placeholder-shown sẽ được kích hoạt
            và peer chỉ ảnh hưởng đến phần tử anh em (sibling)
         */}
            <div className="relative w-full">
                <input
                    type="text"
                    id="classroomCode"
                    placeholder=" "
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    className="peer w-full border-2 border-gray-300 rounded-md px-4 pt-4 pb-2 text-base outline-none focus:border-primary transition-all"
                />
                <label
                    htmlFor="classroomCode"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base transition-all cursor-text peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-focus:text-primary bg-white px-1"
                >
                    Mã lớp
                </label>
            </div>
        </div>
    );
};
//region CREATE CLASS ROOM
const CreateClassroomContent = ({ handleClick }: any) => {
    const router = useRouter();
    const { setIsShowModal } = useContext(ModalContext);
    const [classroomName, setClassroomName] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const createClassroomMutation = useMutationHooks((data: { classroomName: string; subjectName: string }) =>
        ClassroomService.createClassroom(data),
    );
    const handleClickCreateClassroomModal = () => {
        if (!classroomName?.trim() || !subjectName?.trim()) {
            return toast.warning('Vui lòng điền đầy đủ thông tin');
        } else {
            createClassroomMutation.mutate({ classroomName, subjectName });
        }
    };
    if (handleClick) {
        handleClick(handleClickCreateClassroomModal);
    }
    useEffect(() => {
        if (createClassroomMutation.isSuccess) {
            toast.success('Tạo lớp học thành công');
            setIsShowModal(false);
            setClassroomName('');
            setSubjectName('');
            router.push(`${userDashboardRouter.classroom}/${createClassroomMutation.data?.classCode}`);
        } else if (createClassroomMutation.isError) {
            toast.error('Tạo lớp học thất bại');
        }
    }, [createClassroomMutation.isError, createClassroomMutation.isSuccess]);
    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full">
                <input
                    type="text"
                    id="classroomName"
                    placeholder=" "
                    autoComplete="off"
                    className="peer w-full border-2 border-gray-300 rounded-md px-4 pt-4 pb-2 text-base outline-none focus:border-primary transition-all"
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                />
                <label
                    htmlFor="classroomName"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base transition-all cursor-text peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-focus:text-primary bg-white px-1"
                >
                    Tên lớp
                </label>
            </div>
            <div className="relative w-full mt-5">
                <input
                    type="text"
                    id="classroomSubject"
                    placeholder=" "
                    autoComplete="off"
                    className="peer w-full border-2 border-gray-300 rounded-md px-4 pt-4 pb-2 text-base outline-none focus:border-primary transition-all"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                />
                <label
                    htmlFor="classroomSubject"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base transition-all cursor-text peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-focus:text-primary bg-white px-1"
                >
                    Môn học
                </label>
            </div>
        </div>
    );
};

const ClassroomsPageMain = () => {
    const {
        isShowModal,
        setIsShowModal,
        titleModal,
        setTitleModal,
        contentModal,
        setContentModal,
        textHandleModal,
        setTextHandleModal,
    } = useContext(ModalContext);
    //truyền props title,content,textButtonHandle từ render vào hàm
    const handleOpenModal = (title: string, content: string, textHandleButton: string) => {
        setTitleModal(title);
        setContentModal(content);
        setTextHandleModal(textHandleButton);
        setIsShowModal(true);
    };
    const receiveHandleOk = (handleOk: () => Promise<void>) => {
        setCallback(() => handleOk);
    };
    const [callback, setCallback] = useState<() => Promise<void>>();
    const [loadingModal, setLoadingModal] = useState(false);
    const handleOk = async () => {
        setLoadingModal(true);
        if (callback) {
            await callback();
        }
        setLoadingModal(false);
        setIsShowModal(false);
    };
    const modalContents: any = [
        {
            title: 'Tham gia lớp học',
            content: <EnrolledClassroomContent handleClick={receiveHandleOk} />,
            textHandleButton: 'Tham gia',
            textCancel: 'Hủy',
        },
        {
            title: 'Tạo lớp học',
            content: <CreateClassroomContent handleClick={receiveHandleOk} />,
            textHandleButton: 'Tạo lớp học',
            textCancel: 'Hủy',
        },
    ];

    return (
        <>
            <div className="flex justify-between my-5 w-full">
                <h4 className="font-medium text-gray-500">Lớp học</h4>
            </div>
            <section className="w-full min-h-screen bg-white px-8 rounded-xl shadow-lg flex flex-col">
                <div className="w-full border-b flex justify-end">
                    <Tippy
                        interactive={true}
                        hideOnClick="toggle" // Mặc định là true, có thể bỏ đi
                        placement="bottom-end"
                        offset={[10, -10]}
                        content={
                            <div className="flex flex-col shadow-md bg-white" tabIndex={-1}>
                                {modalContents.map((modal: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleOpenModal(modal.title, modal.content, modal.textHandleButton)
                                        }
                                        className="text-gray-600 duration-200 px-4 py-2 text-left hover:rounded hover:bg-black/5"
                                    >
                                        {modal?.title}
                                    </button>
                                ))}
                            </div>
                        }
                    >
                        <button className="mr-3 px-2 py-2">
                            <FontAwesomeIcon icon={faPlus} className="text-3xl md:text-xl text-gray-500" />
                        </button>
                    </Tippy>
                </div>
                <ClassroomList />
            </section>
            <Modal
                className="w-1/2"
                title={titleModal}
                okText={textHandleModal}
                onCancel={() => setIsShowModal(false)}
                open={isShowModal}
                onOk={handleOk}
                confirmLoading={loadingModal}
            >
                {contentModal}
            </Modal>
        </>
    );
};
const ClassroomsPage = () => (
    <ModalProvider>
        <ClassroomListProvider>
            <ClassroomsPageMain />
        </ClassroomListProvider>
    </ModalProvider>
);
export default ClassroomsPage;
