'use client';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { faClock, faStar } from '@fortawesome/free-regular-svg-icons';
import {
    faBookOpenReader,
    faChartSimple,
    faFilePdf,
    faHeart,
    faPlayCircle,
    faQuestionCircle,
    faGraduationCap,
    faTags,
} from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined, SettingOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import { quizRouter } from '@/config/routes';
import { Form, Modal, Select, Switch, Tooltip } from 'antd';
import { toast } from 'sonner';
import LazyImage from '@/components/UI/LazyImage';
import useMutationHooks from '@/hooks/useMutationHooks';
import * as UserService from '@/api/user.service';
import * as FileService from '@/api/file.service';
import { useDispatch, useSelector } from 'react-redux';
import { favoriteQuiz } from '@/redux/slices/user.slice';
import { useRouter } from 'next/navigation';
import { setTimePassQuestion, shuffleQuiz, ShuffleType } from '@/redux/slices/takeQuiz.slice';

const GeneralInformation = ({ quizDetail }: any) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const [isOpenModalSetting, setIsOpenModalSetting] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [formSetting] = Form.useForm();

    // Tính tổng số câu hỏi
    const totalQuestions = useMemo(() => {
        return quizDetail?.quiz?.reduce((acc: number, part: any) => acc + (part?.questions?.length || 0), 0) || 0;
    }, [quizDetail]);

    // Logic Xử lý Yêu thích & Xuất PDF (Giữ nguyên logic của bạn nhưng bọc lại cho gọn)
    const favoriteMutation = useMutationHooks(UserService.favoriteQuiz);
    const exportPdfMutation = useMutationHooks(FileService.ExportPdf);
    const [activeLoading, setActiveLoading] = useState<string | null>(null);

    const handleAction = async (type: 'favorite' | 'pdf') => {
        if (!quizDetail?._id) return;
        setActiveLoading(type);
        if (type === 'favorite') {
            if (user?.favoriteQuiz?.some((q: any) => q.slug === quizDetail.slug)) {
                toast.info('Đề thi đã có trong danh sách yêu thích! ❤️');
                setActiveLoading(null);
                return;
            }
            favoriteMutation.mutate({ id: quizDetail._id });
            dispatch(favoriteQuiz({ slug: quizDetail.slug }));
        } else {
            exportPdfMutation.mutate({ id: quizDetail._id, collection: 'quiz' });
        }
    };

    useEffect(() => {
        if (favoriteMutation.isSuccess || exportPdfMutation.isSuccess || exportPdfMutation.isError) {
            setActiveLoading(null);
            if (favoriteMutation.isSuccess) toast.success('Đã thêm vào yêu thích!');
            if (exportPdfMutation.isSuccess) toast.success('Xuất PDF thành công!');
        }
    }, [favoriteMutation.isSuccess, exportPdfMutation.isSuccess, exportPdfMutation.isError]);

    const onStartQuiz = async (values: any) => {
        setLoadingModal(true);
        const shuffles: ShuffleType[] = [];
        if (values.isShuffleAnswer) shuffles.push('answer');
        if (values.isShuffleQuestion) shuffles.push('question');
        if (values.isShufflePart) shuffles.push('part');

        dispatch(setTimePassQuestion(values.timePassQuestion));
        if (shuffles.length > 0) dispatch(shuffleQuiz(shuffles));
        router.push(`${quizRouter.TAKE_QUIZ}/${quizDetail?.slug}`);
    };

    return (
        <div className="glass-card p-6 bg-white/80 backdrop-blur-md border-white/40 shadow-xl rounded-[2rem]">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cột 1: Thumbnail (Giảm chất lượng ảnh qua CSS filter để tạo hiệu ứng nghệ thuật) */}
                <div className="w-full lg:w-1/3">
                    <div className="relative group">
                        <LazyImage
                            alt={quizDetail?.name}
                            src={quizDetail?.thumb}
                            className="w-full aspect-[4/3] overflow-hidden object-cover rounded-3xl shadow-2xl brightness-95 contrast-90 transition-all group-hover:brightness-100"
                        />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Nút thao tác nhanh dưới ảnh */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <button
                            onClick={() => handleAction('pdf')}
                            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            {activeLoading === 'pdf' ? <LoadingOutlined /> : <FontAwesomeIcon icon={faFilePdf} />}
                            <span>PDF</span>
                        </button>
                        <button
                            onClick={() => handleAction('favorite')}
                            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-pink-50 hover:text-pink-500 transition-all"
                        >
                            {activeLoading === 'favorite' ? <LoadingOutlined /> : <FontAwesomeIcon icon={faHeart} />}
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>

                {/* Cột 2: Thông tin chi tiết */}
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                            {quizDetail?.name}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 mt-4 p-2 rounded-2xl bg-blue-50/50 w-fit">
                        <LazyImage
                            className="w-10 h-10 rounded-xl overflow-hidden object-cover shadow-sm"
                            src={quizDetail?.user?.avatar}
                            alt="avatar"
                        />
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tác giả</p>
                            <p className="text-sm font-bold text-slate-700">{quizDetail?.user?.name}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <InfoBadge
                            icon={faQuestionCircle}
                            color="text-amber-500"
                            label="Câu hỏi"
                            value={totalQuestions}
                        />
                        <InfoBadge
                            icon={faBookOpenReader}
                            color="text-emerald-500"
                            label="Lượt thi"
                            value={quizDetail?.examCount}
                        />
                        <InfoBadge
                            icon={faChartSimple}
                            color="text-blue-500"
                            label="Truy cập"
                            value={quizDetail?.accessCount}
                        />
                    </div>

                    <div className="mt-8 space-y-4 flex-1">
                        <MetaItem
                            icon={faGraduationCap}
                            label="Trình độ"
                            value={quizDetail?.educationLevel?.join(', ')}
                        />
                        <MetaItem icon={faTags} label="Chủ đề" value={quizDetail?.topic} />
                        <MetaItem
                            icon={faClock}
                            label="Ngày tạo"
                            value={dayjs(quizDetail?.createdAt).format('DD/MM/YYYY')}
                        />

                        {quizDetail?.description && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mt-4">
                                <p className="text-slate-500 text-sm italic leading-relaxed line-clamp-3">
                                    "{quizDetail?.description}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Nút Start bự nhất */}
                    <button
                        onClick={() => setIsOpenModalSetting(true)}
                        className="mt-8 w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-lg shadow-xl shadow-blue-200 hover:shadow-blue-400 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                    >
                        <FontAwesomeIcon icon={faPlayCircle} className="text-2xl" />
                        BẮT ĐẦU ÔN THI NGAY
                    </button>
                </div>
            </div>

            <Modal
                title={<div className="text-xl font-bold pb-2 border-b">Thiết lập phòng thi 🛠️</div>}
                open={isOpenModalSetting}
                onCancel={() => setIsOpenModalSetting(false)}
                centered
                footer={null}
                width={450}
                className="soft-modal"
            >
                <Form
                    form={formSetting}
                    initialValues={{
                        timePassQuestion: 2000,
                        isShufflePart: false,
                        isShuffleQuestion: false,
                        isShuffleAnswer: false,
                    }}
                    onFinish={onStartQuiz}
                    layout="vertical"
                    className="mt-6"
                >
                    <Form.Item
                        name="timePassQuestion"
                        label={<span className="font-bold text-slate-600">Tự động chuyển câu sau</span>}
                    >
                        <Select size="large" className="w-full">
                            {[1, 2, 3, 4].map((s) => (
                                <Select.Option key={s} value={s * 1000}>
                                    {s} giây
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className="bg-slate-50 p-5 rounded-3xl space-y-4">
                        <ToggleItem name="isShufflePart" label="Đảo thứ tự các phần thi" />
                        <ToggleItem name="isShuffleQuestion" label="Xáo trộn danh sách câu hỏi" />
                        <ToggleItem name="isShuffleAnswer" label="Xáo trộn thứ tự đáp án" />
                    </div>

                    <button
                        type="submit"
                        disabled={loadingModal}
                        className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary transition-all"
                    >
                        {loadingModal ? <LoadingOutlined /> : 'XÁC NHẬN & VÀO THI'}
                    </button>
                </Form>
            </Modal>
        </div>
    );
};

// Sub-components giúp code sạch hơn
const InfoBadge = ({ icon, color, label, value }: any) => (
    <div className="flex flex-col items-center p-4 rounded-3xl bg-white shadow-sm border border-slate-50">
        <FontAwesomeIcon icon={icon} className={`${color} text-xl mb-2`} />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
        <span className="text-lg font-black text-slate-700">{value || 0}</span>
    </div>
);

const MetaItem = ({ icon, label, value }: any) =>
    value ? (
        <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <FontAwesomeIcon icon={icon} size="sm" />
            </div>
            <span className="text-slate-400 font-medium">{label}:</span>
            <span className="text-slate-700 font-bold">{value}</span>
        </div>
    ) : null;

const ToggleItem = ({ name, label }: any) => (
    <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-slate-600">{label}</span>
        <Form.Item name={name} valuePropName="checked" className="mb-0">
            <Switch />
        </Form.Item>
    </div>
);

export default memo(GeneralInformation);
