import { createPost } from "@/api/posts.service";
import QuizCard from "@/components/Quiz/QuizCard/QuizCard";
import TextEditor from "@/components/UI/TextEditor/TextEditor";
import useMutationHooks from "@/hooks/useMutationHooks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchClassroomDetail } from "@/redux/slices/classrooms.slice";
import { BodyCreateClassExam } from "@/@types/classExam.type";
import { BodyCreatePost } from "@/@types/post.type";
import { hasValidTextInHTML } from "@/utils";
import { faBookOpen, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ModalChooseQuiz from "./ModalChooseQuiz";
const UploadPost = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpenQuizzes, setIsOpenQuizzes] = useState(false);
  const [formCreateExam] = Form.useForm<BodyCreateClassExam>();
  const watchCreateForm = Form.useWatch([], formCreateExam);
  const [formCreatePost] = Form.useForm<BodyCreatePost>();
  const { listMyQuiz } = useAppSelector((state) => state.quiz);
  const { classroomDetail, isLoadingDetail } = useAppSelector(
    (state) => state.classroom
  );
  const quizzWatch = Form.useWatch(["quizzes"], formCreatePost);
  const uploadPostMutation = useMutationHooks((data: BodyCreatePost) =>
    createPost(data)
  );
  const uploadPost = (formValue: BodyCreatePost) => {
    if (!hasValidTextInHTML(formValue.content))
      return toast.warning("Vui lòng nhập nội dung thông báo cho lớp học");
    if (!classroomDetail?._id) return toast.error("Lỗi");
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
      toast.success("Thêm thông báo lớp học thành công");
      router.refresh();
    }
  }, [uploadPostMutation.isError, uploadPostMutation.isSuccess]);
  return (
    <Spin spinning={uploadPostMutation.isPending}>
      <div className="glass-card p-6 shadow-sm border border-white/50">
        <Form
          form={formCreatePost}
          onFinish={uploadPost}
          initialValues={{ quizzes: [] }}
        >
          <Form.Item<BodyCreatePost> name="quizzes" hidden />

          {/* Text Editor với khung mềm mại */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-white/50">
            <Form.Item<BodyCreatePost>
              name="content"
              className="mb-0"
              rules={[
                {
                  validator: (_, value) => {
                    if (!hasValidTextInHTML(value)) {
                      return Promise.reject(
                        new Error("Vui lòng nhập nội dung thông báo")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <TextEditor />
            </Form.Item>
          </div>
        </Form>

        {/* Phần hiển thị Quiz đã chọn - Glassmorphism style */}
        {quizzWatch?.length > 0 && (
          <div className="mt-6 p-5 rounded-2xl bg-white/30 backdrop-blur-md border border-white/60 shadow-sm">
            <p className="text-sm font-bold text-slate-600 mb-4 flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 rounded-lg text-blue-500">
                <FontAwesomeIcon icon={faBookOpen} size="sm" />
              </span>
              Đề thi đã chọn ({quizzWatch.length})
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {quizzWatch?.map((itemWatch) => {
                const quiz = listMyQuiz.find((item) => item._id === itemWatch);
                if (quiz)
                  return (
                    <div
                      key={quiz._id}
                      className="transition-transform hover:scale-[1.02]"
                    >
                      <QuizCard
                        quizDetail={quiz}
                        allowEdit={false}
                        showButton={false}
                      />
                    </div>
                  );
                return null;
              })}
            </div>
          </div>
        )}

        {/* Nhóm nút bấm phong cách Soft UI */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={() => setIsOpenQuizzes(!isOpenQuizzes)}
            className="soft-button flex items-center gap-2 px-6 py-2.5 text-blue-600 font-semibold hover:bg-blue-50 transition-all active:scale-95"
          >
            <FontAwesomeIcon icon={faBookOpen} />
            <span>Thêm đề thi</span>
          </button>

          <button
            type="button"
            onClick={formCreatePost.submit}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            Đăng bài
          </button>
        </div>
      </div>

      <ModalChooseQuiz<BodyCreatePost>
        isOpen={isOpenQuizzes}
        onClose={() => setIsOpenQuizzes(false)}
        form={formCreatePost}
        fieldName="quizzes"
      />
    </Spin>
  );
};

export default UploadPost;
