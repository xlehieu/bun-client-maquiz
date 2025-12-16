'use client';
import {
    faBookOpenReader,
    faChartSimple,
    faCircleQuestion,
    faEdit,
    faEye,
    faPlayCircle,
    faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import { colors } from '@/common/constants';
import LazyImage from '@/components/UI/LazyImage';
// import { Link, useNavigate } from 'react-router-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { quizRouter, userDashboardRouter } from '@/config';
import { Popover } from 'antd';
import dayjs from 'dayjs';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import * as UserService from '@/api/user.service';
import useMutationHooks from '@/hooks/useMutationHooks';
import { useDispatch, useSelector } from 'react-redux';
import { IQuiz } from '@/interface';
import { useAppSelector } from '@/redux/hooks';
import { favoriteQuiz } from '@/redux/slices/user.slice';
const QuizCard = ({
    name,
    slug,
    time,
    questionCount = 0,
    accessCount = 0,
    examCount = 0,
    imageSrc,
    id,
    onDelete = false,
    isFavorite = false,
}: any) => {
    // nếu onDelete truyền vào là false thì không cho xóa nếu là hàm thì cho xóa
    const router = useRouter();
    const dispatch = useDispatch();
    const {userProfile} = useAppSelector(state=>state.user)
    const favoriteMutation = useMutationHooks((data: { id: string }) => UserService.favoriteQuiz(data));
    const handleFavoriteQuiz = (id: string, slug: string) => {
        if (!id) return;
        favoriteMutation.mutate({ id });
        dispatch(favoriteQuiz({slug}));
    };
    useEffect(() => {
        if (favoriteMutation.isSuccess) {
            favoriteMutation.reset();
        }
    }, [favoriteMutation.isSuccess]);
    isFavorite = userProfile?.favoriteQuiz.some((quiz) => quiz?.slug === slug);
    return (
        <div className="shrink-0 max-w-80 transition-all duration-300 shadow-lg rounded hover:shadow-2xl border-2">
            <div
                onClick={() => router.push(`${quizRouter.reviewQuiz}/${slug}`)}
                className="w-full h-52 flex justify-center content-center hover:cursor-pointer"
            >
                <LazyImage src={imageSrc} alt={name} placeholder={<ScaleLoader color={colors.primary} />} />
            </div>
            <div className="px-2 py-3">
                <p className="font-bold text-base line-clamp-2">{name}</p>
                {time && (
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon className="text-orange-900" icon={faCircleQuestion} />
                        <p className="text-gray-700">{dayjs(time).format('DD/MM/YYYY')}</p>
                    </div>
                )}
                <div className="mt-2">
                    <div className="text-base flex gap-3">
                        <Popover trigger={'hover'} content={'Câu hỏi'}>
                            <FontAwesomeIcon icon={faCircleQuestion} className="mr-1 text-yellow-500" />
                            <span className="text-gray-700">{questionCount ?? 0}</span>
                        </Popover>
                        <Popover trigger={'hover'} content={'Lượt truy cập'}>
                            <FontAwesomeIcon icon={faChartSimple} className="mr-1 text-blue-500" />
                            <span className="text-gray-700">{accessCount ?? 0}</span>
                        </Popover>
                        <Popover trigger={'hover'} content={'Số lượt thi'}>
                            <FontAwesomeIcon icon={faBookOpenReader} className="mr-1 text-green-500" />
                            <span className="text-gray-700">{examCount ?? 0}</span>
                        </Popover>
                    </div>
                </div>
            </div>
            {onDelete && (
                <div className="px-2 py-2 border-t-2">
                    <div className="mt-2">
                        <div className="text-base flex gap-3">
                            <>
                                <Popover trigger={'hover'} content={'Xem chi tiết'} className="hover:cursor-pointer">
                                    <button onClick={() => router.push(`${userDashboardRouter.myQuiz}/${id}`)}>
                                        <FontAwesomeIcon icon={faEye} className="pr-1 text-[#f27735]" />
                                    </button>
                                </Popover>
                                <Popover
                                    trigger={'hover'}
                                    content={'Chỉnh sửa đề thi'}
                                    className="hover:cursor-pointer"
                                >
                                    <button
                                        onClick={() => router.push(`${userDashboardRouter.myQuiz}/chinh-sua/${id}`)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="pr-1 text-[#851e3f]" />
                                    </button>
                                </Popover>
                                <Popover trigger={'hover'} content={'Xóa đề thi'} className="hover:cursor-pointer">
                                    <button onClick={onDelete}>
                                        <FontAwesomeIcon icon={faTrashCan} className="pr-1 text-red-500" />
                                    </button>
                                </Popover>
                            </>
                        </div>
                    </div>
                </div>
            )}
            <div className="px-3 py-3 border-t-2 flex justify-between">
                <Link
                    href={`${quizRouter.reviewQuiz}/${slug}`}
                    className="inline-block rounded border hover:text-white hover:opacity-80 ease-linear transition-all duration-200 text-white bg-gradient-to-r from-primary to-[#1e998c] px-2 py-2"
                >
                    <FontAwesomeIcon icon={faPlayCircle} className="pr-1" />
                    Vào ôn thi
                </Link>
                <button onClick={() => handleFavoriteQuiz(id, slug)} className="hover:cursor-pointer">
                    <FontAwesomeIcon
                        className="text-red-500 text-2xl"
                        icon={isFavorite ? faHeartSolid : faHeartRegular}
                    />
                </button>
            </div>
        </div>
    );
};
// dùng memo tránh rerender lại => khi props thay đổi thì mới rerender
export default memo(QuizCard);
