"use client";
import { Select } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import congratsAnimation from "@/asset/animations/congratulations-2.json";
import Aos from "aos";
import "aos/dist/aos.css";
//component
import Timer from "./Timer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { ANSWER_CHOICE_ACTION, questionTypeContent } from "@/common/constants";
import LoadingComponent from "@/components/UI/LoadingComponent";
import siteRouter from "@/config";
import useMutationHooks from "@/hooks/useMutationHooks";
import * as QuizHistoryService from "@/services/quizHistory.service";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { toast } from "sonner";
import "react-circular-progressbar/dist/styles.css";
import ChatBot from "@/components/UI/ChatBot";
import TakeOneNNAnswers from "@/components/Quiz/TakeQuiz/TakeOneNNAnswers";
import TakeMatchQuestion from "@/components/Quiz/TakeQuiz/TakeMatchQuestion";
import TakeQuizProvider, {
  ShuffleProvider,
  TakeQuizContext,
} from "@/context/TakeQuizContext";
//end

const answerChoiceReducer = (state: any, action: any) => {
  switch (action.type) {
    case ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_1: {
      return {
        ...state,
        [action.payload.currentPartIndex]: {
          ...state[action.payload.currentPartIndex],
          [action.payload.currentQuestionIndex]: {
            chooseIndex: action.payload.chooseIndex,
            isCorrect: action.payload.isCorrect,
          },
        },
      };
    }
    case ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_2: {
      const { currentPartIndex, currentQuestionIndex, chooseIndex, isCorrect } =
        action.payload;
      if (
        currentPartIndex !== undefined &&
        currentQuestionIndex !== undefined &&
        chooseIndex !== undefined &&
        isCorrect !== undefined
      ) {
        const choices = { ...state };
        // khi choices[currentPartIndex] là undefined thì phải set là một đối tượng không thì
        // kiểm tra choices[currentPartIndex][currentQuestionIndex] sẽ là đang truy cập đến thuộc tính của undefined nên lỗi
        // và đang là kiểm tra questionType = 1 nên sẽ kiểm tra là mảng
        if (!choices.hasOwnProperty(currentPartIndex))
          choices[currentPartIndex] = {};
        if (Array.isArray(choices[currentPartIndex][currentQuestionIndex])) {
          // nếu câu hỏi vừa chọn có trong answer choice rồi thì return
          if (
            choices[currentPartIndex][currentQuestionIndex].some(
              (choice) => choice.chooseIndex === chooseIndex
            )
          ) {
            return state;
          }
          choices[currentPartIndex] = {
            ...choices[currentPartIndex],
            [currentQuestionIndex]: [
              ...choices[currentPartIndex][currentQuestionIndex],
              {
                chooseIndex: chooseIndex,
                isCorrect: isCorrect,
              },
            ],
          };
        } else {
          choices[currentPartIndex] = {
            ...choices[currentPartIndex],
            [currentQuestionIndex]: [
              {
                chooseIndex: chooseIndex,
                isCorrect: isCorrect,
              },
            ],
          };
        }
        return choices;
      }
      return state;
    }
    case ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_3: {
      //matchInfo sẽ có kiểu {answer,question}// sẽ có thêm current question
      const { currentPartIndex, currentQuestionIndex, matchQuestion } =
        action.payload;
      const choices = { ...state };
      if (!choices[currentPartIndex]) {
        choices[currentPartIndex] = {};
      }
      if (Array.isArray(matchQuestion)) {
        choices[currentPartIndex] = {
          ...(choices?.[currentPartIndex] || {}),
          [currentQuestionIndex]: [...(matchQuestion || [])],
        };
      }
      return choices;
    }
    default:
      return state;
  }
};
const checkQuestionCorrectQuestionType2 = (
  quizDetail: any,
  answerChoices: any,
  currentQuestionType: any,
  currentPartIndex: any,
  currentQuestionIndex: any
) => {
  if (
    typeof quizDetail === "undefined" &&
    typeof answerChoices === "undefined" &&
    typeof currentQuestionType === "undefined" &&
    typeof currentPartIndex === "undefined" &&
    typeof currentQuestionIndex === "undefined"
  )
    return;
  if (
    quizDetail.quiz &&
    currentQuestionType === 2 &&
    currentPartIndex in answerChoices
  ) {
    if (currentQuestionIndex in answerChoices[currentPartIndex]) {
      const quiz = quizDetail.quiz;
      if (quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]) {
        const answers =
          quiz?.[currentPartIndex]?.questions?.[currentQuestionIndex]?.answers; // quiz detail
        const choices = answerChoices[currentPartIndex][currentQuestionIndex]; //answer choices
        if (Array.isArray(answers) && Array.isArray(choices)) {
          let countAnswerCorrectInQuizDetail = 0;
          answers.forEach((answer) => {
            if (answer.isCorrect) return countAnswerCorrectInQuizDetail++;
          }, 0);
          let countAnswerCorrectInAnswerChoices = 0;
          choices.forEach((choice) => {
            if (choice.isCorrect) return countAnswerCorrectInAnswerChoices++;
          }, 0);
          const everyCorrect = choices.every(
            (choice) => choice.isCorrect === true
          );
          if (
            countAnswerCorrectInQuizDetail ===
              countAnswerCorrectInAnswerChoices &&
            everyCorrect
          ) {
            return true;
          }
          return false;
        }
      }
    }
  }
  return null;
};
// đếm số câu đúng trong 1 câu hỏi
const countCorrectAnswerQuizDetail = (question: any) => {
  if (!(question?.answers?.length > 0)) return 0;
  let count = 0;
  question.answers.forEach((answer: any) => {
    if (answer?.isCorrect) count++;
  });
  return count;
};
// đếm đáp án đúng trong câu trả lời
const countCorrectAnswerChoices = (answerChoices: any, quizDetail: any) => {
  let count = 0;
  console.log(answerChoices, quizDetail);
  //lặp qua từng phần
  Object.entries(answerChoices).forEach(([keyOfPart, valueOfPart]) => {
    if (typeof valueOfPart === "object") {
      // đang tính theo question
      Object.entries(valueOfPart as any).forEach(
        ([keyOfQuestion, valueOfQuestion]: any) => {
          // nếu là loại 1
          if (
            typeof valueOfQuestion === "object" &&
            quizDetail.quiz[keyOfPart]?.questions[keyOfQuestion]
              ?.questionType === 1
          ) {
            if (valueOfQuestion?.isCorrect) {
              console.log("OK 1");
              count++;
            }
          } else if (
            Array.isArray(valueOfQuestion) &&
            quizDetail.quiz[keyOfPart]?.questions[keyOfQuestion]
              ?.questionType === 2
          ) {
            //đếm xem đã chọn đủ số đáp án đúng chưa => check bằng length của đáp án được chọn so với số câu dúng của question đó
            // => không quan tâm đến question answer có đúng hay không đã
            if (
              countCorrectAnswerQuizDetail(
                quizDetail.quiz[keyOfPart].questions[keyOfQuestion]
              ) === valueOfQuestion.length
            ) {
              if (
                valueOfQuestion.every((answer) => answer.isCorrect === true)
              ) {
                console.log("OK 2");

                count++;
              }
            }
          } else if (
            Array.isArray(valueOfQuestion) &&
            quizDetail.quiz[keyOfPart]?.questions[keyOfQuestion]
              ?.questionType === 3
          ) {
            // nếu tất cả giống nhau thì trả lời đúng
            if (
              valueOfQuestion.every(
                (itemQuestionAnswer) =>
                  itemQuestionAnswer.question == itemQuestionAnswer.answer
              )
            ) {
              console.log("OK 3");
              count++;
            }
          }
        }
      );
    }
  });
  return count;
};
const calculateScore = (
  answerChoices: any,
  countQuestionQuizDetail: any,
  quizDetail: any
) => {
  if (
    typeof answerChoices === "object" &&
    typeof quizDetail === "object" &&
    quizDetail?.quiz?.length > 0
  ) {
    let countCorrectAnswer = 0;
    //vào part
    Object.entries(answerChoices).forEach(([keyPart, value]: any) => {
      // entries trả về mảng, mảng đó lại chứa các mảng [key,value]
      if (typeof value === "object") {
        //vào question và lấy được giá trị bằng value
        Object.entries(value).forEach(([keyQuestion, valueQuestion]: any) => {
          if (
            Array.isArray(valueQuestion) &&
            countCorrectAnswerQuizDetail(
              quizDetail.quiz[keyPart].questions[keyQuestion]
            ) === valueQuestion.length
          ) {
            if (valueQuestion.every((answer) => answer.isCorrect === true)) {
              countCorrectAnswer++;
            }
          }
          if (typeof valueQuestion === "object") {
            if (valueQuestion?.isCorrect) {
              countCorrectAnswer++;
            }
          }
        });
      }
    });
    return Number(
      ((countCorrectAnswer / countQuestionQuizDetail) * 10).toFixed(2)
    );
  }
};

