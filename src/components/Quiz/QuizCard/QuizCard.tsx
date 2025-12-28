'use client';
import { reactjxColors } from '@/common/constants';
import LazyImage from '@/components/UI/LazyImage';
import {
    faBookOpenReader,
    faCalendar,
    faChartSimple,
    faCircleQuestion,
    faEdit,
    faEye,
    faPlayCircle,
    faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, memo, useEffect, useMemo } from 'react';
import { ScaleLoader } from 'react-spinners';
// import { Link, useNavigate } from 'react-router-dom';
import * as UserService from '@/api/user.service';
import * as QuizService from '@/api/quiz.service';
import { quizRouter, userDashboardRouter } from '@/config/routes';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { favoriteQuiz } from '@/redux/slices/user.slice';
import { QuizDetailRecord } from '@/types/quiz.type';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { Popconfirm, Popover } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { fetchMyListQuiz } from '@/redux/slices/quiz.slice';
type QuizCardProps = {
    quizDetail: QuizDetailRecord;
    allowEdit?: boolean;
    showButton?: boolean;
};
const QuizCard = ({ quizDetail, allowEdit = false, showButton = true }: QuizCardProps) => {
    // nếu onDelete truyền vào là false thì không cho xóa nếu là hàm thì cho xóa
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { userProfile } = useAppSelector((state) => state.user);
    const favoriteMutation = useMutationHooks((data: { id: string }) => UserService.favoriteQuiz(data));
    const deleteMutation = useMutationHooks((id: string) => QuizService.deleteQuiz(id));
    const handleFavoriteQuiz = (id: string, slug: string) => {
        if (!id) return;
        favoriteMutation.mutate({ id });
        dispatch(favoriteQuiz({ slug }));
    };
    useEffect(() => {
        if (favoriteMutation.isSuccess) {
            favoriteMutation.reset();
        }
        if (deleteMutation.isSuccess) {
            toast.success('Xóa đề thi thành công');
            deleteMutation.reset();
            dispatch(fetchMyListQuiz());
        }
    }, [favoriteMutation.isSuccess, deleteMutation.isSuccess]);
    const isFavorite = useMemo(
        () => userProfile?.favoriteQuiz.some((quiz) => quiz?.slug === quizDetail?.slug),
        [quizDetail?.slug, userProfile?.favoriteQuiz],
    );
    const handleDelete = () => {
        deleteMutation.mutate(quizDetail?._id);
    };
    return (
        <Fragment>
            {quizDetail && (
                <div className="shrink-0 max-w-80 transition-all duration-300 shadow-lg rounded hover:shadow-2xl border-2">
                    <div
                        // onClick={() => router.push(`${quizRouter.REVIEW_QUIZ}/${quizDetail?.slug}`)}
                        className="w-full h-52 flex justify-center content-center hover:cursor-pointer"
                    >
                        <LazyImage src={quizDetail?.thumb} alt={quizDetail?.name} />
                    </div>
                    <div className="px-2 py-3">
                        <p className="font-bold text-base line-clamp-2">{quizDetail?.name}</p>
                        {quizDetail?.createdAt && (
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon className="text-orange-900" icon={faCalendar} />
                                <p className="text-gray-700">{dayjs(quizDetail?.createdAt).format('DD/MM/YYYY')}</p>
                            </div>
                        )}
                        <div className="mt-2">
                            <div className="text-base flex gap-3">
                                <Popover trigger={'hover'} content={'Câu hỏi'}>
                                    <FontAwesomeIcon icon={faCircleQuestion} className="mr-1 text-yellow-500" />
                                    <span className="text-gray-700">{quizDetail?.questionCount || 0}</span>
                                </Popover>
                                <Popover trigger={'hover'} content={'Lượt truy cập'}>
                                    <FontAwesomeIcon icon={faChartSimple} className="mr-1 text-blue-500" />
                                    <span className="text-gray-700">{quizDetail?.accessCount || 0}</span>
                                </Popover>
                                <Popover trigger={'hover'} content={'Số lượt thi'}>
                                    <FontAwesomeIcon icon={faBookOpenReader} className="mr-1 text-green-500" />
                                    <span className="text-gray-700">{quizDetail?.examCount || 0}</span>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    {allowEdit && (
                        <div className="px-2 py-2 border-t-2">
                            <div className="mt-2">
                                <div className="text-base flex gap-3">
                                    <>
                                        <Popover
                                            trigger={'hover'}
                                            content={'Xem chi tiết'}
                                            className="hover:cursor-pointer"
                                        >
                                            <button
                                                onClick={() =>
                                                    router.push(`${userDashboardRouter.MYQUIZ}/${quizDetail?._id}`)
                                                }
                                            >
                                                <FontAwesomeIcon icon={faEye} className="pr-1 text-[#f27735]" />
                                            </button>
                                        </Popover>
                                        <Popover
                                            trigger={'hover'}
                                            content={'Chỉnh sửa đề thi'}
                                            className="hover:cursor-pointer"
                                        >
                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `${userDashboardRouter.MYQUIZ}/chinh-sua/${quizDetail?._id}`,
                                                    )
                                                }
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="pr-1 text-[#851e3f]" />
                                            </button>
                                        </Popover>
                                        <Popconfirm
                                            title="Xác nhận xoá đề thi"
                                            okText="Xoá"
                                            cancelText="Hủy bỏ"
                                            showCancel={false}
                                            okType="danger"
                                            onConfirm={handleDelete}
                                        >
                                            <Popover
                                                trigger={'hover'}
                                                content={'Xóa đề thi'}
                                                className="hover:cursor-pointer"
                                            >
                                                <button>
                                                    <FontAwesomeIcon icon={faTrashCan} className="pr-1 text-red-500" />
                                                </button>
                                            </Popover>
                                        </Popconfirm>
                                    </>
                                </div>
                            </div>
                        </div>
                    )}
                    {showButton && (
                        <div className="px-3 py-3 border-t-2 flex justify-between">
                            <Link
                                href={`${quizRouter.REVIEW_QUIZ}/${quizDetail?.slug}`}
                                className="inline-block rounded border hover:text-white hover:opacity-80 ease-linear transition-all duration-200 text-white bg-gradient-to-r from-primary to-[#1e998c] px-2 py-2"
                            >
                                <FontAwesomeIcon icon={faPlayCircle} className="pr-1" />
                                Vào ôn thi
                            </Link>
                            <button
                                onClick={() => handleFavoriteQuiz(quizDetail?._id, quizDetail?.slug)}
                                className="hover:cursor-pointer"
                            >
                                <FontAwesomeIcon
                                    className="text-red-500 text-2xl"
                                    icon={isFavorite ? faHeartSolid : faHeartRegular}
                                />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Fragment>
    );
};
// dùng memo tránh rerender lại => khi props thay đổi thì mới rerender
export default memo(QuizCard);
