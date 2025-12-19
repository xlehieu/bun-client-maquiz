"use client";
import React, { Fragment, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { IQuiz } from "@/interface";
import { BodyCreateQuestionQuiz } from "@/types/quiz.type";
import { v4 as uuidv4 } from "uuid";
const initValue = [{ match: 1, questionContent: "", answer: "" }];
const CreateMatchQuestion = ({
  quizDetail,
  setQuiz,
  currentPartIndex,
  currentQuestionIndex,
  onSendMatchQuestion,
}: any) => {
  const [matchQuestions, setMatchQuestions] = useState(
    quizDetail?.quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]
      ?.matchQuestions || [...initValue]
  );
  console.log(matchQuestions);
  const handleAddAnswer = () => {
    const newMatch = matchQuestions?.length + 1;
    setMatchQuestions([
      ...matchQuestions,
      { match: newMatch, questionContent: "", answer: "" },
    ]);
  };
  const handleChangeQuestionNAnswer = (
    type: string,
    match: number | string,
    value: string
  ) => {
    setMatchQuestions((preValue: any) => {
      if (!match) return preValue;
      const newValue = [...preValue];
      const idx = newValue.findIndex((item) => {
        return item.match === match;
      });
      console.log(idx);
      if (idx !== -1) {
        newValue[idx][type] = value;
      }
      return newValue;
    });
  };
  useEffect(() => {
    if (typeof onSendMatchQuestion === "function")
      onSendMatchQuestion(matchQuestions);
    if (typeof setQuiz === "function") {
      setQuiz((preValue: IQuiz) => {
        const newQuizDetail = { ...preValue };
        if (
          Number.isInteger(currentPartIndex) &&
          Number.isInteger(currentQuestionIndex) &&
          newQuizDetail?.quiz
        )
          newQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex] =
            {
              questionType:
                newQuizDetail?.quiz?.[currentPartIndex]?.questions?.[
                  currentQuestionIndex
                ]?.questionType,
              matchQuestions,
            };
        return newQuizDetail;
      });
    }
  }, [matchQuestions]);
  // useEffect(() => {
  //     if (quizDetail)
  //         setMatchQuestions(
  //             quizDetail?.quiz?.[currentPartIndex]?.question?.[currentQuestionIndex]?.matchQuestions || [
  //                 ...initValue,
  //             ],
  //         );
  // }, [quizDetail]);
  return (
    <div className="flex flex-col">
      <h2 className="text-xl text-camdat font-bold">
        Thêm câu hỏi và đáp án tương ứng
      </h2>
      <div className="space-y-2"></div>
      <Form.List name="matchQuestions">
        {(fields, { remove, add }) => (
          <Fragment>
            {fields.map(({ key, name }, index) => (
              <Fragment>
                <Row
                  key={key}
                  className="flex items-center justify-between"
                  gutter={[12, 12]}
                >
                  <Col xs={11}>
                    <Form.Item<BodyCreateQuestionQuiz["matchQuestions"]>
                      name={[name, "questionContent"]}
                      label={`Câu hỏi ${index + 1}`}
                      className="w-full"
                      rules={[
                        {
                          required: true,
                          message: "Nhập câu hỏi",
                        },
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder={`Nhập câu hỏi ${index + 1}`}
                        className="w-full"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={11}>
                    <Form.Item<BodyCreateQuestionQuiz["matchQuestions"]>
                      name={[name, "answer"]}
                      label={`Đáp án ${index + 1}`}
                      className="w-full"
                      rules={[
                        {
                          required: true,
                          message: "Nhập đáp án",
                        },
                      ]}
                    >
                      <Input
                        type="text"
                        className="w-full"
                        placeholder={`Đáp án ${index + 1}`}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={2} className="flex flex-col items-end">
                    <Button
                      className="text-lg text-red-500 hover:text-red-700"
                      onClick={() => {
                        remove(name);
                      }}
                      type="link"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-red-500"
                      />
                    </Button>
                  </Col>
                </Row>
              </Fragment>
            ))}
            <button
              onClick={(e) => {
                e.preventDefault();
                add({
                  match: uuidv4(),
                  questionContent: "",
                  answer: "",
                });
              }}
              className={
                "w-full py-3 rounded-md hover:rounded-2xl border-4 border-dashed border-primary hover:opacity-50 transition-all ease-in hover:scale-95"
              }
            >
              <span className="text-primary font-bold">
                <PlusOutlined className="text-xl pr-2" />
                Thêm đáp án
              </span>
            </button>
          </Fragment>
        )}
      </Form.List>
    </div>
  );
};

export default CreateMatchQuestion;
