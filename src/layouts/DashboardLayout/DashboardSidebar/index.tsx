/*eslint-disable*/
'use client';
import BlurBackground from '@/components/UI/BlurBackground';
import NotificationDropdown from '@/components/UI/Dropdowns/NotificationDropdown';
import UserDropdown from '@/components/UI/Dropdowns/UserDropdown';
import MaquizLogo from '@/components/UI/MaquizLogo';
import { ADMIN_ROUTER, USER_DASHBOARD_ROUTER } from '@/config/routes';
import { useAppSelector } from '@/redux/hooks';
import {
    faBars,
    faBookOpen,
    faChalkboard,
    faChalkboardUser,
    faClockRotateLeft,
    faFileLines,
    faHouse,
    faLayerGroup,
    faPeopleRoof,
    faTimes,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { memo, useMemo, useState } from 'react';

const DashboardSidebar = () => {
    const router = useRouter();
    const pathName = usePathname();
    // const user = useSelector((state: any) => state.user);
    // if (!setItem.has('3') && user.isAdmin) {
    //     console.log(setItem);
    //     setItem.add('3');
    //     items.push(sidebarAdmin);
    // }
    const { userProfile } = useAppSelector((state) => state.user);
    const [collapseShow, setCollapseShow] = React.useState('hidden');
    const [isShowBg, setIsShowBg] = useState(false);
    const [keyActive, setKeyActive] = useState<string | null>(pathName.split('/')?.slice?.(1)?.[1] || 'my-library');
    // region List sidebar
    const items = useMemo(
        () => [
            {
                label: 'Cá nhân',
                children: [
                    {
                        key: USER_DASHBOARD_ROUTER.MY_DASHBOARD,
                        label: 'Thư viện của tôi',
                        icon: faHouse,
                        to: USER_DASHBOARD_ROUTER.MY_DASHBOARD,
                        keyActive: 'my-library',
                    },
                    {
                        key: USER_DASHBOARD_ROUTER.HISTORY_ACCESS,
                        label: 'Truy cập gần đây',
                        icon: faClockRotateLeft,
                        to: USER_DASHBOARD_ROUTER.HISTORY_ACCESS,
                        keyActive: 'truy-cap-gan-day',
                    },
                ],
                key: '1',
            },
            {
                key: '2',
                label: 'Quản lý',
                children: [
                    {
                        key: USER_DASHBOARD_ROUTER.MYQUIZ,
                        label: 'Đề thi',
                        icon: faBookOpen,
                        to: USER_DASHBOARD_ROUTER.MYQUIZ,
                        keyActive: 'de-thi-cua-toi',
                    },
                    {
                        key: USER_DASHBOARD_ROUTER.CLASSROOM,
                        label: 'Lớp học',
                        icon: faChalkboardUser,
                        to: USER_DASHBOARD_ROUTER.CLASSROOM,
                        keyActive: 'lop-hoc',
                    },
                ],
            },
            userProfile?.isAdmin
                ? {
                      label: 'Admin',
                      children: [
                          {
                              key: ADMIN_ROUTER.USER_LIST,
                              label: 'Quản lý người dùng',
                              icon: faUsers,
                              to: ADMIN_ROUTER.USER_LIST,
                              keyActive: 'users-management',
                          },
                          {
                              key: ADMIN_ROUTER.CLASSROOM_LIST,
                              label: 'Quản lý các lớp học',
                              icon: faChalkboard,
                              to: ADMIN_ROUTER.CLASSROOM_LIST,
                              keyActive: 'classrooms-management',
                          },
                          {
                              key: ADMIN_ROUTER.QUIZ_LIST,
                              label: 'Quản lý các bài trắc nghiệm',
                              icon: faFileLines,
                              to: ADMIN_ROUTER.QUIZ_LIST,
                              keyActive: 'quizzes-management',
                          },
                          {
                              key: ADMIN_ROUTER.TAI_NGUYEN_HE_THONG,
                              label: 'Tài nguyên hệ thống',
                              icon: faLayerGroup,
                              to: ADMIN_ROUTER.TAI_NGUYEN_HE_THONG,
                              keyActive: 'tai-nguyen-he-thong',
                          },
                      ],
                      key: 'admin',
                  }
                : {},
        ],
        [userProfile?._id],
    );
    // const setItem = new Set(items.map((item) => item.key));

    return (
        <>
            <aside className="bg-white flex flex-wrap items-center justify-between relative z-30 py-4 px-6">
                <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                    {/* Toggler */}
                    <button
                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        type="button"
                        onClick={() => {
                            setCollapseShow('bg-white m-2 py-3 px-6');
                            setIsShowBg(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    {/* Brand */}
                    <Link
                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                        href="/"
                    >
                        <MaquizLogo className={'w-44 hover:scale-120 transition-all duration-300'} />
                    </Link>
                    {/* User */}
                    <ul className="md:hidden items-center flex flex-wrap list-none">
                        <li className="inline-block relative">
                            <NotificationDropdown />
                        </li>
                        <li className="inline-block relative">
                            <UserDropdown />
                        </li>
                    </ul>
                    {/* Collapse */}
                    <div
                        className={
                            'md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-20 overflow-y-auto overflow-x-hidden items-center flex-1 rounded no-scrollbar ' +
                            collapseShow
                        }
                    >
                        {/* Collapse header */}
                        <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-200">
                            <div className="flex flex-wrap">
                                <div className="w-6/12">
                                    <MaquizLogo className={'w-52'} />
                                </div>
                                <div className="w-6/12 flex justify-end">
                                    <button
                                        type="button"
                                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                        onClick={() => {
                                            setCollapseShow('hidden');
                                            setIsShowBg(false);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Form */}
                        <form className="mt-6 mb-4 md:hidden">
                            <div className="mb-3 pt-0">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="border-0 px-3 py-2 h-12 border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                                />
                            </div>
                        </form>

                        {/* Divider */}
                        <hr className="my-4 md:min-w-full" />
                        {/* Navigation */}

                        {/* NAVIGATION LIST */}
                        <ul className="md:flex-col md:min-w-full flex flex-col list-none gap-8 mt-4 no-scrollbar">
                            {items.map((item, index) => (
                                <li key={index} className="md:min-w-full">
                                    {/* Menu Group Label - Thiết kế lại cho chuyên nghiệp hơn */}
                                    <div className="flex items-center px-4 mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
                                            {item?.label || ''}
                                        </span>
                                        <div className="flex-1 h-[1px] bg-slate-100 ml-3 opacity-50" />
                                    </div>

                                    {/* Sub-menu Items */}
                                    <ul className="flex flex-col list-none gap-1.5 no-scrollbar">
                                        {item?.children?.map((child, i) => {
                                            const isActive = child.keyActive === keyActive;
                                            return (
                                                <li className="flex w-full px-2 group" key={i}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setKeyActive(child.keyActive);
                                                            router.push(child.to);
                                                        }}
                                                        className={`group w-full flex items-center px-4 py-3 rounded-[18px] transition-all duration-300 relative group-hover:scale-110 ${
                                                            isActive
                                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                                : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-9 h-9 flex items-center justify-center rounded-xl mr-3 transition-all duration-300 group-hover:rotate-12  ${
                                                                isActive
                                                                    ? 'bg-white/20 scale-110'
                                                                    : 'bg-slate-50 group-hover:bg-primary/10 group-hover:scale-110'
                                                            }`}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={child.icon}
                                                                className={`text-sm ${
                                                                    isActive
                                                                        ? 'text-white'
                                                                        : 'text-slate-400 group-hover:text-primary'
                                                                }`}
                                                            />
                                                        </div>

                                                        {/* Label text */}
                                                        <span
                                                            className={`text-sm font-bold text-left transition-colors ${
                                                                isActive ? 'text-white' : 'text-slate-600'
                                                            }`}
                                                        >
                                                            {child.label}
                                                        </span>

                                                        {/* Active Indicator Bar - Thanh nhỏ bên phải khi active */}
                                                        {isActive && (
                                                            <div className="absolute right-3 w-1 h-4 rounded-full bg-white/40 animate-in fade-in zoom-in duration-300" />
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>
            <BlurBackground isActive={isShowBg} onClick={() => setIsShowBg(false)} />
        </>
    );
};
export default memo(DashboardSidebar);
