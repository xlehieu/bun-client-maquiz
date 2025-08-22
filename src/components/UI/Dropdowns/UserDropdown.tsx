import React, { createRef } from 'react';
import { createPopper } from '@popperjs/core';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import siteRouter, { userDashboardRouter } from '@/config';

const UserDropdown = ({ user }: any) => {
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = createRef<HTMLAnchorElement>();
    const popoverDropdownRef = createRef<HTMLDivElement>();
    const openDropdownPopover = () => {
        if (btnDropdownRef.current && popoverDropdownRef.current)
            createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
                placement: 'bottom-end',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 5], // [horizontal, vertical]
                        },
                    },
                ],
            });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    return (
        <>
            <Tippy
                trigger="click"
                interactive
                placement="bottom-end"
                content={
                    <div className="flex flex-col shadow bg-white" tabIndex={-1}>
                        <Link
                            className="text-gray-600 duration-200 px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
                            href={siteRouter.profile}
                        >
                            <FontAwesomeIcon icon={faUser} className="pr-2" />
                            Thông tin tài khoản
                        </Link>
                        <Link
                            href={userDashboardRouter.myDashboard}
                            className="text-gray-600 duration-200 px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
                        >
                            <FontAwesomeIcon icon={faGauge} className="pr-2" />
                            Dashboard
                        </Link>
                        <button
                            className="text-start px-2 py-2 text-gray-600 duration-200 hover:rounded hover:bg-black hover:bg-opacity-5"
                            onClick={() => {}}
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} className="pr-2" />
                            Đăng xuất
                        </button>
                    </div>
                }
            >
                <div className="flex justify-between items-center">
                    {user?.avatar && <img className="rounded-full mr-1 w-8 h-8" src={user?.avatar} alt={user?.name} />}
                    <p className="text-lg text-primary ">{user?.name}</p>
                </div>
            </Tippy>
            {/* <a
                className="text-blue-500 block"
                href="#pablo"
                ref={btnDropdownRef}
                onClick={(e) => {
                    e.preventDefault();
                    dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                }}
            >
                <div className="items-center flex">
                    <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                        <img
                            alt="..."
                            className="w-full rounded-full align-middle border-none shadow-lg"
                            src={require('assets/img/team-1-800x800.jpg').default}
                        />
                    </span>
                </div>
            </a>
            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? 'block ' : 'hidden ') +
                    'bg-white text-base z-50 py-2 list-none text-left rounded shadow-lg min-w-48'
                }
            >
                <a
                    href="#pablo"
                    className={
                        'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
                    }
                    onClick={(e) => e.preventDefault()}
                >
                    Action
                </a>
                <a
                    href="#pablo"
                    className={
                        'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
                    }
                    onClick={(e) => e.preventDefault()}
                >
                    Another action
                </a>
                <a
                    href="#pablo"
                    className={
                        'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
                    }
                    onClick={(e) => e.preventDefault()}
                >
                    Something else here
                </a>
                <div className="h-0 my-2 border border-solid border-blueGray-100" />
                <a
                    href="#pablo"
                    className={
                        'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
                    }
                    onClick={(e) => e.preventDefault()}
                >
                    Seprated link
                </a>
            </div> */}
        </>
    );
};

export default UserDropdown;
