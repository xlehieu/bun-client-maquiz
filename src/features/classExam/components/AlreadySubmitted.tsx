import { Button, Result, Card } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const AlreadySubmitted = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="flex items-center justify-center min-h-[60vh] p-5">
            <Card className="max-w-xl w-full shadow-2xl rounded-3xl border-none overflow-hidden">
                <Result
                    icon={<CheckCircleFilled className="!text-green-500 text-7xl" />}
                    title={<span className="text-2xl font-bold text-gray-800">Bài làm đã được ghi nhận!</span>}
                    subTitle={
                        <div className="text-gray-500 text-base px-4">
                            <p>Bạn đã hoàn thành bài kiểm tra này trước đó.</p>
                            <p>Hệ thống không cho phép thực hiện lại bài thi nhiều lần.</p>
                        </div>
                    }
                    extra={[
                        <Button
                            type="primary"
                            key="back"
                            size="large"
                            onClick={onBack}
                            className="rounded-full px-8 bg-gradient-to-r from-blue-500 to-indigo-600 border-none hover:scale-105 transition-transform h-auto py-2"
                        >
                            Quay về danh sách bài tập
                        </Button>,
                    ]}
                />
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <p className="text-sm text-gray-400">Nếu có nhầm lẫn, vui lòng liên hệ với giáo viên của bạn.</p>
                </div>
            </Card>
        </div>
    );
};
export default AlreadySubmitted;
