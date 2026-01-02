"use client";
import MAIN_ROUTE, { USER_DASHBOARD_ROUTER } from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetUser } from "@/redux/slices/user.slice";
import { persistor } from "@/redux/store";
import {
  DashboardOutlined,
  IdcardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LazyImage from "../LazyImage";
type UserDropdownProps = {
  isDashboard?: boolean;
};
const UserDropdown = ({ isDashboard = false }: UserDropdownProps) => {
  const router = useRouter();
  // dropdown props
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector((state) => state.user);
  const handleLogOut = async () => {
    persistor.purge();
    dispatch(resetUser());
    router.replace(MAIN_ROUTE.LOGIN);
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link href={MAIN_ROUTE.PROFILE}>
          <IdcardOutlined className="pr-2" />
          Thông tin tài khoản
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link href={USER_DASHBOARD_ROUTER.MY_DASHBOARD}>
          <DashboardOutlined className="pr-2" />
          My Dashboard
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <button onClick={handleLogOut}>
          <LogoutOutlined className="pr-2" />
          Đăng xuất
        </button>
      ),
    },
  ];
  return (
    <Dropdown placement="bottomRight" menu={{ items }}>
      <div
        className={`
    flex items-center gap-3 cursor-pointer group 
    px-3 py-1.5 rounded-full transition-all duration-300
    ${
      isDashboard
        ? "hover:bg-white/10"
        : "hover:bg-primary/5 border border-transparent hover:border-primary/10"
    }
`}
      >
        {/* Avatar Section */}
        <div className="relative">
          <div
            className={`
            relative p-[2px] rounded-full transition-transform duration-300 group-hover:scale-105
            ${
              isDashboard
                ? "bg-white/20"
                : "bg-gradient-to-tr from-primary/20 to-secondary/20"
            }
        `}
          >
            {userProfile?.avatar ? (
              <LazyImage
                className="rounded-full w-9 h-9 object-cover border-2 border-white shadow-sm"
                src={userProfile?.avatar}
                alt={userProfile?.name}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm">
                <i className="fa-solid fa-user text-slate-400 text-sm"></i>
              </div>
            )}
          </div>
          {/* Online Status Dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
        </div>

        {/* Text Section */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex flex-col items-start leading-tight">
            <span
              className={`text-[14px] font-bold tracking-wide transition-colors
                ${isDashboard ? "text-white" : "text-slate-800"}
            `}
            >
              {userProfile?.name?.split(" ").pop() || "Tài khoản"}
            </span>
            <span
              className={`text-[11px] font-medium opacity-70
                ${isDashboard ? "text-slate-200" : "text-slate-500"}
            `}
            >
              Sẵn sàng
            </span>
          </div>

          {/* FontAwesome Chevron Icon */}
          <i
            className={`
            fa-solid fa-chevron-down text-[10px] transition-all duration-300
            group-hover:translate-y-[2px]
            ${
              isDashboard
                ? "text-white/70"
                : "text-slate-400 group-hover:text-primary"
            }
        `}
          ></i>
        </div>
      </div>
    </Dropdown>
  );
};

export default UserDropdown;
