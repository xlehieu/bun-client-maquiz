"use client";
import TextEditor from "@/components/UI/TextEditor/TextEditor";
import { BodyUpsertQuestionQuiz } from "@/@types/quiz.type";
import {
  DeleteOutlined,
  PlusOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { Button, Checkbox, Form, FormInstance, Radio, Tag } from "antd";
import React from "react";

type OneNNAnswerProps = {
  form: FormInstance<BodyUpsertQuestionQuiz>;
};

const OneNNAnswer = ({ form }: OneNNAnswerProps) => {
  // Watch questionType để render Radio/Checkbox phù hợp
  const questionType = Form.useWatch("questionType", form);

  return (
    <div className="space-y-8">
      {/* PHẦN NỘI DUNG CÂU HỎI */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center  mb-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <label className="text-base font-black text-slate-700 uppercase tracking-tight">
              Nội dung câu hỏi chính
            </label>
          </div>
          <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full italic">
            {questionType === 1
              ? "Dạng câu hỏi một đáp án"
              : "Dạng câu hỏi nhiều đáp án"}
          </div>
        </div>
        <Form.Item<BodyUpsertQuestionQuiz>
          name="questionContent"
          className="mb-0 shadow-sm rounded-2xl overflow-hidden border border-slate-100"
        >
          <TextEditor placeholder="Nhập câu hỏi tại đây..." />
        </Form.Item>
      </section>

      {/* PHẦN CÁC ĐÁP ÁN */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-amber-400 rounded-full"></div>
            <label className="text-base font-black text-slate-700 uppercase tracking-tight">
              Các phương án trả lời
            </label>
          </div>
          <Tag
            color="blue"
            className="rounded-full px-3 font-bold border-none bg-blue-50 text-blue-500"
          >
            {questionType === 1
              ? "Chọn một đáp án đúng"
              : "Chọn nhiều đáp án đúng"}
          </Tag>
        </div>

        <Form.List name="answers">
          {(fields, { remove, add }) => (
            <div className="flex flex-col gap-6">
              {fields.map(({ key, name }, index) => (
                <div
                  key={key}
                  className="group relative bg-slate-50/50 hover:bg-white p-5 rounded-[24px] border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 animate-in zoom-in-95"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Badge số thứ tự */}
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:border-primary group-hover:text-primary transition-colors">
                        {index + 1}
                      </div>

                      {/* Radio hoặc Checkbox để chọn đáp án đúng */}
                      <Form.Item
                        name={[name, "isCorrect"]}
                        valuePropName="checked"
                        noStyle
                      >
                        {questionType === 1 ? (
                          <Radio className="font-bold text-slate-600 custom-radio-modern">
                            Đáp án đúng
                          </Radio>
                        ) : (
                          <Checkbox className="font-bold text-slate-600 custom-checkbox-modern">
                            Đáp án đúng
                          </Checkbox>
                        )}
                      </Form.Item>
                    </div>

                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 rounded-lg font-bold flex items-center"
                    >
                      Xóa
                    </Button>
                  </div>

                  <Form.Item
                    name={[name, "content"]}
                    rules={[
                      {
                        required: true,
                        message: "Nội dung đáp án không được để trống",
                      },
                    ]}
                    className="mb-0 bg-white rounded-xl overflow-hidden border border-slate-100 group-hover:border-primary/10"
                  >
                    <TextEditor
                      placeholder={`Nhập nội dung cho đáp án ${index + 1}...`}
                    />
                  </Form.Item>

                  {/* Decorator checkmark khi được chọn đúng */}
                  <Form.Item shouldUpdate noStyle>
                    {() => {
                      const isCorrect = form.getFieldValue([
                        "answers",
                        name,
                        "isCorrect",
                      ]);
                      return (
                        isCorrect && (
                          <div className="absolute -top-2 -right-2 text-green-500 bg-white rounded-full shadow-md animate-in zoom-in">
                            <CheckCircleFilled className="text-2xl" />
                          </div>
                        )
                      );
                    }}
                  </Form.Item>
                </div>
              ))}

              {/* Nút thêm đáp án được cách điệu */}
              <button
                type="button"
                onClick={() => add({ isCorrect: false, content: "" })}
                className="group w-full py-6 rounded-[24px] border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
                  <PlusOutlined className="text-lg" />
                </div>
                <span className="font-bold text-slate-400 group-hover:text-primary tracking-wide transition-colors">
                  THÊM PHƯƠNG ÁN TRẢ LỜI
                </span>
              </button>
            </div>
          )}
        </Form.List>
      </section>
    </div>
  );
};

export default OneNNAnswer;
