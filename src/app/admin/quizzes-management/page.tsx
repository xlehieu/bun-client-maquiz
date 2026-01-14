'use client';

import * as QuizManagementService from '@/api/admin/quizmanagement.service'; // Giả định service của bạn
import ButtonBack from '@/components/UI/ButtonBack';
import { ADMIN_ROUTER } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAdminQuizFilter } from '@/redux/slices/admin.slice'; // Giả định slice filter của bạn
import { SearchOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, Empty, Switch, Table, Input, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { ADMIN_QUIZ_QUERY_KEY, useAdminQuizList } from '@/features/admin/adminQuiz.query';
import { AdminQuizRecord } from '@/@types/adminQuiz.type';

const QuizManagement = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Lấy filter từ Redux (bạn thay đổi logic filter tùy theo slice của mình)
    const { adminQuizFilter } = useAppSelector((state) => state.admin);
    const { data: dataQuizList, isLoading } = useAdminQuizList(adminQuizFilter);

    // Mutation thay đổi trạng thái ẩn/hiện của Quiz (Admin disable)
    const toggleDisableQuizMutation = useMutation({
        mutationFn: (id: string) => QuizManagementService.changeQuizDisabled(id),
        onSuccess: () => {
            toast.success('Cập nhật trạng thái bộ đề thành công');
            queryClient.invalidateQueries({
                queryKey: [ADMIN_QUIZ_QUERY_KEY.ADMIN_QUIZ_QUERY_KEY_LIST],
            });
        },
    });

    const handleToggleStatus = (id: string) => {
        toggleDisableQuizMutation.mutate(id);
    };

    const handleClickQuiz = (quizId: string) => {
        router.push(`${ADMIN_ROUTER.QUIZ_LIST}/${quizId}`);
    };

    const handleChangePagination = (page: number, pageSize: number) => {
        dispatch(
            setAdminQuizFilter({
                skip: (page - 1) * pageSize,
                limit: pageSize,
            }),
        );
    };

    const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
    const searchDebounce = useDebounce(searchValue, 600);

    useEffect(() => {
        dispatch(
            setAdminQuizFilter({
                keyword: searchDebounce,
            }),
        );
    }, [searchDebounce, dispatch]);

    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value || undefined);
    }, []);

    const columns: ColumnsType<AdminQuizRecord> = [
        {
            title: 'Bộ đề',
            dataIndex: 'name',
            key: 'quiz',
            className: 'max-w-[300px]',
            width: 500,
            render: (_: any, record: AdminQuizRecord) => (
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleClickQuiz(record._id)}>
                    <Avatar
                        shape="square"
                        size={48}
                        src={record.thumb}
                        icon={<FileTextOutlined />}
                        className="border border-slate-200"
                    />
                    <div className="max-w-[200px]">
                        <p className="font-bold text-slate-700 text-sm uppercase">{record.name || 'Không có tên'}</p>
                        <p className="text-xs text-slate-400 font-medium">Môn: {record.subject}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Tác giả',
            dataIndex: 'userInfo',
            key: 'author',
            render: (user: AdminQuizRecord['userInfo']) => (
                <div className="flex items-center gap-2">
                    <Avatar size={24} src={user?.avatar} icon={<UserOutlined />} />
                    <span className="text-xs text-slate-600 font-medium">{user?.name || 'Ẩn danh'}</span>
                </div>
            ),
        },
        {
            title: 'Thông số',
            key: 'stats',
            align: 'center',
            render: (_: any, record: AdminQuizRecord) => (
                <div className="flex flex-col items-center">
                    <Tag color="blue" className="m-0 mb-1">
                        {record.questionCount} câu hỏi
                    </Tag>
                    <span className="text-[10px] text-slate-400">{record.accessCount} lượt xem</span>
                </div>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY') : '---'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isAdminDisabled',
            key: 'status',
            align: 'center',
            render: (isDisabled: boolean, record: AdminQuizRecord) => (
                <div className="flex justify-center items-center gap-3">
                    <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            !isDisabled ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}
                    >
                        {!isDisabled ? 'HOẠT ĐỘNG' : 'BỊ KHÓA'}
                    </span>
                    <Switch checked={!isDisabled} onChange={() => handleToggleStatus(record._id)} />
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

                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-2">Quản lý Bộ đề</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                <span className="text-lg font-semibold text-slate-600">
                                    {dataQuizList?.pagination.total || 0} bộ đề thi
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <div className="w-full max-w-sm">
                        <Input
                            prefix={<SearchOutlined className="text-slate-400" />}
                            placeholder="Tìm kiếm bộ đề..."
                            className="rounded-xl h-10 shadow-sm"
                            allowClear
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent"></div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={dataQuizList?.quizzes || []}
                    loading={isLoading}
                    pagination={{
                        current: dataQuizList?.pagination.currentPage,
                        pageSize: adminQuizFilter.limit,
                        total: dataQuizList?.pagination.total,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50, 100],
                        onChange: handleChangePagination,
                    }}
                    locale={{
                        emptyText: <Empty description="Không tìm thấy bộ đề nào" />,
                    }}
                />
            </div>
        </div>
    );
};

export default QuizManagement;
