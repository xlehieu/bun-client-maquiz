/*eslint-disable*/
import React, { useState } from 'react';
import Link from 'next/link';
import NotificationDropdown from '@/components/UI/Dropdowns/NotificationDropdown';
import UserDropdown from '@/components/UI/Dropdowns/UserDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faFaceSmile, faChalkboardTeacher, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import MaquizLogo from '@/components/UI/MaquizLogo';
import { adminRouter } from '@/config';
import BlurBackground from '@/components/UI/BlurBackground';
import { useRouter } from 'next/navigation';
const items = [
    {
        label: 'Quản lý',
        children: [
            {
                key: '1.1',
                label: 'Danh sách user',
                icon: faFaceSmile,
                to: adminRouter.userList,
            },
            {
                key: '1.2',
                label: 'Danh sách lớp học',
                icon: faChalkboardTeacher,
                to: adminRouter.classroomList,
            },
            {
                key: '1.3',
                label: 'Danh sách đề thi',
                icon: faBookOpen,
                to: adminRouter.quizList,
            },
        ],
    },
];

export default function AdminSidebar() {
    const router = useRouter();
    const [collapseShow, setCollapseShow] = React.useState('hidden');
    const [isShowBg, setIsShowBg] = useState(false);
    return (
        <>
            <aside className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-30 py-4 px-6">
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
                        <MaquizLogo className={'w-44'} />
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
                            'md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-20 overflow-y-auto overflow-x-hidden items-center flex-1 rounded ' +
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

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                            {items.map((item, index) => (
                                <li key={index}>
                                    <div className="text-sm pl-2 text-gray-400 py-2">{item.label}</div>
                                    <div>
                                        <ul className="flex flex-col">
                                            {item.children.map((child, i) => (
                                                <li className="flex" key={i}>
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            router.push(child.to);
                                                        }}
                                                        className={`pl-8 text-gray-700 flex-1 text-base py-3 px-2 text-left hover:text-primary ease-linear duration-200 transition-all hover:bg-opacity-10 hover:bg-slate-600 hover:rounded-3xl `}
                                                    >
                                                        <FontAwesomeIcon className="mr-2" icon={child.icon} />
                                                        {child.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>
            <BlurBackground isActive={isShowBg} onClick={() => setIsShowBg(false)} />
        </>
    );
}
