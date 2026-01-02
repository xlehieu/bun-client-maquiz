"use client";
import React, { memo, useEffect, useMemo, useState } from "react";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
  faBookOpenReader,
  faChartSimple,
  faFilePdf,
  faHeart,
  faPlayCircle,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { quizRouter } from "@/config/routes";
import { Form, Modal, Popover, Select, Switch } from "antd";
import { toast } from "sonner";
import LazyImage from "@/components/UI/LazyImage";
import useMutationHooks from "@/hooks/useMutationHooks";
import * as UserService from "@/api/user.service";
import * as FileService from "@/api/file.service";
import { useDispatch, useSelector } from "react-redux";
import { favoriteQuiz } from "@/redux/slices/user.slice";
import { useRouter } from "next/navigation";
import { QuizDetailRecord } from "@/@types/quiz.type";
import { FavoriteQuiz } from "@/@types/user.type";
import {
  setTimePassQuestion,
  shuffleQuiz,
  ShuffleType,
} from "@/redux/slices/takeQuiz.slice";
type GeneralInformationProps = {
  quizDetail: QuizDetailRecord | null;
};
type FormSetting = {
  timePassQuestion: number;
  isShufflePart: boolean;
  isShuffleQuestion: boolean;
  isShuffleAnswer: boolean;
};
const GeneralInformation = ({ quizDetail }: GeneralInformationProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const handleCountQuestion = useMemo(() => {
    if (quizDetail?.quiz && quizDetail?.quiz?.length > 0) {
      return quizDetail?.quiz?.reduce((accumulator, partCurrent) => {
        return accumulator + partCurrent?.questions?.length;
      }, 0);
    }
    return 0;
  }, [quizDetail]);
  const [formSetting] = Form.useForm<FormSetting>();
  // handle yêu thích đề thi
  const favoriteMutation = useMutationHooks((data: any) =>
    UserService.favoriteQuiz(data)
  );
  const handleFavoriteQuiz = (index: number) => {
    if (!quizDetail?._id) return;
    setLoading({
      index,
      isLoading: true,
    });
    if (
      user?.favoriteQuiz?.some(
        (quiz: FavoriteQuiz) => quiz?.slug === quizDetail?.slug
      )
    )
      return toast.info("Đề thi đã có trong danh sách yêu thích! ❤️❤️❤️");
    favoriteMutation.mutate({ id: quizDetail?._id });
    dispatch(favoriteQuiz({ slug: quizDetail.slug }));
  };
  const [loading, setLoading] = useState({
    index: -1,
    isLoading: false,
  });
  const resetLoading = () => {
    setLoading({
      index: -1,
      isLoading: false,
    });
  };
  const exportPdfMutation = useMutationHooks((data: any) =>
    FileService.ExportPdf(data)
  );
  const handleExportPdf = (index: number) => {
    exportPdfMutation.mutate({
      id: quizDetail?._id,
      collection: "quiz",
    });
    setLoading({
      index,
      isLoading: true,
    });
  };
  useEffect(() => {
    if (favoriteMutation.isSuccess) {
      toast.success("Đã thêm đề thi vào mục yêu thích! ❤️❤️❤️");
      favoriteMutation.reset();
      resetLoading();
    } else if (exportPdfMutation.isSuccess) {
      toast.success("Xuất pdf thành công");
      resetLoading();
    } else if (exportPdfMutation.isError) {
      toast.error("Xuất pdf thất bại");
      console.log(exportPdfMutation.error);
      resetLoading();
    }
  }, [
    favoriteMutation.isSuccess,
    exportPdfMutation.isSuccess,
    exportPdfMutation.isError,
  ]);

  const handleNavigateTakeQuiz = async (formValue: FormSetting) => {
    console.log("formValue", formValue);
    setLoadingModal(true);
    const arrShuffle: ShuffleType[] = [];
    if (formValue.isShuffleAnswer) {
      arrShuffle.push("answer");
    }
    if (formValue.isShuffleQuestion) {
      arrShuffle.push("question");
    }
    if (formValue.isShufflePart) {
      arrShuffle.push("part");
    }
    dispatch(setTimePassQuestion(formValue.timePassQuestion));
    if (arrShuffle.length > 0) dispatch(shuffleQuiz(arrShuffle));
    router.push(`${quizRouter.TAKE_QUIZ}/${quizDetail?.slug}`);
  };
  const buttonGeneralInfo = [
    {
      title: "Tải file PDF",
      class:
        "bg-gradient-to-r from-red-700 to-red-500 text-white rounded hover:opacity-60 duration-300 w-full py-1",
      icon: <FontAwesomeIcon icon={faFilePdf} className="mr-2" />,
      handler: handleExportPdf,
    },
    {
      title: "Bắt đầu ôn thi",
      class:
        "bg-gradient-to-r from-primary to-green-700 text-white rounded hover:opacity-60 duration-300 w-full py-1",
      icon: <FontAwesomeIcon icon={faPlayCircle} className="mr-2" />,
      handler: () => setIsOpenModalSetting(true),
    },
    {
      title: "Yêu thích",
      class:
        "bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded hover:opacity-60 duration-300 w-full py-1",
      icon: <FontAwesomeIcon icon={faHeart} className="mr-2" />,
      handler: handleFavoriteQuiz,
    },
  ];
  return (
    <>
      <div className="px-2 py-2 rounded-sm shadow-md border bg-white">
        <h6 className="font-semibold">Thông tin đề thi</h6>
        <div className="grid grid-cols-3 mt-2 gap-3">
          <div className="col-span-1">
            <LazyImage
              alt={quizDetail?.name}
              src={quizDetail?.thumb}
              className="w-full h-full object-cover rounded border"
            />
          </div>
          <div className="col-span-1">
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-lg">{quizDetail?.name}</p>
              <div className="mt-2">
                <LazyImage
                  className="w-9 h-9 rounded-full overflow-hidden"
                  src={quizDetail?.user?.avatar}
                  alt={`avatar ${quizDetail?.user?.name}`}
                />
                <p className="inline ml-2">{quizDetail?.user?.name}</p>
              </div>
              {quizDetail?.createdAt && (
                <div className="mt-2">
                  <FontAwesomeIcon icon={faClock} className="text-lg inline" />
                  <p className="inline ml-2">
                    {quizDetail?.createdAt &&
                      dayjs(quizDetail?.createdAt).format("DD/MM/YYYY")}
                  </p>
                </div>
              )}
              <div className="mt-2 flex gap-4">
                <Popover content={"Số câu hỏi"} trigger="hover">
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="mr-2 text-yellow-500"
                  />
                  {handleCountQuestion}
                </Popover>
                <Popover content={"Lượt thi"} trigger="hover">
                  <FontAwesomeIcon
                    icon={faBookOpenReader}
                    className="mr-2 text-green-500"
                  />
                  {quizDetail?.examCount}
                </Popover>
                <Popover content={"Lượt truy cập"} trigger="hover">
                  <FontAwesomeIcon
                    icon={faChartSimple}
                    className="mr-2 text-blue-500"
                  />
                  {quizDetail?.accessCount}
                </Popover>
              </div>
              {quizDetail?.school && (
                <div className="mt-2">
                  <p className="font-medium">
                    Trường học: {quizDetail?.school}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex flex-col gap-3">
              {quizDetail?.topic && (
                <div className="mt-2">
                  <p className="font-medium w-full text-wrap max-h-28 overflow-scroll no-horizontal-scroll maquiz-scroll">
                    Chủ đề: {quizDetail?.topic}
                  </p>
                </div>
              )}
              {quizDetail?.schoolYear && (
                <div className="mt-2">
                  <p className="font-medium">
                    Năm học: {quizDetail?.schoolYear}
                  </p>
                </div>
              )}
              {quizDetail?.educationLevel &&
                quizDetail?.educationLevel?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">
                      Trình độ:{" "}
                      <span>{quizDetail?.educationLevel.join(", ")}</span>
                    </p>
                  </div>
                )}
              {quizDetail?.description && (
                <div className="mt-2">
                  <p className="font-medium w-full text-wrap  max-h-28 overflow-scroll no-horizontal-scroll maquiz-scroll">
                    Mô tả: {quizDetail?.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {buttonGeneralInfo.map((button, index) => (
            <button
              key={index}
              onClick={() => button.handler(index)}
              // to={`${quizRouter.takeQuiz}/${quizDetail?.slug}`}
              className={button.class}
            >
              {button.icon}
              {button.title}
              {loading.index === index && loading.isLoading && (
                <LoadingOutlined className="ml-2" />
              )}
            </button>
          ))}
        </div>
      </div>
      <Modal
        title="Thiết lập trước khi làm bài"
        open={isOpenModalSetting}
        onCancel={() => setIsOpenModalSetting(false)}
        cancelText="Đóng"
        confirmLoading={loadingModal}
        onOk={formSetting.submit}
      >
        <Form
          initialValues={{
            timePassQuestion: 2000,
            isShufflePart: false,
            isShuffleQuestion: false,
            isShuffleAnswer: false,
          }}
          form={formSetting}
          layout="horizontal"
          onFinish={handleNavigateTakeQuiz}
        >
          <Form.Item<FormSetting>
            name="timePassQuestion"
            label="Tự động chuyển câu sau"
          >
            <Select
              className="w-full md:w-1/2 mt-2"
              placeholder="Tự động chuyển câu sau"
            >
              <Select.Option value={1000}>1s</Select.Option>
              <Select.Option value={2000}>2s</Select.Option>
              <Select.Option value={3000}>3s</Select.Option>
              <Select.Option value={4000}>4s</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item<FormSetting> name="isShufflePart" label="Đảo phần thi">
            <Switch />
          </Form.Item>
          <Form.Item<FormSetting> name="isShuffleQuestion" label="Đảo câu hỏi">
            <Switch />
          </Form.Item>
          <Form.Item<FormSetting> name="isShuffleAnswer" label="Đảo đáp án">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(GeneralInformation);
