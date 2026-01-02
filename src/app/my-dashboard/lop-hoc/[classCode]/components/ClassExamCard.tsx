import React from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faUserEdit,
  faCalendarAlt,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons"; // Giả định path type của bạn
import { useRouter } from "next/navigation";
import { ClassExamItem } from "@/@types/classExam.type";

type Props = {
  exam: ClassExamItem;
};

const ClassExamCard = ({ exam }: Props) => {
  const router = useRouter();
  // Logic kiểm tra trạng thái thời gian
  const now = dayjs();
  const isOpen = exam.isOpen;
  const isEnded = exam.isExpired;
  const isDraft = !isOpen && !isEnded;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Side: Thumbnail & Status Badge */}
        <div className="relative w-full md:w-48 h-32 md:h-auto overflow-hidden">
          {/* <img
            src={exam.quizDetail.thumb}
            alt={exam.quizDetail.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          /> */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isEnded ? (
              <span className="bg-gray-500/80 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold">
                Kết thúc
              </span>
            ) : isOpen ? (
              <span className="bg-emerald-500/80 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold animate-pulse">
                Đang diễn ra
              </span>
            ) : (
              <span className="bg-amber-500/80 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold">
                Sắp diễn ra
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {exam?.quizDetail?.name}
            </h3>

            <div className="grid grid-cols-2 gap-y-3 mt-4">
              {/* Thời gian làm bài */}
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
                  <FontAwesomeIcon icon={faClock} size="sm" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold leading-none">
                    Thời gian
                  </span>
                  <span className="text-sm font-semibold">
                    {exam.duration} phút
                  </span>
                </div>
              </div>

              {/* Số lần làm bài */}
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shadow-inner">
                  <FontAwesomeIcon icon={faUserEdit} size="sm" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold leading-none">
                    Số lần được phép làm
                  </span>
                  <span className="text-sm font-semibold">
                    {exam.maxAttempts} lần
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline thời gian */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50/50 border border-slate-100 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-blue-400"
                />
                <span>
                  Bắt đầu:{" "}
                  <b>{dayjs(exam.startTime).format("HH:mm - DD/MM")}</b>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-red-400"
                />
                <span>
                  Kết thúc: <b>{dayjs(exam.endTime).format("HH:mm - DD/MM")}</b>
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            disabled={isEnded || !isOpen}
            className={`mt-5 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all 
              ${
                isOpen && !isEnded
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
          >
            {isEnded ? "Đã đóng" : isOpen ? "Vào thi ngay" : "Chưa đến giờ"}
            {!isEnded && isOpen && (
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassExamCard;
