import { ExamAttemptRecord } from '@/@types/examAttempt.type';
import { ExamRecordItem } from './ExamAttempItem';

type Props = {
    records: ExamAttemptRecord[];
};

export const ExamHistoryList = ({ records }: Props) => {
    if (records.length === 0) {
        return <div className="p-8 text-center text-gray-500">Chưa có lượt thi nào.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border">
            <div className="bg-gray-100 p-4 font-bold border-b text-gray-700">Danh sách bài thi ({records.length})</div>

            <div className="divide-y divide-gray-200">
                {records.map((item) => (
                    // Sử dụng key duy nhất để React quản lý danh sách tốt hơn
                    <ExamRecordItem key={item.classExamId + item.user._id} record={item} />
                ))}
            </div>
        </div>
    );
};
