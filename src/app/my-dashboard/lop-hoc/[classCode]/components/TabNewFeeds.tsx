'use client';
import { createPost, deletePostById } from '@/api/posts.service';
import QuizCard from '@/components/Quiz/QuizCard/QuizCard';
import LazyImage from '@/components/UI/LazyImage';
import TextEditor from '@/components/UI/TextEditor/TextEditor';
import { quizRouter } from '@/config/routes';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { BodyCreatePost } from '@/types/post.type';
import { QuizDetailRecord } from '@/types/quiz.type';
import { hasValidTextInHTML } from '@/utils';
import { faBookOpen, faEllipsisVertical, faPenAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown, Form, Modal, Spin } from 'antd';
import dayjs from 'dayjs';
import HTMLReactParser from 'html-react-parser/lib/index';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ModalChooseQuiz from './ModalChooseQuiz';
import ModalUpdateClassroom from './ModalUpdateClassroom';
import { fetchClassroomDetail } from '@/redux/slices/classrooms.slice';
import UploadPostOrExam from './UploadPostOrExam';

const TabNewFeeds = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { classroomDetail, isLoadingDetail } = useAppSelector((state) => state.classroom);
    const { userProfile } = useAppSelector((state) => state.user);

    // const { classroom, setClassroom, name, setName, subject, setSubject, thumb, setThumb } =
    //     useContext(ClassroomContext);
    const [isShowModalConfirmDelete, setIsShowModalConfirmDelete] = useState(false);

    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
    const [currentId, setCurrentId] = useState('');
    //region form

    //mutation
    const deletePostMutation = useMutationHooks((id: string) => deletePostById(id));

    //handle delete post by id
    useEffect(() => {
        if (deletePostMutation.isError) {
            toast.error('Có lỗi xảy ra');
            setIsShowModalConfirmDelete(false);
            deletePostMutation.reset();
        } else if (deletePostMutation.isSuccess) {
            dispatch(fetchClassroomDetail(classroomDetail?.classCode!));

            router.refresh();
        }
    }, [deletePostMutation.isError, deletePostMutation.isSuccess]);

    const handleOpenModal = (id: string) => {
        setIsShowModalConfirmDelete(true);
        setCurrentId(id);
    };
    const handleDeletePost = () => {
        if (!currentId) return toast.error('Lỗi');
        deletePostMutation.mutate(currentId);
        setIsShowModalConfirmDelete(false);
    };
    return (
        <>
            <Spin spinning={isLoadingDetail || deletePostMutation.isPending}>
                <div className="w-full">
                    <div className="md:rounded-[32px] overflow-hidden w-full h-64 relative group shadow-2xl shadow-slate-200/50">
                        {/* 1. Image Layer với Overlay Gradient */}
                        <div className="absolute inset-0 z-0">
                            <LazyImage
                                src={classroomDetail?.thumb}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Class Thumb"
                            />
                            {/* Lớp phủ gradient để text trắng luôn nổi bật */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>

                        {/* 2. Content Layer */}
                        <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                            <div className="flex flex-col gap-2">
                                {/* Tag nhỏ phía trên tên lớp */}

                                <h3 className="text-4xl md:text-5xl font-black text-white tracking-normal line-clamp-1 leading-20 drop-shadow-md">
                                    {classroomDetail?.name}
                                </h3>

                                <p className="text-white/70 text-sm font-medium flex items-center gap-2">
                                    <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 uppercase tracking-wider">
                                        Mã lớp: {classroomDetail?.classCode}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* 3. Action Layer (Dropdown) */}
                        <div className="absolute top-6 right-6 z-20">
                            <Dropdown
                                trigger={['click']}
                                placement="bottomRight"
                                overlay={
                                    <div className="flex flex-col min-w-[160px] p-1.5 shadow-2xl bg-white rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <button
                                            onClick={() => setIsOpenModalEdit(true)}
                                            className="flex items-center gap-3 w-full py-2.5 px-4 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-xl transition-all duration-200 font-bold text-sm"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <FontAwesomeIcon icon={faPenAlt} />
                                            </div>
                                            Chỉnh sửa
                                        </button>
                                        {/* Bạn có thể thêm nút "Xóa" hoặc "Chia sẻ" ở đây */}
                                    </div>
                                }
                            >
                                <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-camdat transition-all duration-300 shadow-lg">
                                    <FontAwesomeIcon icon={faEllipsisVertical} className="text-xl" />
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5">
                        <UploadPostOrExam />
                    </div>
                    <div className="mt-6 space-y-5">
                        {classroomDetail?.posts && classroomDetail?.posts?.length > 0 && (
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl">📢</span>
                                <h2 className="text-2xl font-bold text-gray-800">Bài đăng</h2>
                            </div>
                        )}

                        {classroomDetail?.posts?.map((post: any, index: number) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start p-5 border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <div className="flex items-center gap-3">
                                        {post?.createdBy?.avatar && (
                                            <div className="relative">
                                                <img
                                                    className="w-14 h-14 rounded-full border-3 border-white shadow-md object-cover"
                                                    src={post?.createdBy?.avatar}
                                                    alt="avatar"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <p className="text-base font-bold text-gray-800">
                                                {post?.createdBy?.name || post?.createdBy?.email}
                                            </p>
                                            <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                                                <span>🕒</span>
                                                <span>
                                                    {post?.createdAt &&
                                                        dayjs(post?.createdAt).format('DD/MM/YYYY - HH:mm')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {post?.createdBy?.email === userProfile?.email && (
                                        <Dropdown
                                            overlay={
                                                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 min-w-[140px]">
                                                    <button
                                                        onClick={() => handleOpenModal(post._id)}
                                                        className="w-full py-3 px-4 text-red-600 hover:bg-red-50 transition-all flex items-center gap-2 font-medium"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                        <span>Xóa bài đăng</span>
                                                    </button>
                                                </div>
                                            }
                                            trigger={['click']}
                                            placement="bottomRight"
                                        >
                                            <button className="p-2 hover:bg-white/50 rounded-lg transition-all">
                                                <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                    className="text-xl text-gray-600 hover:text-gray-800"
                                                />
                                            </button>
                                        </Dropdown>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 text-gray-700 leading-relaxed">
                                    {HTMLReactParser(post?.content || '')}
                                </div>

                                {/* Quizzes Section */}
                                {post?.quizzes && post?.quizzes?.length > 0 && (
                                    <div className="p-5 pt-0">
                                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-100">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-2xl">📚</span>
                                                <p className="text-lg font-bold text-amber-700">Đề thi đính kèm</p>
                                                <span className="ml-auto bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                    {post?.quizzes?.length} đề
                                                </span>
                                            </div>

                                            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                                {post?.quizzes?.map((quiz: QuizDetailRecord, index: number) => (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            router.push(`${quizRouter.REVIEW_QUIZ}/${quiz.slug}`)
                                                        }
                                                        className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-primary"
                                                    >
                                                        <div className="relative overflow-hidden">
                                                            <LazyImage
                                                                src={quiz.thumb}
                                                                className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        </div>
                                                        <div className="p-3">
                                                            <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primabg-primary transition-colors">
                                                                {quiz.name}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Spin>
            <Modal
                open={isShowModalConfirmDelete}
                onCancel={() => setIsShowModalConfirmDelete(false)}
                onOk={() => handleDeletePost()}
                confirmLoading={deletePostMutation.isPending}
                title="Xóa thông báo lớp học"
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
            >
                Bạn có chắc về quết định này?
            </Modal>
            <ModalUpdateClassroom isOpen={isOpenModalEdit} onClose={() => setIsOpenModalEdit(false)} />
        </>
    );
};

export default TabNewFeeds;
