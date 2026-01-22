'use client';

import * as UserManagementService from '@/api/admin/usermanagement.service';
import ButtonBack from '@/components/UI/ButtonBack';
import { ADMIN_ROUTER } from '@/config/routes';
import { ADMIN_USER_QUERY_KEY, useAdminUserList } from '@/features/admin/adminUser.query';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAdminUserFilter } from '@/redux/slices/admin.slice';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, Empty, Switch, Table, Input, Button, Row } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import ModalCreateAdmin from './components/ModalCreateAdmin';

const UserManagement = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { adminUserFilter } = useAppSelector((state) => state.admin);
    const { data: dataAdminUserList, isLoading } = useAdminUserList(adminUserFilter);
    const [isOpenModalCreateAdmin, setIsOpenModalCreateAdmin] = useState(false);
    const changeActiveUserMutation = useMutation({
        mutationFn: (id: string) => UserManagementService.changeActiveUser(id),
        onSuccess: () => {
            toast.success('Cập nhật trạng thái thành công');
            queryClient.invalidateQueries({
                queryKey: [ADMIN_USER_QUERY_KEY.ADMIN_USER_QUERY_KEY_LIST],
            });
        },
    });

    const handleChangeActiveUser = (id: string) => {
        changeActiveUserMutation.mutate(id);
    };

    const handleClickUser = (userId: string) => {
        router.push(`${ADMIN_ROUTER.USER_LIST}/${userId}`);
    };

    const handleChangePagination = (page: number, pageSize: number) => {
        dispatch(
            setAdminUserFilter({
                skip: (page - 1) * pageSize,
                limit: pageSize,
            }),
        );
    };

    const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
    const searchDebounce = useDebounce(searchValue, 600);
    useEffect(() => {
        dispatch(
            setAdminUserFilter({
                name: searchDebounce,
            }),
        );
    }, [searchDebounce]);
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value || undefined);
        },
        [dispatch],
    );

    const columns: ColumnsType<any> = [
        {
            title: 'Người dùng',
            dataIndex: 'name',
            key: 'user',
            render: (_: any, user: any) => (
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleClickUser(user._id)}>
                    <Avatar size={40} src={user.avatar} icon={!user.avatar && <UserOutlined />} />
                    <div>
                        <p className="font-bold text-slate-700 uppercase text-sm">{user.name || 'N/A'}</p>
                        <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
            render: (phone: string) => phone || '---',
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (date: string) => (date ? dayjs(date).format('DD MMM, YYYY') : 'N/A'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'status',
            align: 'center',
            render: (_: any, user: any) => (
                <div className="flex justify-center items-center gap-3">
                    <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            user.isActive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}
                    >
                        {user.isActive ? 'HOẠT ĐỘNG' : 'BỊ KHÓA'}
                    </span>
                    <Switch checked={user.isActive} onChange={() => handleChangeActiveUser(user._id)} />
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* ================= HEADER ================= */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-2 ml-1">
                    <ButtonBack />
                </div>

                <div className="flex flex-col justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-2">Quản lý người dùng</h1>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                <span className="text-lg font-semibold text-slate-600">
                                    {dataAdminUserList?.pagination.total || 0} tài khoản
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <div className="flex gap-3">
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm theo tên"
                            allowClear
                            onChange={handleSearch}
                        />
                        <Button onClick={() => setIsOpenModalCreateAdmin(true)}>Thêm tài khoản Admin</Button>
                    </div>
                </div>

                <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent"></div>
            </div>

            <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={dataAdminUserList?.users || []}
                    loading={isLoading}
                    pagination={{
                        current: dataAdminUserList?.pagination.currentPage,
                        pageSize: adminUserFilter.limit,
                        total: dataAdminUserList?.pagination.total,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50, 100],
                        onChange: handleChangePagination,
                    }}
                    locale={{
                        emptyText: <Empty description="Không tìm thấy người dùng nào" />,
                    }}
                />
            </div>
            <ModalCreateAdmin isOpenModal={isOpenModalCreateAdmin} onClose={() => setIsOpenModalCreateAdmin(false)} />
        </div>
    );
};

export default UserManagement;
