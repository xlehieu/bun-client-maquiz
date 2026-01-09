"use client";
import { reactjxColors } from "@/common/constants";
import LazyImage from "@/components/UI/LazyImage";
import {
  faBookOpenReader,
  faCalendarAlt,
  faChartLine,
  faCircleQuestion,
  faEdit,
  faEye,
  faPlay,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, memo, useEffect, useMemo } from "react";
import * as UserService from "@/api/user.service";
import * as QuizService from "@/api/quiz.service";
import { quizRouter, USER_DASHBOARD_ROUTER } from "@/config/routes";
import useMutationHooks from "@/hooks/useMutationHooks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { favoriteQuiz } from "@/redux/slices/user.slice";
import { QuizDetailRecord } from "@/@types/quiz.type";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { Popconfirm, Popover } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchMyListQuiz } from "@/redux/slices/quiz.slice";

type QuizCardProps = {
  quizDetail: QuizDetailRecord;
  allowEdit?: boolean;
  showButton?: boolean;
};

const QuizCard = ({
  quizDetail,
  allowEdit = false,
  showButton = true,
}: QuizCardProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector((state) => state.user);

  const favoriteMutation = useMutationHooks((data: { id: string }) =>
    UserService.favoriteQuiz(data)
  );
  const deleteMutation = useMutationHooks((id: string) =>
    QuizService.deleteQuiz(id)
  );

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
      toast.success("Xóa đề thi thành công");
      deleteMutation.reset();
      dispatch(fetchMyListQuiz());
    }
  }, [favoriteMutation.isSuccess, deleteMutation.isSuccess]);

  const isFavorite = useMemo(
    () =>
      userProfile?.favoriteQuiz.some((quiz) => quiz?.slug === quizDetail?.slug),
    [quizDetail?.slug, userProfile?.favoriteQuiz]
  );

  const handleDelete = () => {
    deleteMutation.mutate(quizDetail?._id);
  };

  return (
    <Fragment>
      {quizDetail && (
        <div className="group relative flex flex-col w-full max-w-[320px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
            <div className="w-full h-full transition-transform duration-500 group-hover:scale-110">
              <LazyImage src={quizDetail?.thumb} alt={quizDetail?.name} />
            </div>
            {/* Overlay Badge Date */}
            {quizDetail?.createdAt && (
              <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[11px] font-semibold text-gray-600 shadow-sm">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="mr-1 text-primary"
                />
                {dayjs(quizDetail?.createdAt).format("DD/MM/YYYY")}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-col flex-grow  pt-2 px-2">
            <h3 className="text-gray-800 font-bold text-lg leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
              {quizDetail?.name}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-auto pb-2 px-1">
            <Popover content="Câu hỏi">
              <div className="flex items-center text-sm font-medium text-gray-500 bg-amber-50 px-2 py-1 rounded-md">
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  className="mr-1.5 text-amber-500"
                />
                {quizDetail?.questionCount || 0}
              </div>
            </Popover>
            <Popover content="Lượt truy cập">
              <div className="flex items-center text-sm font-medium text-gray-500 bg-blue-50 px-2 py-1 rounded-md">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="mr-1.5 text-blue-500"
                />
                {quizDetail?.accessCount || 0}
              </div>
            </Popover>
            <Popover content="Lượt thi">
              <div className="flex items-center text-sm font-medium text-gray-500 bg-emerald-50 px-2 py-1 rounded-md">
                <FontAwesomeIcon
                  icon={faBookOpenReader}
                  className="mr-1.5 text-emerald-500"
                />
                {quizDetail?.examCount || 0}
              </div>
            </Popover>
          </div>

          {allowEdit && (
            <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100 flex gap-4">
              <button
                onClick={() =>
                  router.push(
                    `${USER_DASHBOARD_ROUTER.MYQUIZ}/${quizDetail?._id}`
                  )
                }
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button
                onClick={() =>
                  router.push(
                    `${USER_DASHBOARD_ROUTER.MYQUIZ}/chinh-sua/${quizDetail?._id}`
                  )
                }
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <Popconfirm
                title="Xác nhận xoá đề thi?"
                onConfirm={handleDelete}
                okText="Xoá"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </Popconfirm>
            </div>
          )}

          {/* Footer Actions */}
          {showButton && (
            <div className="p-4 pt-2 flex items-center justify-between border-t border-gray-100">
              <Link
                href={`${quizRouter.REVIEW_QUIZ}/${quizDetail?.slug}`}
                className="flex-1 mr-4 py-2.5 px-4 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl text-sm font-bold text-center shadow-md shadow-emerald-200 hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
                Vào ôn thi
              </Link>

              <button
                onClick={() =>
                  handleFavoriteQuiz(quizDetail?._id, quizDetail?.slug)
                }
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isFavorite
                    ? "bg-red-50 text-red-500"
                    : "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-400"
                }`}
              >
                <FontAwesomeIcon
                  className="text-xl"
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

export default memo(QuizCard);
