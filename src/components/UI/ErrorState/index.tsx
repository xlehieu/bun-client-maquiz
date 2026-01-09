import { Button, Typography } from 'antd';
import { WarningTwoTone, ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    onBack?: () => void;
}

const ErrorState = ({
    title = 'Đã có lỗi xảy ra',
    description = 'Hệ thống không thể tải dữ liệu bài thi. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.',
    onRetry,
    onBack,
}: ErrorStateProps) => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-white rounded-3xl shadow-sm border border-red-50">
            {/* Icon với hiệu ứng nền nhạt */}
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <WarningTwoTone twoToneColor="#ff4d4f" style={{ fontSize: '48px' }} />
            </div>

            {/* Nội dung thông báo */}
            <Title level={3} className="!mb-2 text-gray-800">
                {title}
            </Title>
            <Text className="text-gray-500 max-w-md block mb-8 text-base">{description}</Text>

            {/* Nhóm nút bấm hành động */}
            <div className="flex flex-wrap gap-4 justify-center">
                {onRetry && (
                    <Button
                        icon={<ReloadOutlined />}
                        size="large"
                        onClick={onRetry}
                        className="rounded-xl border-red-200 text-red-500 hover:text-red-600 hover:border-red-600 flex items-center"
                    >
                        Thử lại
                    </Button>
                )}

                <Button
                    type="primary"
                    icon={<HomeOutlined />}
                    size="large"
                    onClick={() => {
                        if (typeof onBack === 'function') {
                            onBack();
                        } else {
                            router.back();
                        }
                    }}
                    className="rounded-xl bg-gray-800 hover:bg-black border-none flex items-center"
                >
                    Quay lại
                </Button>
            </div>
        </div>
    );
};

export default ErrorState;
