"use client";
import { PAGE_SIZE } from "@/common/constants";
import QuizCard from "@/components/Quiz/QuizCard/QuizCard";
import siteRouter from "@/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchMyListQuiz } from "@/redux/slices/quiz.slice";
import { QuizDetailRecord } from "@/types/quiz.type";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination, Spin } from "antd";
import { useRouter } from "next/navigation";
import { createContext, useLayoutEffect } from "react";
const QuizzesContext = createContext<any>({});

const MyQuizPageMain = () => {
  const router = useRouter();
  const { listMyQuiz, isFetching, pagination } = useAppSelector(
    (state) => state.quiz
  );
  const dispatch = useAppDispatch();
  //   const deleteQuizMutation = useMutationHooks((data: any) =>
  //     QuizService.deleteQuiz(data)
  //   );
  //Hiển thị modal và set id quiz muốn xóa
  //   const handleDeleteQuizModal = (id: string) => {
  //     setIsShowModal(true);
  //     setDeleteQuizId(id);
  //   };
  //Hàm xử lý đóng modal
  //   const handleCancelDeleteQuiz = useCallback(() => {
  //     setIsShowModal(false);
  //     setDeleteQuizId("");
  //   }, []);
  // Hàm xử lý xóa quiz
  //   const handleOkDeleteQuiz = useCallback(() => {
  //     if (deleteQuizId) {
  //       deleteQuizMutation.mutate({ id: deleteQuizId });
  //     }
  //   }, [deleteQuizId]);
  //   // Khi xóa lỗi hoặc xóa thành công bằng mutation
  //   useEffect(() => {
  //     if (deleteQuizMutation.isSuccess && deleteQuizMutation.data) {
  //       const { id } = deleteQuizMutation.data;
  //       if (id) {
  //         handleCancelDeleteQuiz();
  //         toast.success("Xóa bài trắc nghiệm thành công");
  //       } else {
  //         toast.error("Xóa bài trắc nghiệm thất bại, vui lòng thử lại");
  //       }
  //     } else if (deleteQuizMutation.isError) {
  //       toast.error("Xóa bài trắc nghiệm thất bại, vui lòng thử lại");
  //     }
  //   }, [deleteQuizMutation.isError, deleteQuizMutation.isSuccess]);
  useLayoutEffect(() => {
    if (listMyQuiz.length <= 0) {
      dispatch(fetchMyListQuiz());
    }
    if (typeof window !== "undefined")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  }, []);
  const onChangePageSize = (pageNumber: number, pageSize: number) => {
    dispatch(
      fetchMyListQuiz({
        skip: (pageNumber - 1) * pageSize,
        limit: pageSize,
      })
    );
  };
  return (
    <>
      <div className="flex justify-between my-5">
        <h4 className="font-semibold text-gray-500">Danh sách đề thi</h4>
      </div>
      <section className="rounded-xl bg-white px-8 py-8 flex gap-10 flex-wrap shadow">
        <Spin spinning={isFetching}>
          <div className="w-full border-b-2 px-9 py-1 flex justify-between">
            <p className="font-semibold text-xl">
              <span className="text-primary mr-2">{pagination.total || 0}</span>
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
            {pagination.total !== 0
              ? listMyQuiz.map((quiz: QuizDetailRecord, index: number) => (
                  <QuizCard key={index} quizDetail={quiz} allowEdit />
                ))
              : "Không thấy đề thi nào 😟😟😟😟"}
          </div>
        </Spin>

        <div className="w-full flex flex-col items-end">
          <Pagination
            onChange={onChangePageSize}
            showSizeChanger
            defaultCurrent={1}
            pageSizeOptions={[8, 12, 16, 20, 40, 80, 100, pagination.total]}
            defaultPageSize={PAGE_SIZE}
            total={pagination.total || 0}
          />
        </div>
      </section>
    </>
  );
};
export default MyQuizPageMain;