//region phần bên trái của trang (hiển thị thông tin cơ bản bài thi)
const TakeQuizInfo = () => {
  const router = useRouter();
  const {
    quizDetail,
    setIsEnded,
    setIsTimeout,
    timePass,
    setTimePass,
    currentPartIndex,
    setCurrentPartIndex,
    answerChoices,
  } = useContext(TakeQuizContext);
  const handleChangePartIndex = (partIndex: any) => {
    if (partIndex === currentPartIndex) return;
    setCurrentPartIndex(partIndex);
  };
  const handleBack = () => {
    if (window) {
      window.location.href = `/review-quiz/${quizDetail?.name}`;
    }
  };
  return (
    <div className="flex flex-col w-full lg:max-w-72 gap-6">
      <div className="px-4 py-2 bg-white rounded shadow">
        <div className="border-b border-gray-300 font-medium py-2">
          <p className="text-lg">{quizDetail?.name}</p>
          <p className="font-normal mt-2">
            <span className="text-2xl text-rose-800 font-bold ml-1">
              Ôn thi
            </span>
          </p>
        </div>
        <div className="border-b border-gray-300 py-2">
          <p>Thời gian làm bài</p>
          <Timer setIsTimeout={setIsTimeout} />
        </div>
        <div className="pt-2">
          <p className="font-medium pb-1 text-sm">Tự động chuyển câu sau</p>
          <Select
            onChange={(e) => {
              setTimePass(e);
            }}
            defaultValue={timePass}
            className="w-full md:w-1/2 mt-2"
          >
            <Select.Option value={1000}>1s</Select.Option>
            <Select.Option value={2000}>2s</Select.Option>
            <Select.Option value={3000}>3s</Select.Option>
            <Select.Option value={4000}>4s</Select.Option>
          </Select>
        </div>
        <div className="flex mt-3 gap-3">
          <button
            className="bg-red-500 block rounded-md px-3 py-1  duration-300 hover:opacity-65"
            onClick={handleBack}
          >
            <p className="text-center text-white">Trở về</p>
          </button>
          <button
            className="bg-yellow-500 block rounded-md px-3 py-1 duration-300 hover:opacity-65"
            onClick={() => setIsEnded(true)}
          >
            <p className="text-center text-white">Kết thúc</p>
          </button>
        </div>
      </div>
      <div className="px-4 py-2 bg-white rounded shadow">
        <p className="font-medium mb-4">
          Danh sách phần thi ({quizDetail?.quiz?.length})
        </p>
        {quizDetail?.quiz.map((part: any, index: any) => (
          <button
            key={index}
            onClick={() => handleChangePartIndex(index)}
            className={`w-full px-4 py-2 items-center rounded-sm flex justify-between opacity-95 duration-300 ease-linear ${
              currentPartIndex === index
                ? "bg-blue-100 cursor-default"
                : "cursor-pointer hover:opacity-45 hover:bg-blue-100"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-7 h-7 flex items-center justify-center flex-wrap rounded-full ${
                  currentPartIndex === index ? "bg-pink-600" : ""
                }`}
              >
                {currentPartIndex === index && (
                  <FontAwesomeIcon
                    className={`text-white text-sm`}
                    icon={faBookOpen}
                  />
                )}
              </div>
              <span className="ml-3">{part?.partName}</span>
            </div>
            <div className="text-blue-500 font-medium text-right">
              {index in answerChoices ? (
                <>{Object.keys(answerChoices[index]).length}</>
              ) : (
                0
              )}
              /{quizDetail?.quiz[index]?.questions?.length}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
// region Choose answers
// Phần  giữa (chọn đáp án)
//region chọn đáp án
const ChooseAnswer = () => {
  const {
    quizDetail,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentPartIndex,
    answerChoices,
    dispatchAnswerChoices,
    timePass,
    currentQuestionType,
  } = useContext(TakeQuizContext);
  //hàm chuyển câu hỏi (tăng current question index)
  const NextQuestion = () => {
    const timeoutId = setTimeout(() => {
      if (
        quizDetail &&
        typeof currentPartIndex === "number" &&
        typeof currentQuestionIndex === "number"
      ) {
        if (quizDetail.quiz) {
          const quiz = quizDetail.quiz;
          // kiểm tra xem có phải câu cuối cùng khong
          if (
            currentQuestionIndex ===
              quiz?.[currentPartIndex]?.questions?.length - 1 &&
            currentPartIndex === quiz.length - 1
          )
            return;
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }
    }, timePass ?? 2000);
    return () => clearTimeout(timeoutId);
  };
  // CHOOSE ANSWER HANDLING
  //kiểm tra xem câu có question type = 2 đã đúng chưa, so sánh xem đáp án đúng trong quiz detail và answer choice câu hỏi hiện tại có bằng nhau không
  useEffect(() => {
    if (currentQuestionType !== 2) return;
    if (
      checkQuestionCorrectQuestionType2(
        quizDetail,
        answerChoices,
        currentQuestionType,
        currentPartIndex,
        currentQuestionIndex
      )
    )
      NextQuestion();
    // ngược lại nếu chọn đủ các câu thì next
    else if (currentPartIndex in answerChoices && quizDetail?.quiz) {
      if (
        currentQuestionIndex in answerChoices[currentPartIndex] &&
        quizDetail?.quiz[currentPartIndex]?.questions
      ) {
        if (
          !Array.isArray(
            quizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]
              ?.answers
          )
        )
          return;
        const lengthAnswersCurrent =
          quizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]
            ?.answers?.length;
        const lengthAnswerChoicesCurrent =
          answerChoices[currentPartIndex][currentQuestionIndex]?.length;
        if (lengthAnswersCurrent === lengthAnswerChoicesCurrent) {
          NextQuestion();
        }
      }
    }
  }, [answerChoices]);
  // lặp mảng khi question type = 2 thì lấy ra choose index trong mảng answerChoices của câu hỏi hiện tại,
  // return về true hoặc false nếu đáp án render ở dưới có index === đáp án được chọn trong answerChoices[currentPartIndex][currentQuestionIndex]
  // AOS EFFECT
  useEffect(() => {
    Aos.init({ duration: 500, easing: "ease-in-out-back" });
    Aos.refresh();
  }, [currentPartIndex, currentQuestionIndex]);
  // END
  return (
    <div
      className="px-2 py-2 flex-1 bg-white rounded shadow"
      key={currentQuestionIndex}
      data-aos="zoom-in"
    >
      {quizDetail?.quiz[currentPartIndex] && (
        <>
          {quizDetail?.quiz?.[currentPartIndex]?.questions instanceof Array && (
            <>
              {quizDetail?.quiz?.[currentPartIndex]?.questions?.[
                currentQuestionIndex
              ] && (
                // phần trả lời câu hỏi
                <Fragment>
                  {[1, 2].includes(currentQuestionType) && (
                    <TakeOneNNAnswers
                      quizDetail={quizDetail}
                      dispatchAnswerChoices={dispatchAnswerChoices}
                      answerChoices={answerChoices}
                      currentPartIndex={currentPartIndex}
                      currentQuestionIndex={currentQuestionIndex}
                      currentQuestionType={currentQuestionType}
                      NextQuestion={NextQuestion}
                    />
                  )}
                  {Number(currentQuestionType) === 3 && (
                    <TakeMatchQuestion
                      quizDetail={quizDetail}
                      dispatchAnswerChoices={dispatchAnswerChoices}
                      answerChoices={answerChoices}
                      currentPartIndex={currentPartIndex}
                      currentQuestionIndex={currentQuestionIndex}
                      currentQuestionType={currentQuestionType}
                      NextQuestion={NextQuestion}
                    />
                  )}
                </Fragment>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
// region table of question
//Phàn bên phải chọn câu hỏi

const TableOfQuestion = () => {
  const {
    quizDetail,
    currentPartIndex,
    answerChoices,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuestionType,
  } = useContext(TakeQuizContext);
  const checkCorrectAnswer = (index: number) => {
    if (currentPartIndex in answerChoices) {
      if (
        index in answerChoices[currentPartIndex] &&
        quizDetail?.quiz[currentPartIndex]?.questions[index].questionType === 1
      ) {
        return answerChoices[currentPartIndex][index]?.isCorrect;
      } else if (
        index in answerChoices[currentPartIndex] &&
        quizDetail?.quiz[currentPartIndex]?.questions[index].questionType === 2
      ) {
        return checkQuestionCorrectQuestionType2(
          quizDetail,
          answerChoices,
          2,
          currentPartIndex,
          index
        );
      } else if (
        index in answerChoices[currentPartIndex] &&
        quizDetail?.quiz[currentPartIndex]?.questions[index].questionType === 3
      ) {
        if (
          answerChoices[currentPartIndex][index].every(
            (itemQuestionAnswer: any) =>
              itemQuestionAnswer.question == itemQuestionAnswer.answer
          )
        ) {
          return true;
        }
        return false;
      }
    }
    return null;
  };
  return (
    <div className="px-2 py-2 bg-white rounded shadow lg:max-w-80 lg:min-w-72 w-full">
      <div className="mb-2 flex flex-row justify-between">
        <p>Mục lục câu hỏi</p>
        <p className="text-sm">{questionTypeContent[currentQuestionType]}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {quizDetail?.quiz[currentPartIndex]?.questions.map(
          (question: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`${
                currentQuestionIndex === index
                  ? "border-primary !bg-primary text-white"
                  : "border-gray-300"
              } border-2 rounded-lg min-w-10 h-10 font-medium ${
                checkCorrectAnswer(index) === true &&
                "bg-green-700 border-green-700 text-white"
              } ${
                checkCorrectAnswer(index) === false &&
                "bg-red-600 border-red-600 text-white"
              } 
                        `}
            >
              {Number(index + 1)}
            </button>
          )
        )}
      </div>
    </div>
  );
};
const TakeQuizPageMain = () => {
  const {
    quizDetail,
    answerChoices,
    isEnded,
    isTimeout,
    countQuestionQuizDetail,
  } = useContext(TakeQuizContext);
  const [score, setScore] = useState(0);
  const [answerCorrectCount, setAnswerCorrectCount] = useState(0);
  const handleSaveTakeQuizHistory = useMutationHooks((data: any) =>
    QuizHistoryService.saveQuizHistory(data)
  );
  useEffect(() => {
    if (!answerChoices || !quizDetail) return;
    if (isTimeout) {
      toast.warning("Bạn đã hết giờ làm bài");
    }
    if (isEnded || isTimeout) {
      const score =
        calculateScore(answerChoices, countQuestionQuizDetail, quizDetail) || 0;
      setScore(Number(score));
      handleSaveTakeQuizHistory.mutate({
        quizId: quizDetail._id,
        score: score,
        answerChoices,
      });
    }
    if (answerChoices) {
      const count = countCorrectAnswerChoices(answerChoices, quizDetail) || 0;
      setAnswerCorrectCount(count);
    }
  }, [isEnded, isTimeout]);
  useEffect(() => {
    if (handleSaveTakeQuizHistory.isSuccess) {
      handleSaveTakeQuizHistory.reset();
    }
  }, [handleSaveTakeQuizHistory.isSuccess]);
  return (
    <React.Fragment>
      <div className="w-full h-full flex justify-center items-center">
        {!handleSaveTakeQuizHistory.isPending ? (
          <>
            {!isEnded ? (
              <div className="flex w-full flex-col-reverse lg:flex-row gap-3 lg:items-start">
                {quizDetail?.quiz && (
                  <>
                    <TakeQuizInfo />
                    <ChooseAnswer />
                    <TableOfQuestion />
                  </>
                )}
              </div>
            ) : (
              <div className="inset-0 w-full min-h-96 mx-5 my-5 md:mx-10 md:my-10">
                <div className="text-black w-full bg-white shadow rounded px-5 py-5 flex flex-col items-center justify-center">
                  <div className="w-full flex flex-row gap-3">
                    <div className="flex flex-col w-1/3 rounded-lg shadow-md border px-3 py-3 items-center">
                      <h5 className="">Điểm của bạn là:</h5>
                      <div className="w-1/2 mt-3">
                        <CircularProgressbar
                          styles={buildStyles({
                            textSize: "39px",
                            pathColor:
                              score < 5
                                ? "#ff0000"
                                : score < 7
                                ? "#ffff00"
                                : "#00ff00",
                            textColor: "#333",
                            trailColor: "#eee",
                          })}
                          value={score}
                          maxValue={10}
                          text={`${score}`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-1/3 rounded-lg shadow-md border px-3 py-3 items-center">
                      <h5>Số câu đúng</h5>
                      <div className="mt-3 w-full flex flex-col items-center justify-center flex-1 gap-3">
                        <LinearProgressBar
                          answerCorrectCount={answerCorrectCount}
                          max={countQuestionQuizDetail}
                        />
                        <h5 className="text-[#333]">
                          <span className="font-bold">
                            {answerCorrectCount}
                          </span>
                          /
                          <span className="text-green-500 font-bold">
                            {countQuestionQuizDetail}
                          </span>
                        </h5>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window) window.location.href = siteRouter.discover;
                    }}
                    className="bg-primary text-3xl px-3 py-3 mt-6 md:px-2 md:py-2 md:mt-10   z-20 text-white font-bold md:text-lg rounded-md"
                  >
                    OK
                  </button>
                </div>
                <Lottie
                  className="w-full md:w-2/3 absolute bottom-60 md:-bottom-24 z-10"
                  animationData={congratsAnimation}
                />
              </div>
            )}
          </>
        ) : (
          <LoadingComponent />
        )}
      </div>
      {quizDetail?.isUseChatBot && <ChatBot />}
    </React.Fragment>
  );
};
const LinearProgressBar = ({ answerCorrectCount, max }: any) => {
  const percent = (answerCorrectCount / max) * 100;
  const getColor = (percent: any) => {
    if (percent < 50) return "#ff0000"; // đỏ
    if (percent < 70) return "#ffff00"; // vàng
    return "#00ff00"; // xanh
  };
  return (
    <div
      style={{
        width: "100%",
        background: "#eee",
        borderRadius: "8px",
        overflow: "hidden",
        height: "20px",
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          height: "100%",
          backgroundColor: getColor(percent),
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
};
const reducerMatchingQuestion = (state: any, action: any) => {
  //matchInfo sẽ có kiểu {answer,question}// sẽ có thêm current question
  const { currentPartIndex, currentQuestionIndex } = action.payload;
  const choices = { ...state };
  if (!choices.hasOwnProperty(currentPartIndex)) {
    choices[currentPartIndex] = {};
  }
  // trường hợp đã có 1 câu trả lời bất kỳ
  if (
    choices[currentPartIndex]?.[currentQuestionIndex] &&
    Array.isArray(choices[currentPartIndex][currentQuestionIndex])
  ) {
    //tìm ra câu trả lời, nếu không có thì add mới, nếu có thì chỉnh sửa
    const idx = choices[currentPartIndex][currentQuestionIndex].findIndex(
      (item: any) => item?.question == action?.payload?.currentQuestion
    );
    if (idx !== -1) {
      const newValueItem = {
        ...choices[currentPartIndex][currentQuestionIndex][idx],
      };
      if (action.payload.answer) {
        newValueItem.answer = action.payload.answer;
      }
      choices[currentPartIndex][currentQuestionIndex][idx] = {
        ...newValueItem,
      };
      //trường hợp nếu chưa có (nhưng đã chọn đáp án câu khác)
    } else {
      // không xác định đưuọc lỗi, nhưng phải check trước khi push, nếu có rồi thì không push nữa
      if (
        !choices[currentPartIndex][currentQuestionIndex].some(
          (item: any) => item?.question === action.payload.question
        )
      ) {
        choices[currentPartIndex][currentQuestionIndex].push({
          question: action.payload.question,
        });
      }
    }
  }
  //trường hợp đầu tiên
  else {
    //trường hợp nếu chưa có gì
    choices[currentPartIndex] = {
      ...choices[currentPartIndex],
      [currentQuestionIndex]: [{ question: action.payload.question }],
    };
  }
  return choices;
};

const TakeQuizPage = () => {
  return (
    <TakeQuizProvider answerChoiceReducer={answerChoiceReducer}>
      <ShuffleProvider reducerMatchingQuestion={reducerMatchingQuestion}>
        <TakeQuizPageMain />
      </ShuffleProvider>
    </TakeQuizProvider>
  );
};
export default TakeQuizPage;
