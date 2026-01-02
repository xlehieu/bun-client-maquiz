"use client";
import { questionTypeContent } from "@/common/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  chooseQuestionType1,
  chooseQuestionType2,
} from "@/redux/slices/takeQuiz.slice";
import { QuestionType_1_2 } from "@/@types/quiz.type";
import { AnswerChoiceType1_2 } from "@/@types/shared.type";
import { getClassNameQuestion } from "@/utils";
import { Checkbox, Radio } from "antd";
import HTMLReactParser from "html-react-parser/lib/index";

// Phần  giữa (chọn đáp án)
const sanitizeHTML = (html: any) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = doc.body.querySelectorAll("p,span");

  elements.forEach((el: any) => {
    if (el.style && el.style.backgroundColor) {
      el.style.backgroundColor = ""; // Loại bỏ background-color
      el.style.color = ""; // Loại bỏ color
    }
  });

  return doc.body.innerHTML;
};
const TakeOneNNAnswers = () => {
  const {
    currentQuizPreviewDetail: currentQuizDetail,
    currentQuestionIndex,
    currentPartIndex,
    currentQuestionType,
    answerChoices,
  } = useAppSelector((state) => state.takeQuiz);
  const dispatch = useAppDispatch();
  const handleGetChooseIndexAnswer = (indexInRenderAnswer: number) => {
    if (
      currentQuestionType === 1 &&
      currentPartIndex in (answerChoices || {})
    ) {
      if (currentQuestionIndex in answerChoices[currentPartIndex]) {
        if (
          (
            answerChoices[currentPartIndex][
              currentQuestionIndex
            ] as AnswerChoiceType1_2
          ).chooseIndex === indexInRenderAnswer
        )
          return true;
      }
    }
    if (currentQuestionType === 2 && currentPartIndex in answerChoices) {
      const choices = answerChoices[currentPartIndex][currentQuestionIndex];
      if (Array.isArray(choices)) {
        // tìm xem trong answer choice có index render không? nếu có thì return về isCorrect của nó
        const foundChoice = choices.find(
          (choice) =>
            (choice as AnswerChoiceType1_2).chooseIndex == indexInRenderAnswer
        );
        return foundChoice ? true : false;
      }
    }
    return false;
  };
  const handleChooseAnswerQuestion1 = (
    chooseIndex: number,
    isCorrect: boolean
  ) => {
    if (answerChoices?.[currentPartIndex]?.[currentQuestionIndex]) return;
    dispatch(
      chooseQuestionType1({
        currentPartIndex,
        currentQuestionIndex,
        chooseIndex,
        isCorrect,
      })
    );
  };
  const handleChooseAnswerQuestion2 = (
    chooseIndex: number,
    isCorrect: boolean
  ) => {
    dispatch(
      chooseQuestionType2({
        currentPartIndex,
        currentQuestionIndex,
        chooseIndex,
        isCorrect,
      })
    );
  };
  return (
    <div>
      <>
        <div className="flex justify-between items-center">
          <p>Câu {currentQuestionIndex + 1}</p>
          <p className="text-sm text-gray-500">
            {/*lấy kiểu câu hỏi - Một đáp án or nhiều đáp án*/}
            {questionTypeContent?.[currentQuestionType || 1]}
          </p>
        </div>
        <div className="my-2 font-medium">
          {/* Hiển thị nội dung câu hỏi */}
          {HTMLReactParser(
            (
              currentQuizDetail?.quiz[currentPartIndex].questions[
                currentQuestionIndex
              ] as QuestionType_1_2
            ).questionContent || ""
          )}
        </div>
        <div className="flex flex-col gap-5">
          {/* Render các câu trả lời và chọn */}

          {(
            currentQuizDetail?.quiz[currentPartIndex].questions[
              currentQuestionIndex
            ] as QuestionType_1_2
          ).answers.map((answer, index: number) => (
            <label
              key={index}
              className="flex items-center select-none space-x-2 cursor-pointer"
            >
              {/* Kiểm tra xem kiểu câu hỏi hiện tại là gì (hàm set ở trên provider)*/}
              {currentQuizDetail?.quiz?.[currentPartIndex]?.questions?.[
                currentQuestionIndex
              ]?.questionType === 1 ? (
                <Radio
                  //   type={currentQuestionType == 1 ? "radio" : "checkbox"}
                  onChange={(e) => {
                    // console.log(e.target.)
                    handleChooseAnswerQuestion1(index, answer.isCorrect);
                  }}
                  checked={handleGetChooseIndexAnswer(index)}
                  className="w-5 h-5"
                ></Radio>
              ) : (
                <Checkbox
                  onChange={(e) => {
                    // console.log(e.target.)
                    handleChooseAnswerQuestion2(index, answer.isCorrect);
                  }}
                  checked={handleGetChooseIndexAnswer(index)}
                  className="w-5 h-5"
                />
              )}

              {/* Đây là render bằng mảng nên để tránh việc chưa trả lời mà đáp án đã tích thì phải đủ điều kiện
                                    chỉ số phần thi hiện tại ở trong answerChoice(provider) và có thằng đáp án hiện tại sau khi chọn
                                    tiếp theo thêm điều kiện đáp án đúng của câu hỏi
                          
                                    Khi trả lời sai thì tất render màu đỏ bằng cách chỉ số câu trả lời khi render và chỉ số câu trả lời đã lưu trong anserchoice phải bằng nhau
                                    thứ 2 trong answerChoice isCorrect phải bằng false
                                    */}
              <div
                className={getClassNameQuestion({
                  answerChoices,
                  currentPartIndex,
                  currentQuestionIndex,
                  isCorrectAnswerRender: answer.isCorrect,
                  questionType: currentQuestionType,
                  indexAnswer: index,
                })}
              >
                {HTMLReactParser(sanitizeHTML(answer.content))}
              </div>
            </label>
          ))}
        </div>
      </>
    </div>
  );
};

export default TakeOneNNAnswers;
