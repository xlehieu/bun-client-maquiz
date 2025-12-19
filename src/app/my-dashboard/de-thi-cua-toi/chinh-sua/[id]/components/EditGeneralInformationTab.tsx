"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as QuizService from "@/api/quiz.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { educationLevels, imageQuizThumbDefault } from "@/common/constants";
import UploadComponent from "@/components/UI/UploadComponent";
import { Button, Col, Form, Input, Row, Select, Switch } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import useMutationHooks from "@/hooks/useMutationHooks";
import LazyImage from "@/components/UI/LazyImage";
import { IQuiz } from "@/interface";
import { QuizDetailContext } from "@/context/QuizContext";
import { toast } from "sonner";
import { BodyCreateGeneralInformationQuiz } from "@/types/quiz.type";
const EditGeneralInformationTab = () => {
  const updateQuizGeneralMutation = useMutationHooks(
    (data: BodyCreateGeneralInformationQuiz) =>
      QuizService.updateQuizGeneralInfo(data)
  );
  const [form] = Form.useForm();
  const handleSubmitForm = async (
    formValue: BodyCreateGeneralInformationQuiz
  ) => {};
  useEffect(() => {
    if (updateQuizGeneralMutation.isSuccess) {
      toast.success("Cập nhật thông tin chung bài trắc nghiệm thành công");
    } else if (updateQuizGeneralMutation.isError) {
      toast.error("Cập nhật thông tin chung bài trắc nghiệm thất bại");
    }
  }, [updateQuizGeneralMutation.isSuccess, updateQuizGeneralMutation.isError]);
  // END GENERAL INFO
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmitForm}>
      <section className="bg-white px-2 rounded">
        <Row gutter={[20, 12]} className="px-2 py-2">
          <Col xs={8}>
            <Form.Item<BodyCreateGeneralInformationQuiz>
              name="thumb"
              label="Ảnh đề thi"
            >
              <UploadComponent />
            </Form.Item>
            <div className="flex flex-wrap mt-2">
              {imageQuizThumbDefault.map((imageSrc, index) => (
                <button
                  key={index}
                  onClick={() => form.setFieldValue("t", imageSrc)}
                  className="w-1/2 px-1 py-1 border"
                >
                  <LazyImage
                    src={imageSrc}
                    alt="image-default"
                    className="w-full- h-full"
                  />
                </button>
              ))}
            </div>
          </Col>
          <Col xs={16}>
            <div className="flex flex-col">
              <Form.Item<BodyCreateGeneralInformationQuiz>
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Tên đề thi là bắt buộc",
                  },
                ]}
                label="Tên đề thi"
              >
                <Input
                  autoComplete="off"
                  placeholder="Tên đề thi"
                  type="text"
                ></Input>
              </Form.Item>
            </div>
            <div className="flex flex-col">
              <Form.Item<BodyCreateGeneralInformationQuiz>
                name="educationLevel"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trình độ bài thi",
                  },
                ]}
                label="Trình độ bài thi"
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Chọn trình độ bài thi"
                >
                  {educationLevels?.map((level, index) => (
                    <Select.Option value={level} key={index}>
                      {level}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="columns-2 gap-4">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <Form.Item<BodyCreateGeneralInformationQuiz>
                    name="schoolYear"
                    rules={[
                      {
                        required: true,
                        message: "Năm học của bài thi là bắt buộc",
                      },
                    ]}
                    label="Năm học"
                  >
                    <Input type="number" placeholder="Năm học"></Input>
                  </Form.Item>
                </div>
              </div>
              <div className="flex flex-col">
                <Form.Item<BodyCreateGeneralInformationQuiz>
                  name="topic"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn chủ đề bài thi",
                    },
                  ]}
                  label="Chủ đề bài thi"
                >
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Chủ đề bài thi"
                  >
                    {educationLevels?.map((level, index) => (
                      <Select.Option value={level} key={index}>
                        {level}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="flex flex-col">
              <Form.Item<BodyCreateGeneralInformationQuiz>
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Mô tả bài thi là bắt buộc",
                  },
                ]}
                label="Mô tả đề thi"
              >
                <TextArea
                  rows={4}
                  autoComplete="off"
                  placeholder="Mô tả"
                ></TextArea>
              </Form.Item>
            </div>
            <div className="columns-2 gap-4 ">
              <div className="flex flex-col">
                <Form.Item<BodyCreateGeneralInformationQuiz>
                  name="school"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên trường học",
                    },
                  ]}
                  label="Tên trường học"
                >
                  <Input placeholder={"Tên trường học"}></Input>
                </Form.Item>
              </div>
              <div className="flex flex-col">
                <Form.Item<BodyCreateGeneralInformationQuiz>
                  name="subject"
                  rules={[
                    {
                      required: true,
                      message: "Chọn tên môn học",
                    },
                  ]}
                  label="Môn học"
                >
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Chọn tên môn học"
                    showSearch
                  >
                    {educationLevels?.map((level, index) => (
                      <Select.Option value={level} key={index}>
                        {level}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3">
              <Form.Item<BodyCreateGeneralInformationQuiz> name="isUseChatBot">
                <Switch></Switch>
              </Form.Item>
              <label htmlFor="isUseChatBot" className="mb-6">
                Cho phép sử dụng chat GPT
              </label>
            </div>
          </Col>
        </Row>
        <div className="mt-4 w-full flex justify-end bg-white py-3 px-4 rounded shadow-sm">
          <Button
            onClick={form.submit}
            disabled={updateQuizGeneralMutation.isPending}
            type="primary"
          >
            {updateQuizGeneralMutation.isPending ? (
              <LoadingOutlined className="mr-1" />
            ) : (
              <FontAwesomeIcon icon={faSave} className="mr-1" />
            )}
            Lưu
          </Button>
        </div>
      </section>
    </Form>
  );
};
export default EditGeneralInformationTab;
