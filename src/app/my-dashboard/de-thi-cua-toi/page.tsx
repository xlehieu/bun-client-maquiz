'use client';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import * as QuizService from '@/services/quiz.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Modal, Pagination } from 'antd';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import siteRouter from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOneQuiz, setQuiz } from '@/redux/slices/quiz.slice';
import LoadingComponent from '@/components/UI/LoadingComponent';
import useMutationHooks from '@/hooks/useMutationHooks';
import QuizCard from '@/components/Quiz/QuizCard';
import { handleCountQuestion } from '@/utils';
import { PAGE_SIZE } from '@/common/constants';
import { IQuiz } from '@/interface';
const QuizzesContext = createContext<any>({});
const QuizzesProvider = ({ children }: { children: React.ReactNode }) => {
    // cung cấp dữ liệu xuống component con
    const [quizzesData, setQuizzesData] = useState([]);
    const quizDispatch = useDispatch();
    // lấy trong redux
    const quizzesSelector = useSelector((state: any) => state.quiz);
    const handleGetQuizzes = async () => {
        if (quizzesSelector.quiz.length <= 0) {
            const quizSer = await QuizService.getQuizzes({});
            setQuizzesData(quizSer.quizzes);
            quizDispatch(setQuiz(quizSer.quizzes));
            return quizSer;
        } else {
            if (!(quizzesSelector.quiz === quizzesData)) {
                setQuizzesData(quizzesSelector.quiz);
            }
            return quizzesSelector;
        }
    };
    const quizQuery = useQuery({ queryKey: [''], queryFn: () => handleGetQuizzes() });
    return (
        <QuizzesContext.Provider value={{ quizzesData, setQuizzesData, isLoading: quizQuery.isLoading }}>
            {children}
        </QuizzesContext.Provider>
    );
};

const MyQuizPageMain = () => {
    const { quizzesData, setQuizzesData, isLoading } = useContext(QuizzesContext);
    const router = useRouter();
    const [isShowModal, setIsShowModal] = useState(false);
    const [deleteQuizId, setDeleteQuizId] = useState('');
    const dispatch = useDispatch();
    const deleteQuizMutation = useMutationHooks((data: any) => QuizService.deleteQuiz(data));
    //Hiển thị modal và set id quiz muốn xóa
    const handleDeleteQuizModal = (id: string) => {
        setIsShowModal(true);
        setDeleteQuizId(id);
    };
    //Hàm xử lý đóng modal
    const handleCancelDeleteQuiz = useCallback(() => {
        setIsShowModal(false);
        setDeleteQuizId('');
    }, []);
    // Hàm xử lý xóa quiz
    const handleOkDeleteQuiz = useCallback(() => {
        if (deleteQuizId) {
            deleteQuizMutation.mutate({ id: deleteQuizId });
        }
    }, [deleteQuizId]);
    const getQuizzesMutation = useMutationHooks((data: { skip?: number; limit?: number }) =>
        QuizService.getQuizzes(data),
    );
    const handleGetQuizzes = (skip: number) => {
        if (!isNaN(Number(skip))) {
            getQuizzesMutation.mutate({ skip });
        }
    };
    // Khi xóa lỗi hoặc xóa thành công bằng mutation
    useEffect(() => {
        if (deleteQuizMutation.isSuccess && deleteQuizMutation.data) {
            const { id } = deleteQuizMutation.data;
            if (id) {
                dispatch(deleteOneQuiz({ id }));
                setQuizzesData((prevQuizzes: any[]) => {
                    prevQuizzes = [...prevQuizzes];
                    return prevQuizzes.filter((q) => q._id !== id);
                });
                handleCancelDeleteQuiz();
                toast.success('Xóa bài trắc nghiệm thành công');
            } else {
                toast.error('Xóa bài trắc nghiệm thất bại, vui lòng thử lại');
            }
        } else if (deleteQuizMutation.isError) {
            toast.error('Xóa bài trắc nghiệm thất bại, vui lòng thử lại');
        }
    }, [deleteQuizMutation.isError, deleteQuizMutation.isSuccess]);
    useEffect(() => {
        document.title = 'Đề thi của tôi';
        if (getQuizzesMutation.isSuccess) {
            setQuizzesData(getQuizzesMutation.data);
        } else if (getQuizzesMutation) {
        }
    }, [getQuizzesMutation.isSuccess]);
    useLayoutEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);
    return (
        <>
            <div className="flex justify-between my-5">
                <h4 className="font-semibold text-gray-500">Danh sách đề thi</h4>
            </div>
            <section className="rounded-xl bg-white px-8 py-8 flex gap-10 flex-wrap shadow">
                <>
                    {isLoading || getQuizzesMutation.isPending ? (
                        <LoadingComponent />
                    ) : (
                        <>
                            <div className="w-full border-b-2 px-9 py-1 flex justify-between">
                                <p className="font-semibold text-xl">
                                    <span className="text-primary mr-2">{quizzesData?.length || 0}</span>
                                    <span className="text-slate-600">Đề thi</span>
                                </p>
                                <button
                                    onClick={() => router.push(siteRouter.createQuiz)}
                                    className="px-2 py-1 text-primary font-semibold rounded border-primary border-2 hover:text-primary hover:opacity-55 transition-all duration-200"
                                >
                                    <FontAwesomeIcon icon={faPlusSquare} className="mr-1" />
                                    Tạo đề thi
                                </button>
                            </div>
                            <div className="grid w-full h-full grid-cols-2 gap-4 px-0 pb-4 sm:grid-cols-3 md:grid-cols-4  2xl:grid-cols-5">
                                {quizzesData.length > 0
                                    ? quizzesData.map((quiz: IQuiz, index: number) => (
                                          <QuizCard
                                              key={index}
                                              name={quiz.name}
                                              accessCount={quiz.accessCount}
                                              examCount={quiz.examCount}
                                              questionCount={quiz?.questionCount || handleCountQuestion(quiz.quiz)}
                                              imageSrc={quiz.thumb}
                                              id={quiz._id}
                                              slug={quiz.slug}
                                              onDelete={() => handleDeleteQuizModal(quiz._id as string)}
                                          />
                                      ))
                                    : 'Không thấy đề thi nào 😟😟😟😟'}
                            </div>
                        </>
                    )}
                </>
                <Pagination
                    className="justify-end"
                    onChange={(e) => handleGetQuizzes(e)}
                    defaultCurrent={1}
                    defaultPageSize={PAGE_SIZE}
                    total={quizzesData?.length || 0}
                />
            </section>
            <Modal
                title="Xác nhận xóa"
                cancelText="Hủy"
                okText="Xóa"
                okType="danger"
                open={isShowModal}
                onCancel={handleCancelDeleteQuiz}
                confirmLoading={deleteQuizMutation.isPending}
                onOk={handleOkDeleteQuiz}
            >
                <p>Bạn có muốn xóa bài trắc nghiệm này?</p>
            </Modal>
        </>
    );
};
const MyQuizPage = () => {
    return (
        <QuizzesProvider>
            <MyQuizPageMain />
        </QuizzesProvider>
    );
};
export default MyQuizPage;
