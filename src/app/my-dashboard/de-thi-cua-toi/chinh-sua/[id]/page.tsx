"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faClipboard,
  faQuestionCircle,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import QuizProvider from "@/context/QuizContext";
import EditGeneralInformationTab from "./components/EditGeneralInformationTab";
import EditQuestionQuizTab from "./components/EditQuestionQuizTab";
import EditDetailInformationTab from "./components/EditDetailInformationTab";
const EditMyQuizPage = () => {
  const router = useRouter();
  const [currentKey, setCurrentKey] = useState<number>(1); // key của tabs
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const tabs = [
    {
      key: 1,
      label: "Thông tin chung",
      icon: faCircleInfo,
    },
    {
      key: 2,
      label: "Các câu hỏi",
      icon: faQuestionCircle,
    },
    //   {
    //       key: 3,
    //       label: 'Nâng cao',
    //       icon: faClipboard,
    //   },
  ];
  const tabItems: Record<number, React.JSX.Element> = {
    1: <EditGeneralInformationTab />,
    2: <EditQuestionQuizTab />,
    //   3: <EditDetailInformationTab />,
  };

  return (
    <QuizProvider>
      <div className="ml-2 py-2 flex justify-between">
        <h4 className="font-semibold">Chỉnh sửa đề thi</h4>
        <button
          className="bg-red-500 text-white rounded-lg px-2"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon className="mr-1" icon={faReply} />
          Trở lại
        </button>
      </div>
      <div className="w-full bg-white px-5 py-5 rounded-md shadow-sm">
        <div className="flex gap-9">
          {tabs.map((item, index) => (
            <div
              key={item.key}
              className={`${
                currentKey === item.key
                  ? "border-b-4 border-b-primary text-primary cursor-default"
                  : "hover:opacity-50 cursor-pointer border-b-4 border-b-white"
              } flex flex-wrap items-center text-lg pb-2 px-1 transition-all duration-200 ease-linear text-gray-700`}
              onClick={() => setCurrentKey(item.key)}
            >
              <FontAwesomeIcon className="block" icon={item.icon} />
              <p className="pl-2">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-9 w-full">{tabItems?.[currentKey] ?? <></>}</div>{" "}
      {/* <BlurBackground isActive={isActiveQuizPartNameDialog} /> */}
    </QuizProvider>
  );
};

export default EditMyQuizPage;
