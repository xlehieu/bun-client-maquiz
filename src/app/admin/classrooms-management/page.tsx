'use client';

import ButtonBack from '@/components/UI/ButtonBack';
import { ADMIN_ROUTER } from '@/config/routes';
import { useAdminClassroomList, ADMIN_CLASSROOM_QUERY_KEY } from '@/features/admin/adminClassroom.query';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Empty, Input, Switch, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { AdminClassroomRecord } from '@/@types/adminClassroom.type';
import { setAdminClassroomFilter } from '@/redux/slices/admin.slice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeClassroomDisabled } from '@/api/admin/classroommanagement.service';
import { toast } from 'sonner';

const ClassroomManagement = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { adminClassroomFilter } = useAppSelector((state) => state.admin);
    const { data, isLoading } = useAdminClassroomList(adminClassroomFilter);

    /* ================= SEARCH ================= */
    const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
    const searchDebounce = useDebounce(searchValue, 600);

    useEffect(() => {
        dispatch(
            setAdminClassroomFilter({
                keyword: searchDebounce,
            }),
        );
    }, [searchDebounce]);

    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value || undefined);
    }, []);

    /* ================= PAGINATION ================= */
    const handleChangePagination = (page: number, pageSize: number) => {
        dispatch(
            setAdminClassroomFilter({
                skip: (page - 1) * pageSize,
                limit: pageSize,
            }),
        );
    };

    const handleClickClassroom = (id: string) => {
        router.push(`${ADMIN_ROUTER.CLASSROOM_LIST}/${id}`);
    };
    const changeQuizDisabledMutation = useMutation({
        mutationFn: (id: string) => changeClassroomDisabled(id),
        onSuccess() {
            toast.success('Cập nhật trạng thái thành công');
            queryClient.invalidateQueries({ queryKey: [ADMIN_CLASSROOM_QUERY_KEY.ADMIN_USER_QUERY_KEY_LIST] });
        },
    });
    /* ================= TABLE ================= */
    const columns: ColumnsType<AdminClassroomRecord> = [
        {
            title: 'Lớp học',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => handleClickClassroom(record._id)}
                >
                    <Avatar size={44} src={record.thumb} />
                    <div>
                        <p className="font-bold text-slate-700 text-sm">{record.name}</p>
                        <p className="text-xs text-slate-400">Mã lớp: {record.classCode}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Môn học',
            dataIndex: 'subject',
            key: 'subject',
            align: 'center',
            render: (subject) => <Tag color="blue">{subject || '---'}</Tag>,
        },
        {
            title: 'Giáo viên',
            key: 'teacherInfo',
            align: 'center',
            render: (_, record) =>
                record.teacherInfo ? (
                    <div className="flex items-center justify-center gap-2">
                        <Avatar size={32} src={record.teacherInfo.avatar} icon={<UserOutlined />} />
                        <span className="text-sm font-medium">{record.teacherInfo.name}</span>
                    </div>
                ) : (
                    '---'
                ),
        },
        {
            title: 'Số học sinh',
            key: 'students',
            align: 'center',
            render: (_, record) => record.students?.length || 0,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (date: string) => (date ? dayjs(date).format('DD MMM, YYYY') : 'N/A'),
        },
        {
            title: 'Trạng thái',
            key: 'isDisabled',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-center items-center gap-3">
                    <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            !record.isAdminDisabled ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}
                    >
                        {!record.isAdminDisabled ? 'HOẠT ĐỘNG' : 'BỊ KHÓA'}
                    </span>
                    <Switch
                        checked={!record.isAdminDisabled}
                        onChange={() => changeQuizDisabledMutation.mutate(record._id)}
                    />
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
                    <div>
                        <h1 className="text-4xl font-extrabold text-primary mb-2">Quản lý lớp học</h1>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-lg font-semibold text-slate-600">
                                    {data?.pagination.total || 0} lớp học
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <div className="max-w-sm">
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm lớp học"
                            allowClear
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
            </div>

            {/* ================= TABLE ================= */}
            <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={data?.classrooms || []}
                    loading={isLoading}
                    pagination={{
                        current: data?.pagination.currentPage,
                        pageSize: adminClassroomFilter.limit,
                        total: data?.pagination.total,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50, 100],
                        onChange: handleChangePagination,
                    }}
                    locale={{
                        emptyText: <Empty description="Không có lớp học nào" />,
                    }}
                />
            </div>
        </div>
    );
};

export default ClassroomManagement;
