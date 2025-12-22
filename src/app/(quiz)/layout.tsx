"use client";
import React, { ReactNode } from "react";
import Link from "next/link";
import MaquizLogo from "@/components/UI/MaquizLogo";
import siteRouter from "@/config";
import UserInfoHeader from "./components/UserInfoHeader";
import UserDropdown from "@/components/UI/Dropdowns/UserDropdown";
const SubLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-[#fcfcfc] select-none min-h-svh">
      <header className="w-full bg-white md:h-20 md:shadow-md">
        <div className="container px-0 md:px-5 mx-0 md:mx-auto hidden md:flex justify-between items-center h-full">
          <Link href={siteRouter.home} className="w-40 h-full">
            <MaquizLogo className={"w-full h-full object-contain"} />
          </Link>
          {/* <div className="hidden md:flex space-x-7 justify-between items-center">
                        <button onClick={toggleExpand}>
                            <FontAwesomeIcon icon={faExpand} className="text-primary" />
                        </button>
                        <button>
                            <FontAwesomeIcon icon={faMoon} className="text-primary" />
                        </button>
                        {user.email ? ( // Menu tippy
                            <Tippy
                                interactive
                                placement="bottom-end"
                                render={(attrs) => (
                                    <div className="flex flex-col shadow bg-white" tabIndex={-1} {...attrs}>
                                        <Link
                                            className="text-black px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
                                            href={siteRouter.profile}
                                        >
                                            Thông tin tài khoản
                                        </Link>
                                        <Link
                                            href={userDashboardRouter.myDashboard}
                                            className="text-black px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
                                        >
                                            Dashboard
                                        </Link>
                                        <button className="text-start px-2 py-2 text-black hover:rounded hover:bg-black hover:bg-opacity-5">
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            >
                                <div className="flex justify-between items-center">
                                    {user?.avatar && (
                                        <img
                                            className="rounded-full mr-1 w-8 h-8"
                                            src={user?.avatar}
                                            alt={user?.name}
                                        />
                                    )}
                                </div>
                            </Tippy>
                        ) : (
                            <Link
                                className="w-24 flex items-center justify-center text-primary text-lg duration-300 hover:text-secondary"
                                href={siteRouter.signIn}
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div> */}
          <UserDropdown />
        </div>
      </header>
      <div className="w-full">
        <div className="mx-auto px-2 md:px-5 mt-5">{children}</div>
      </div>
    </div>
  );
};

export default SubLayout;
