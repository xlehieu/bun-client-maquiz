'use client';
import { createPost, deletePostById } from '@/api/posts.service';
import QuizCard from '@/components/Quiz/QuizCard/QuizCard';
import LazyImage from '@/components/UI/LazyImage';
import TextEditor from '@/components/UI/TextEditor/TextEditor';
import { quizRouter } from '@/config/routes';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { BodyCreatePost } from '@/types/posr.type';
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

const TabNewFeeds = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { classroomDetail, isLoadingDetail } = useAppSelector((state) => state.classroom);
    const { userProfile } = useAppSelector((state) => state.user);
    const { listMyQuiz } = useAppSelector((state) => state.quiz);
    // const { classroom, setClassroom, name, setName, subject, setSubject, thumb, setThumb } =
    //     useContext(ClassroomContext);
    const [isShowModalConfirmDelete, setIsShowModalConfirmDelete] = useState(false);
    const [isOpenQuizzes, setIsOpenQuizzes] = useState(false);
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
    const [currentId, setCurrentId] = useState('');
    //region form
    const [formCreatePost] = Form.useForm<BodyCreatePost>();
    const quizzWatch = Form.useWatch(['quizzes'], formCreatePost);
    //mutation
    const deletePostMutation = useMutationHooks((id: string) => deletePostById(id));
    const uploadPostMutation = useMutationHooks((data: BodyCreatePost) => createPost(data));
    const uploadPost = (formValue: BodyCreatePost) => {
        if (!hasValidTextInHTML(formValue.content))
            return toast.warning('Vui lòng nhập nội dung thông báo cho lớp học');
        if (!classroomDetail?._id) return toast.error('Lỗi');
        uploadPostMutation.mutate({
            classroomId: classroomDetail?._id,
            content: formValue.content,
            quizzes: formValue.quizzes,
        });
    };
    useEffect(() => {
        if (uploadPostMutation.isError) {
            toast.error((uploadPostMutation.error as any).message);
        } else if (uploadPostMutation.isSuccess) {
            dispatch(fetchClassroomDetail(classroomDetail?.classCode!));
            formCreatePost.resetFields();
            uploadPostMutation.reset();
            toast.success('Thêm thông báo lớp học thành công');
            router.refresh();
        }
    }, [uploadPostMutation.isError, uploadPostMutation.isSuccess]);

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
            <Spin spinning={isLoadingDetail || deletePostMutation.isPending || uploadPostMutation.isPending}>
                <div className="w-full">
                    <div className="md:rounded-2xl md:overflow-hidden w-full h-56 relative">
                        <LazyImage
                            src={classroomDetail?.thumb}
                            className="w-full h-full object-cover opacity-60"
                            alt="Class Thumb"
                        />
                        <h3 className="absolute bottom-4 left-4 text-4xl font-medium text-gray-900 line-clamp-1">
                            {classroomDetail?.name}
                        </h3>
                        <div className="absolute top-4 right-4">
                            <Dropdown
                                overlay={
                                    <div
                                        className="flex flex-col text-sm shadow-md bg-white w-28 rounded-sm overflow-hidden"
                                        tabIndex={-1}
                                    >
                                        <button
                                            onClick={() => setIsOpenModalEdit(true)}
                                            className="py-1 px-2 text-primary bg-white hover:opacity-80 transition-all"
                                        >
                                            <FontAwesomeIcon className="mr-1" icon={faPenAlt} />
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                }
                            >
                                <button className="mr-3 px-2 py-2">
                                    <FontAwesomeIcon icon={faEllipsisVertical} className="text-2xl text-camdat" />
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5">
                        <Form
                            form={formCreatePost}
                            onFinish={uploadPost}
                            initialValues={{
                                quizzes: [],
                            }}
                        >
                            {/* <JoditEditor
                                config={{ ...configEditor, minHeight: 150, placeholder: 'Thông báo cho lớp học' }}
                                value={notificationText}
                                onBlur={(text) => setNotificationText(text)} // preferred to use only this option to update the content for performance reasons
                                //onChange={setQuestionContent}
                            /> */}
                            <Form.Item<BodyCreatePost> name="quizzes" hidden />
                            <Form.Item<BodyCreatePost>
                                name="content"
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            // console.log('HELLO', value);
                                            if (!hasValidTextInHTML(value)) {
                                                return Promise.reject(new Error('Vui lòng nhập nội dung thông báo'));
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <TextEditor />
                            </Form.Item>
                        </Form>
                        {quizzWatch?.length > 0 && (
                            <div>
                                <p className="text-camdat mb-2">Đề thi đã chọn:</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
                                    {quizzWatch?.map((item) => {
                                        const quiz = listMyQuiz.find((item) => item._id === item._id);
                                        if (quiz)
                                            return (
                                                <QuizCard
                                                    quizDetail={quiz}
                                                    key={quiz._id}
                                                    allowEdit={false}
                                                    showButton={false}
                                                />
                                            );
                                        return null;
                                    })}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-5">
                            <Button
                                type="primary"
                                className="text-2xl md:text-base bg-primary text-white rounded px-3 py-1 hover:cursor-pointer"
                                onClick={() => setIsOpenQuizzes(!isOpenQuizzes)}
                            >
                                <FontAwesomeIcon className="mr-1" icon={faBookOpen} />
                                Thêm đề thi
                            </Button>
                            <Button
                                type="primary"
                                onClick={formCreatePost.submit}
                                className="text-2xl md:text-base bg-primary text-white rounded px-3 py-1 hover:cursor-pointer"
                            >
                                Đăng
                            </Button>
                        </div>
                    </div>
                    <div className="mt-5 gap-5 flex flex-col">
                        {classroomDetail?.posts && classroomDetail?.posts?.length > 0 && (
                            <p className="font-semibold">Bài đăng</p>
                        )}
                        {classroomDetail?.posts?.map((post: any, index: number) => (
                            <div key={index} className="w-full border border-primary rounded px-3 py-3">
                                <div className="flex justify-between border-b-2 border-gray-300 pb-2">
                                    <div className="flex items-center">
                                        {post?.createdBy?.avatar && (
                                            <img
                                                className="w-12 h-12 border-2 rounded-full mr-2"
                                                src={post?.createdBy?.avatar}
                                                alt="avatar"
                                            />
                                        )}
                                        <div className="flex flex-col justify-center">
                                            <p className="text-md font-semibold text-gray-600">
                                                {post?.createdBy?.name || post?.createdBy?.email}
                                            </p>
                                            <span className="text-gray-400 text-xs">
                                                {post?.createdAt && dayjs(post?.createdAt).format('DD/MM/YYYY')}
                                            </span>
                                        </div>
                                    </div>
                                    {post?.createdBy?.email === userProfile?.email && (
                                        <div>
                                            <Dropdown
                                                overlay={
                                                    <div
                                                        className="flex flex-col shadow-md bg-white w-28 rounded-md overflow-hidden"
                                                        tabIndex={-1}
                                                    >
                                                        <button
                                                            onClick={() => handleOpenModal(post._id)}
                                                            className="py-1 px-2 text-red-500 hover:opacity-80 transition-all"
                                                        >
                                                            <FontAwesomeIcon className="mr-1" icon={faTrash} />
                                                            Xóa
                                                        </button>
                                                    </div>
                                                }
                                            >
                                                <button className="mr-3 px-2 py-2 hover:cursor-pointer">
                                                    <FontAwesomeIcon
                                                        icon={faEllipsisVertical}
                                                        className="text-3xl md:text-xl text-gray-700"
                                                    />
                                                </button>
                                            </Dropdown>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3">{HTMLReactParser(post?.content || '')}</div>
                                {post?.quizzes && (
                                    <div className="grid gap-2 grid-cols-2 md:grid-cols-4 xl:grid-cols-5 pt-2 border-t-2 border-gray-300">
                                        <p className="text-xl text-emerald-900 col-span-2 md:col-span-4 xl:col-span-5">
                                            Đề thi:
                                        </p>
                                        {post?.quizzes?.map((quiz: QuizDetailRecord, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => router.push(`${quizRouter.REVIEW_QUIZ}/${quiz.slug}`)}
                                                className="rounded border pb-2 shadow hover:shadow-lg"
                                            >
                                                <LazyImage src={quiz.thumb} />
                                                {quiz.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <ModalChooseQuiz
                        isOpen={isOpenQuizzes}
                        onClose={() => setIsOpenQuizzes(false)}
                        form={formCreatePost}
                    />
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
