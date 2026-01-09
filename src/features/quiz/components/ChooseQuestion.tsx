"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setCurrentUpdateQuestionQuizId,
  setQuizOfQuizDetail,
} from "@/redux/slices/quiz.slice";
import { AnswerType_1_2 } from "@/@types/quiz.type";
import { faPlus, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";
import { v4 as uuidv7 } from "uuid";

const initArrAnswers: AnswerType_1_2[] = Array.from<AnswerType_1_2>({
  length: 4,
}).fill({
  content: "",
  isCorrect: false,
});

const ChooseQuestion = () => {
  const dispatch = useAppDispatch();
  const { quizDetail, currentQuizPartId, currentUpdateQuestionQuizId } =
    useAppSelector((state) => state.quiz);

  const questions =
    quizDetail?.quiz.find((item) => item.partId === currentQuizPartId)
      ?.questions || [];

  const handleAddQuestion = () => {
    const questionId = uuidv7();
    const part = quizDetail?.quiz.find(
      (item) => item.partId === currentQuizPartId
    );

    if (!part) return toast.error("Vui lòng chọn hoặc tạo phần thi trước");

    dispatch(
      setQuizOfQuizDetail({
        partId: currentQuizPartId,
        partName: part.partName,
        questionId,
        questionType: 1,
        answers: [...initArrAnswers],
        questionContent: "",
      })
    );
    dispatch(setCurrentUpdateQuestionQuizId(questionId));
    toast.success(`Đã thêm câu hỏi số ${questions.length + 1}`);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Header tương tự ChoosePart */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
          Câu hỏi
        </span>
        <button
          onClick={handleAddQuestion}
          className="flex items-center gap-1.5 text-primary hover:text-primary-bold font-bold text-sm transition-colors group"
        >
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
          </div>
          Thêm câu
        </button>
      </div>

      {/* Grid danh sách câu hỏi */}
      {questions.length > 0 ? (
        <div className="grid grid-cols-5 gap-2">
          {questions.map((quizContent, index) => {
            const isActive =
              quizContent.questionId === currentUpdateQuestionQuizId;
            return (
              <button
                key={quizContent.questionId}
                onClick={() =>
                  dispatch(
                    setCurrentUpdateQuestionQuizId(quizContent.questionId)
                  )
                }
                className={`
                                    aspect-square flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-200
                                    ${
                                      isActive
                                        ? "bg-amber-500 text-white shadow-md shadow-amber-200 scale-110 z-10"
                                        : "bg-white border border-slate-100 text-slate-500 hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50"
                                    }
                                `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="py-8 px-4 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400">
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className="text-2xl mb-2 opacity-20"
          />
          <p className="text-xs font-medium">Chưa có câu hỏi nào</p>
        </div>
      )}

      {/* Thông tin bổ trợ phía dưới (Mini Stat) */}
      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Tổng cộng</span>
        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
          {questions.length} câu
        </span>
      </div>
    </div>
  );
};

export default ChooseQuestion;
