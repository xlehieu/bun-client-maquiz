'use client';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import LoadingComponent from '@/components/UI/LoadingComponent';
import * as UserManagementService from '@/services/admin/usermanagement.service';
import { useParams, useRouter } from 'next/navigation';
const UserDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [userDetail, setUserDetail] = useState<any>({});
    const userDetailQuery = useQuery({
        queryKey: ['userDetailQuery', id],
        queryFn: () => UserManagementService.getUserDetail({ id }),
    });
    useEffect(() => {
        if (userDetailQuery.data) {
            setUserDetail(userDetailQuery.data);
        } else if (userDetailQuery.isError) {
            message.error('đã có lỗi xảy ra');
        }
    }, [userDetailQuery.data]);
    return (
        <section className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden">
            <button onClick={() => router.back()} className="rounded-lg float-end bg-red-600 px-2 py-1 text-white">
                <FontAwesomeIcon icon={faReply} className="mr-1" />
                Quay lại
            </button>
            {userDetailQuery.isLoading ? (
                <LoadingComponent />
            ) : (
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Thông tin người dùng</h2>
                    <table className="w-full text-sm text-left text-gray-700">
                        <tbody>
                            <tr className="border-b">
                                <th className="py-2 pr-4 font-medium text-gray-600">Họ và tên:</th>
                                <td className="py-2">{userDetail.name}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="py-2 pr-4 font-medium text-gray-600">Email:</th>
                                <td className="py-2">{userDetail.email}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="py-2 pr-4 font-medium text-gray-600">Số điện thoại:</th>
                                <td className="py-2">{userDetail.phone}</td>
                            </tr>
                            {userDetail.address && (
                                <tr className="border-b">
                                    <th className="py-2 pr-4 font-medium text-gray-600">Địa chỉ:</th>
                                    <td className="py-2">{userDetail.address}</td>
                                </tr>
                            )}
                            {userDetail.avatar && (
                                <tr>
                                    <th className="py-2 pr-4 font-medium text-gray-600">Ảnh:</th>
                                    <td className="py-2">
                                        <img className="max-w-36" alt={userDetail.name} src={userDetail.avatar} />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default UserDetail;
