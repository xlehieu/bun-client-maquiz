'use client';
import {
    faReply,
    faUser,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faLock,
    faUnlock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import LoadingComponent from '@/components/UI/LoadingComponent';
import * as UserManagementService from '@/api/admin/usermanagement.service';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ADMIN_USER_QUERY_KEY } from '@/features/admin/adminUser.query';
import { AdminUserRecord } from '@/@types/adminUsers.type';
import ButtonBack from '@/components/UI/ButtonBack';
const QUERY_KEY_USER_DETAIL = 'QUERY_KEY_USER_DETAIL';
const UserDetail = () => {
    const { userId } = useParams();
    const router = useRouter();
    const [userDetail, setUserDetail] = useState<{
        address: string;
        avatar: string;
        email: string;
        name: string;
        isActive: boolean;
        phone: string;
    } | null>(null);
    const queryClient = useQueryClient();
    const userDetailQuery = useQuery({
        queryKey: [QUERY_KEY_USER_DETAIL, userId],
        queryFn: () => UserManagementService.getAdminUserDetail(userId as string),
    });

    useEffect(() => {
        if (userDetailQuery.data) {
            setUserDetail(userDetailQuery.data.data.data);
        } else if (userDetailQuery.isError) {
            message.error('Đã có lỗi xảy ra khi tải thông tin');
        }
    }, [userDetailQuery.data, userDetailQuery.isError]);
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
        changeActiveUserMutation.mutate(id, {
            onSettled() {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEY_USER_DETAIL, userId],
                });
            },
        });
    };
    return (
        <section className="max-w-4xl mx-auto mt-10 px-4">
            {/* Header & Back Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                    Chi tiết người dùng
                </h2>
                <ButtonBack />
            </div>

            <Spin spinning={userDetailQuery.isLoading}>
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="md:flex">
                        {/* Sidebar: Avatar & Basic Info */}
                        <div className="md:w-1/3 bg-gray-50 p-8 flex flex-col items-center border-r border-gray-100">
                            <div className="relative group">
                                <img
                                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                                    alt={userDetail?.name}
                                    src={userDetail?.avatar || 'https://via.placeholder.com/150'}
                                />
                                <div className="absolute inset-0 rounded-full bg-black/5 group-hover:bg-transparent transition-all"></div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 text-center">{userDetail?.name}</h3>
                            <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                                Thành viên
                            </span>
                        </div>

                        {/* Details Content */}
                        <div className="md:w-2/3 p-8">
                            <div className="grid grid-cols-1 gap-6">
                                <DetailItem icon={faUser} label="Họ và tên" value={userDetail?.name} />
                                <DetailItem icon={faEnvelope} label="Địa chỉ Email" value={userDetail?.email} />
                                <DetailItem
                                    icon={faPhone}
                                    label="Số điện thoại"
                                    value={userDetail?.phone || 'Chưa cập nhật'}
                                />
                                <DetailItem
                                    icon={faMapMarkerAlt}
                                    label="Địa chỉ"
                                    value={userDetail?.address || 'Chưa cập nhật'}
                                />
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-100 flex gap-3">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
                                    Chỉnh sửa hồ sơ
                                </button>
                                <button
                                    onClick={() => handleChangeActiveUser(userId as string)}
                                    className={`px-5 py-2.5 border font-semibold rounded-xl transition-all duration-200 ${
                                        userDetail?.isActive
                                            ? 'border-red-200 text-red-600 hover:bg-red-50' // Style khi tài khoản đang Active -> hiện nút Khóa
                                            : 'border-green-200 text-green-600 hover:bg-green-50' // Style khi tài khoản đang Khoá -> hiện nút Mở
                                    }`}
                                >
                                    {userDetail?.isActive ? (
                                        <span>
                                            <FontAwesomeIcon icon={faLock} className="mr-2" />
                                            Khóa tài khoản
                                        </span>
                                    ) : (
                                        <span>
                                            <FontAwesomeIcon icon={faUnlock} className="mr-2" />
                                            Kích hoạt lại
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        </section>
    );
};

// Component con để tái sử dụng layout từng dòng thông tin
const DetailItem = ({ icon, label, value }: { icon: any; label: string; value?: string }) => (
    <div className="flex items-start gap-4">
        <div className="mt-1 bg-gray-100 p-2.5 rounded-lg text-gray-500 w-10 h-10 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={icon} />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-lg font-semibold text-gray-700">{value}</p>
        </div>
    </div>
);

export default UserDetail;
