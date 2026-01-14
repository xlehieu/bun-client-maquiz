'use client';
import { changeQuizDisabled, getAdminQuizDetail } from '@/api/admin/quizmanagement.service';
import ButtonBack from '@/components/UI/ButtonBack';
import { ADMIN_QUIZ_QUERY_KEY } from '@/features/admin/adminQuiz.query';
import {
    faBook,
    faCalendarAlt,
    faCheckCircle,
    faFileAlt,
    faGraduationCap,
    faLayerGroup,
    faLock,
    faRobot,
    faUnlock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Tag } from 'antd';
import HTMLReactParser from 'html-react-parser/lib/index';
import { useParams } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const QuizDetail = () => {
    const queryClient = useQueryClient();
    const { quizId } = useParams();
    // const router = useRouter();
    // const queryClient = useQueryClient();
    const { data: quizDetail } = useQuery({
        queryKey: ['ADMIN_QUIZ_DETAIL', quizId],
        enabled: !!quizId,
        queryFn: () => getAdminQuizDetail(quizId as string),
        select(dataQuery) {
            return dataQuery.data.data;
        },
    });
    const toggleDisableQuizMutation = useMutation({
        mutationFn: (id: string) => changeQuizDisabled(id),
        onSuccess: () => {
            toast.success('Cập nhật trạng thái bộ đề thành công');
            queryClient.invalidateQueries({
                queryKey: [ADMIN_QUIZ_QUERY_KEY.ADMIN_QUIZ_QUERY_KEY_LIST],
            });
            queryClient.invalidateQueries({
                queryKey: ['ADMIN_QUIZ_DETAIL', quizId],
            });
        },
    });

    const handleToggleStatus = (id: string) => {
        toggleDisableQuizMutation.mutate(id);
    };
    return (
        <div className="max-w-5xl mx-auto py-8 px-4 bg-gray-50 min-h-screen">
            {/* Header Navigation */}
            <div className="flex justify-between items-center mb-6">
                <ButtonBack />
                <div className="flex gap-2">
                    {quizDetail?.isUseChatBot && (
                        <Tag color="blue" icon={<FontAwesomeIcon icon={faRobot} className="mr-1" />}>
                            AI Support
                        </Tag>
                    )}
                    {quizDetail?.isAdminDisabled ? (
                        <Tag color="error">Đã bị khóa</Tag>
                    ) : (
                        <Tag color="success">Đang hoạt động</Tag>
                    )}
                </div>
            </div>

            {/* Main Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="md:flex">
                    <div className="md:w-1/3">
                        <img src={quizDetail?.thumb} alt={quizDetail?.name} className="w-full h-64 object-cover" />
                    </div>
                    <div className="md:w-2/3 p-6 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{quizDetail?.name}</h1>
                            <p className="text-gray-500 mb-4 italic">"{quizDetail?.description || 'Không có mô tả'}"</p>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <FontAwesomeIcon icon={faBook} className="w-4 mr-2 text-blue-500" />
                                    <span className="font-medium">Môn: {quizDetail?.subject}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FontAwesomeIcon icon={faGraduationCap} className="w-4 mr-2 text-purple-500" />
                                    <span>Khối: {quizDetail?.educationLevel?.join(', ')}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="w-4 mr-2 text-orange-500" />
                                    <span>Năm học: {quizDetail?.schoolYear}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FontAwesomeIcon icon={faLayerGroup} className="w-4 mr-2 text-green-500" />
                                    <span>Chủ đề: {quizDetail?.topic}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t pt-4">
                            <div className="flex gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Câu hỏi</p>
                                    <p className="font-bold">{quizDetail?.questionCount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Lượt xem</p>
                                    <p className="font-bold">{quizDetail?.accessCount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Lượt thi</p>
                                    <p className="font-bold">{quizDetail?.examCount || 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src={quizDetail?.user?.avatar} className="w-8 h-8 rounded-full border" alt="" />
                                <span className="text-sm font-medium text-gray-700">{quizDetail?.user?.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-600" /> Nội dung đề thi
                    </h2>
                    <button
                        onClick={() => handleToggleStatus(quizId as string)}
                        className={`px-5 py-2.5 border font-semibold rounded-xl transition-all duration-200 ${
                            !quizDetail?.isAdminDisabled
                                ? 'border-red-200 text-red-600 hover:bg-red-50' // Style khi tài khoản đang Active -> hiện nút Khóa
                                : 'border-green-200 text-green-600 hover:bg-green-50' // Style khi tài khoản đang Khoá -> hiện nút Mở
                        }`}
                    >
                        {!quizDetail?.isAdminDisabled ? (
                            <span>
                                <FontAwesomeIcon icon={faLock} className="mr-2" />
                                Khóa bài thi
                            </span>
                        ) : (
                            <span>
                                <FontAwesomeIcon icon={faUnlock} className="mr-2" />
                                Kích hoạt lại
                            </span>
                        )}
                    </button>
                </div>

                {quizDetail?.quiz?.map((part, pIdx) => (
                    <div
                        key={part.partId}
                        className={`bg-white rounded-xl shadow-sm border p-6 ${
                            part.isDisabled ? 'opacity-50 grayscale' : ''
                        }`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-blue-700 bg-blue-50 px-4 py-1 rounded-full uppercase tracking-wide">
                                {part.partName}
                            </h3>
                            {part.isDisabled && <Tag color="default">Đã ẩn</Tag>}
                        </div>

                        <div className="space-y-8">
                            {part.questions.map((q: any, qIdx: number) => (
                                <div key={q.questionId} className="pl-4 border-l-2 border-gray-100 relative">
                                    <div className="mb-3">
                                        <span className="text-sm font-bold text-gray-700">Câu hỏi {qIdx + 1}</span>
                                        {q?.questionContent && (
                                            <p className="text-gray-800 font-medium mt-1 text-lg">
                                                {HTMLReactParser(q?.questionContent) || ''}
                                            </p>
                                        )}
                                    </div>

                                    {/* Hiển thị câu hỏi TN (Type 1, 2) */}
                                    {q.answers && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                            {q.answers.map((ans: any, aIdx: number) => (
                                                <div
                                                    key={aIdx}
                                                    className={`p-3 rounded-lg border flex items-center justify-between ${
                                                        ans.isCorrect
                                                            ? 'bg-green-50 border-green-200'
                                                            : 'bg-gray-50 border-gray-100'
                                                    }`}
                                                >
                                                    <span
                                                        className={
                                                            ans.isCorrect
                                                                ? 'text-green-700 font-medium'
                                                                : 'text-gray-600'
                                                        }
                                                    >
                                                        {HTMLReactParser(ans.content)}
                                                    </span>
                                                    {ans.isCorrect && (
                                                        <FontAwesomeIcon
                                                            icon={faCheckCircle}
                                                            className="text-green-500"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Hiển thị câu hỏi Nối (Type 3 / MatchQuestion) */}
                                    {q.matchQuestions && (
                                        <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
                                            <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-tighter">
                                                Dạng bài nối ý
                                            </p>
                                            <div className="space-y-2">
                                                {q.matchQuestions.map((m: any) => (
                                                    <div
                                                        key={m._id}
                                                        className="flex items-center gap-4 bg-white p-2 rounded border shadow-sm text-sm"
                                                    >
                                                        <div className="flex-1 font-medium text-blue-600">
                                                            {m.questionContent}
                                                        </div>
                                                        <div className="text-gray-400">➞</div>
                                                        <div className="flex-1 font-medium text-green-600">
                                                            {m.answer}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizDetail;
