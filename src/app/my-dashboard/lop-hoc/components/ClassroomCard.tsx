"use client";
import { classroomImageFallback } from "@/common/constants";
import { USER_DASHBOARD_ROUTER } from "@/config/routes";
import LazyImage from "@/components/UI/LazyImage";
import { Button, Tooltip } from "antd";
import { ClassroomDetailRecord } from "@/@types/classroom.type";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faUserGraduate,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const ClassroomCard = ({
  classroom,
  isMyClassroom = false,
}: {
  classroom: ClassroomDetailRecord;
  isMyClassroom?: boolean;
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`${USER_DASHBOARD_ROUTER.CLASSROOM}/${classroom?.classCode}`);
  };

  return (
    <div className="group w-full bg-white transition-all duration-300 border border-slate-100 rounded-[24px] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 relative h-64 flex flex-col">
      {/* THUMBNAIL AREA */}
      <div className="relative h-28 w-full overflow-hidden shrink-0">
        <LazyImage
          alt={classroom?.name ?? "classroom image"}
          src={classroom?.thumb || classroomImageFallback}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay gradient để text bên trên dễ đọc hơn (nếu có) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Badge phân loại lớp học */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm z-10 ${
            isMyClassroom ? "bg-camdat" : "bg-primary"
          }`}
        >
          <FontAwesomeIcon
            icon={isMyClassroom ? faChalkboardTeacher : faUserGraduate}
            className="mr-1.5"
          />
          {isMyClassroom ? "Owner" : "Student"}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="relative p-4 flex flex-col flex-1">
        {/* Avatar giáo viên - đặt lệch lên trên nửa thumbnail */}
        {classroom?.teacher?.avatar && (
          <div className="absolute -top-7 right-4 p-1 bg-white rounded-full shadow-md z-10 transition-transform group-hover:scale-110 duration-300">
            <LazyImage
              alt={classroom?.teacher?.name ?? "teacher image"}
              src={classroom?.teacher?.avatar}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        )}

        {/* Tên lớp học */}
        <div className="mt-2 pr-10">
          <Tooltip title={classroom?.name}>
            <h3
              onClick={handleNavigate}
              className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight hover:text-primary cursor-pointer transition-colors"
            >
              {classroom?.name}
            </h3>
          </Tooltip>
          <p className="text-xs font-medium text-slate-400 mt-1 tracking-tight">
            Mã lớp:{" "}
            <span className="text-slate-600 font-bold uppercase">
              {classroom?.classCode}
            </span>
          </p>
        </div>

        {/* Footer Card */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
          <div className="flex flex-col">
            {!isMyClassroom && (
              <>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter leading-none">
                  Giảng viên
                </span>
                <span className="text-sm font-bold text-slate-600 line-clamp-1 italic">
                  {classroom?.teacher?.name}
                </span>
              </>
            )}
            {isMyClassroom && (
              <span className="text-xs font-bold text-camdat italic">
                Đang quản lý
              </span>
            )}
          </div>

          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={
              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            }
            onClick={handleNavigate}
            className={`shadow-lg transition-all duration-300 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 ${
              isMyClassroom ? "bg-camdat border-camdat" : "bg-primary"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassroomCard;
