"use client";
import React, { Fragment } from "react";
import { PlusOutlined, DeleteOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";
import { BodyUpsertQuestionQuiz } from "@/@types/quiz.type";
import { v4 as uuidv7 } from "uuid";

const CreateMatchQuestion = ({ form }: any) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2 animate-in fade-in duration-500">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-camdat rounded-full"></div>
          <label className="text-base font-black text-slate-700 uppercase tracking-tight">
            Thiết lập cặp nội dung tương ứng
          </label>
        </div>
        <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full italic">
          Dạng câu hỏi nối cặp
        </div>
      </div>

      <Form.List name="matchQuestions">
        {(fields, { remove, add }) => (
          <div className="flex flex-col gap-4">
            {fields.map(({ key, name }, index) => (
              <div
                key={key}
                className="group relative bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md hover:border-camdat/20 transition-all duration-300 animate-in slide-in-from-right-4"
              >
                <Row gutter={[20, 20]} align="middle">
                  {/* Cột Vế Trái (Câu hỏi) */}
                  <Col xs={24} md={11}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                        A
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        Vế nội dung
                      </span>
                    </div>
                    <Form.Item
                      name={[name, "questionContent"]}
                      rules={[
                        { required: true, message: "Nhập nội dung vế A" },
                      ]}
                      className="mb-0"
                    >
                      <Input.TextArea
                        autoSize={{ minRows: 2 }}
                        placeholder="Nhập nội dung vế trái..."
                        className="rounded-xl border-slate-100 focus:border-camdat hover:border-camdat/50 text-sm py-3"
                      />
                    </Form.Item>
                  </Col>

                  {/* Icon Nối giữa */}
                  <Col xs={24} md={2} className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-camdat group-hover:bg-camdat/10 transition-all duration-300">
                      <SwapOutlined className="rotate-90 md:rotate-0 text-lg" />
                    </div>
                  </Col>

                  {/* Cột Vế Phải (Đáp án) */}
                  <Col xs={24} md={11}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                          B
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          Vế tương ứng
                        </span>
                      </div>

                      {/* Nút xóa nằm gọn trong header của card */}
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 rounded-lg font-bold"
                      >
                        Xóa
                      </Button>
                    </div>
                    <Form.Item
                      name={[name, "answer"]}
                      rules={[
                        { required: true, message: "Nhập nội dung vế B" },
                      ]}
                      className="mb-0"
                    >
                      <Input.TextArea
                        autoSize={{ minRows: 2 }}
                        placeholder="Nhập nội dung vế tương ứng..."
                        className="rounded-xl border-slate-100 focus:border-camdat hover:border-camdat/50 text-sm py-3"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Badge số thứ tự cặp */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 min-w-6 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-camdat group-hover:text-white transition-all duration-300">
                  <span className="text-[10px] font-black">
                    CẶP {index + 1}
                  </span>
                </div>
              </div>
            ))}

            {/* Nút thêm đáp án đồng bộ OneNNAnswer */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                add({
                  match: uuidv7(),
                  questionContent: "",
                  answer: "",
                });
              }}
              className="group w-full py-8 rounded-[24px] border-2 border-dashed border-slate-200 hover:border-camdat hover:bg-camdat/5 transition-all duration-300 flex flex-col items-center justify-center gap-2 mt-4"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-camdat group-hover:text-white flex items-center justify-center transition-all">
                <PlusOutlined className="text-lg" />
              </div>
              <span className="font-bold text-slate-400 group-hover:text-camdat tracking-widest text-xs transition-colors">
                THÊM CẶP NỐI MỚI
              </span>
            </button>
          </div>
        )}
      </Form.List>
    </div>
  );
};

export default CreateMatchQuestion;
