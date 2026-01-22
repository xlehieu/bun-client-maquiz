'use client';
import { deletePostById } from '@/api/posts.service';
import LazyImage from '@/components/UI/LazyImage';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchClassroomDetail } from '@/redux/slices/classrooms.slice';
import { faEllipsisVertical, faPenAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Modal, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ClassExamCard from '../../classExam/components/ClassExamCard';
import ClassPostCard from '../../posts/components/ClassPostCard';
import ModalUpdateClassroom from './ModalUpdateClassroom';
import UploadPostOrExam from './UploadPostOrExam';

const TabNewFeeds = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { classroomDetail, isLoadingDetail } = useAppSelector((state) => state.classroom);
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
            setIsShowModalConfirmDelete(false);
            deletePostMutation.reset();
        } else if (deletePostMutation.isSuccess) {
            dispatch(fetchClassroomDetail(classroomDetail?.classCode!));

            router.refresh();
        }
    }, [deletePostMutation.isError, deletePostMutation.isSuccess]);

    const handleOpenModalConfirmDelete = (id: string) => {
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
                                <h2 className="text-2xl font-bold text-gray-800">Bài thi và bài đăng</h2>
                            </div>
                        )}

                        {classroomDetail?.examAndPostList?.map((postOrExam, index: number) => (
                            <div key={postOrExam._id}>
                                {postOrExam.type == 'post' ? (
                                    <ClassPostCard handleOpenModal={handleOpenModalConfirmDelete} post={postOrExam} />
                                ) : (
                                    <ClassExamCard
                                        exam={postOrExam}
                                        score={
                                            classroomDetail.examAttempt.find(
                                                (item) => item.classExamId === postOrExam._id,
                                            )?.score
                                        }
                                    />
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
