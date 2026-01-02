import { createClassExam } from "@/api/classExam.service";
import useMutationHooks from "@/hooks/useMutationHooks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchClassroomDetail } from "@/redux/slices/classrooms.slice";
import { BodyCreateClassExam } from "@/@types/classExam.type";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Spin,
  TimePicker,
  Card,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ModalChooseQuiz from "./ModalChooseQuiz";
import QuizCard from "@/components/Quiz/QuizCard/QuizCard";

const UploadExam = () => {
  const dispatch = useAppDispatch();
  const [formCreateExam] = Form.useForm<BodyCreateClassExam>();
  const [isOpenQuizzes, setIsOpenQuizzes] = useState(false);
  const quizWatch = Form.useWatch(["quizId"], formCreateExam);
  const { listMyQuiz } = useAppSelector((state) => state.quiz);
  const { classroomDetail, isLoadingDetail } = useAppSelector(
    (state) => state.classroom
  );
  const uploadExamMutation = useMutationHooks((data: BodyCreateClassExam) =>
    createClassExam(data)
  );
  const uploadExam = (formValue: BodyCreateClassExam) => {
    if (!classroomDetail?._id) return toast.error("Có lỗi xảy ra");
    const body: BodyCreateClassExam = {
      ...formValue,
      duration:
        dayjs(formValue.duration).hour() * 60 +
        dayjs(formValue.duration).minute(),
    };
    body.classId = classroomDetail?._id;
    uploadExamMutation.mutate(body);
  };
  useEffect(() => {
    if (uploadExamMutation.isError) {
      toast.error((uploadExamMutation.error as any).message);
    } else if (uploadExamMutation.isSuccess) {
      dispatch(fetchClassroomDetail(classroomDetail?.classCode!));
      formCreateExam.resetFields();
      uploadExamMutation.reset();
      toast.success("Thêm bài thi kiểm tra thành công");
    }
  }, [uploadExamMutation.isError, uploadExamMutation.isSuccess]);

  return (
    <div className="max-w-5xl mx-auto">
      <Spin spinning={uploadExamMutation.isPending}>
        {/* Header Card */}
        <Card className="mb-6 shadow-lg rounded-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 -m-6 mb-6 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                📝
              </span>
              Tạo bài kiểm tra mới
            </h2>
            <p className="text-blue-100 mt-2 text-sm">
              Thiết lập thông tin và thời gian cho bài kiểm tra
            </p>
          </div>

          <Form
            layout="vertical"
            onValuesChange={(
              changeValues: Partial<BodyCreateClassExam>,
              allValues: Partial<BodyCreateClassExam>
            ) => {
              const { startTime, duration } = allValues;
              if (!startTime || !duration) return;
              if (!dayjs.isDayjs(duration)) return;
              const endTime = dayjs(startTime)
                .add(duration.hour(), "hour")
                .add(duration.minute(), "minute");
              formCreateExam.setFieldValue("endTime", endTime);
            }}
            form={formCreateExam}
            initialValues={{
              maxAttempts: 1,
            }}
            onFinish={uploadExam}
          >
            <Row gutter={[20, 20]}>
              <Form.Item<BodyCreateClassExam> name="quizId" hidden />

              <Col xs={24} lg={12}>
                <Card className="h-full border-2 border-green-100 hover:border-green-300 hover:shadow-md transition-all rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">▶️</span>
                    <span className="font-semibold text-gray-700 text-base">
                      Thời gian bắt đầu
                    </span>
                  </div>
                  <Form.Item<BodyCreateClassExam>
                    name="startTime"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn thời gian bắt đầu",
                      },
                    ]}
                    className="mb-0"
                  >
                    <DatePicker
                      className="w-full h-12 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      format={"HH:mm DD/MM/YYYY"}
                      showTime
                      showHour
                      showMinute
                      needConfirm={false}
                      placeholder="Chọn thời gian bắt đầu"
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card className="h-full border-2 border-orange-100 hover:border-orange-300 hover:shadow-md transition-all rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">⏱️</span>
                    <span className="font-semibold text-gray-700 text-base">
                      Tổng thời gian làm bài
                    </span>
                  </div>
                  <Form.Item<BodyCreateClassExam>
                    name="duration"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn tổng thời gian làm bài",
                      },
                    ]}
                    className="mb-0"
                  >
                    <TimePicker
                      className="w-full h-12 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      placeholder="Chọn thời gian làm bài"
                      format={"HH:mm"}
                      showHour
                      showMinute
                      needConfirm={false}
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card className="h-full border-2 border-blue-100 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">✅</span>
                    <span className="font-semibold text-gray-700 text-base">
                      Thời gian kết thúc
                    </span>
                  </div>
                  <Form.Item<BodyCreateClassExam>
                    name="endTime"
                    className="mb-0"
                  >
                    <DatePicker
                      disabled
                      className="w-full h-12 rounded-lg"
                      format={"HH:mm DD/MM/YYYY"}
                      showTime
                      showHour
                      showMinute
                      placeholder="Tự động tính"
                    />
                  </Form.Item>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Tự động tính từ thời gian bắt đầu + thời gian làm bài
                  </p>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card className="h-full border-2 border-purple-100 hover:border-purple-300 hover:shadow-md transition-all rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔢</span>
                    <span className="font-semibold text-gray-700 text-base">
                      Số lần làm bài
                    </span>
                  </div>
                  <Form.Item<BodyCreateClassExam>
                    name="maxAttempts"
                    rules={[
                      { required: true, message: "Vui nhập số lần làm bài" },
                    ]}
                    className="mb-0"
                  >
                    <InputNumber
                      className="w-full h-12 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      min={0}
                      max={10}
                      placeholder="Nhập số lần làm bài"
                    />
                  </Form.Item>
                  <p className="text-xs text-gray-500 mt-2">
                    Số lần tối đa học sinh có thể làm bài (0-10 lần)
                  </p>
                </Card>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Quiz Selection Section */}
        <Card className="shadow-lg rounded-2xl border-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Đề thi</h3>
                <p className="text-sm text-gray-500">
                  Chọn đề thi cho bài kiểm tra này
                </p>
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all h-12 px-6 font-semibold"
              onClick={() => setIsOpenQuizzes(!isOpenQuizzes)}
            >
              <FontAwesomeIcon className="mr-2" icon={faBookOpen} />
              Chọn đề thi
            </Button>
          </div>

          {quizWatch ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-100">
              <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>✨</span>
                Đề thi đã chọn:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                {(() => {
                  const quiz = listMyQuiz.find(
                    (item) => item._id === quizWatch
                  );
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
                })()}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <span className="text-6xl opacity-30">📚</span>
              <p className="text-gray-400 mt-3">Chưa chọn đề thi nào</p>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            size="large"
            className="rounded-xl px-8 h-12 font-semibold hover:shadow-md transition-all"
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={formCreateExam.submit}
            className="!bg-gradient-to-r !from-green-600 !to-emerald-600 hover:!from-green-700 hover:!to-emerald-700 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all h-12 px-8 font-semibold"
          >
            Tạo bài kiểm tra
          </Button>
        </div>
      </Spin>

      <ModalChooseQuiz<BodyCreateClassExam>
        isOpen={isOpenQuizzes}
        onClose={() => setIsOpenQuizzes(false)}
        form={formCreateExam}
        multiple={false}
        fieldName="quizId"
      />
    </div>
  );
};

export default UploadExam;
