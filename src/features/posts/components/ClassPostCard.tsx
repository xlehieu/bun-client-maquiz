import { PostItem } from "@/@types/classroom.type";
import { QuizDetailRecord } from "@/@types/quiz.type";
import LazyImage from "@/components/UI/LazyImage";
import { quizRouter } from "@/config/routes";
import { useAppSelector } from "@/redux/hooks";
import { faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "antd";
import dayjs from "dayjs";
import HTMLReactParser from "html-react-parser/lib/index";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  post: PostItem;
  handleOpenModal: (id: string) => void;
};
const ClassPostCard = ({ post, handleOpenModal }: Props) => {
  const router = useRouter();
  const { userProfile } = useAppSelector((state) => state.user);
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start p-5 border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          {post?.createdBy?.avatar && (
            <div className="relative">
              <img
                className="w-14 h-14 rounded-full border-3 border-white shadow-md object-cover"
                src={post?.createdBy?.avatar}
                alt="avatar"
              />
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-base font-bold text-gray-800">
              {post?.createdBy?.name || post?.createdBy?.email}
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
              <span>🕒</span>
              <span>
                {post?.createdAt &&
                  dayjs(post?.createdAt).format("DD/MM/YYYY - HH:mm")}
              </span>
            </div>
          </div>
        </div>

        {post?.createdBy?.email === userProfile?.email && (
          <Dropdown
            overlay={
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 min-w-[140px]">
                <button
                  onClick={() => handleOpenModal(post._id)}
                  className="w-full py-3 px-4 text-red-600 hover:bg-red-50 transition-all flex items-center gap-2 font-medium"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Xóa bài đăng</span>
                </button>
              </div>
            }
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="p-2 hover:bg-white/50 rounded-lg transition-all">
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className="text-xl text-gray-600 hover:text-gray-800"
              />
            </button>
          </Dropdown>
        )}
      </div>

      {/* Content */}
      <div className="p-5 text-gray-700 leading-relaxed">
        {HTMLReactParser(post?.content || "")}
      </div>

      {/* Quizzes Section */}
      {post?.quizzes && post?.quizzes?.length > 0 && (
        <div className="p-5 pt-0">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <p className="text-lg font-bold text-amber-700">
                Đề thi đính kèm
              </p>
              <span className="ml-auto bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                {post?.quizzes?.length} đề
              </span>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {post?.quizzes?.map((quiz: QuizDetailRecord, index: number) => (
                <button
                  key={index}
                  onClick={() =>
                    router.push(`${quizRouter.REVIEW_QUIZ}/${quiz.slug}`)
                  }
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-primary"
                >
                  <div className="relative overflow-hidden">
                    <LazyImage
                      src={quiz.thumb}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primabg-primary transition-colors">
                      {quiz.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPostCard;
