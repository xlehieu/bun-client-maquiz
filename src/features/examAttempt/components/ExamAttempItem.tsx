// ExamRecordItem.tsx

import { ExamAttemptRecord } from '@/@types/examAttempt.type';
import LazyImage from '@/components/UI/LazyImage';

export const ExamRecordItem = ({ record }: { record: ExamAttemptRecord }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
                {/* Hiển thị Avatar hoặc chữ cái đầu của tên */}
                {record?.user?.avatar ? (
                    <LazyImage src={record.user.avatar} className="w-10 h-10 rounded-full overflow-hidden" />
                ) : (
                    record?.user?.name || ''
                )}

                <div>
                    <p className="font-semibold text-gray-800">{record?.user?.name || ''}</p>
                    <p className="text-sm text-gray-500">{record?.user?.email || ''}</p>
                </div>
            </div>

            <div className="text-right">
                <p className="font-bold text-lg text-indigo-600">{record.score} điểm</p>
                <span
                    className={`text-xs px-2 py-1 rounded-full ${
                        record.status === 'submitted'
                            ? 'bg-green-100 text-green-700'
                            : record.status === 'doing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {record.status === 'doing'
                        ? 'ĐANG LÀM BÀI'
                        : record.status === 'timeout'
                        ? 'QUÁ GIỜ LÀM BÀI'
                        : 'ĐÃ NỘP BÀI'}
                </span>
            </div>
        </div>
    );
};
