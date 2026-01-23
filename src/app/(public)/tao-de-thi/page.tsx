'use client';
import useMutationHooks from '@/hooks/useMutationHooks';
import { DeliveredProcedureOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { v7 as uuidv7 } from 'uuid';

//Components
import * as FileService from '@/api/file.service';
import * as QuizService from '@/api/quiz.service';
import BlurBackground from '@/components/UI/BlurBackground';
//
import { faChevronLeft, faClipboard, faFileImport, faQuestionCircle, faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Input, Modal, Select, Tabs } from 'antd';

import CreateMatchQuestion from '@/components/Quiz/Questions/CreateMatchQuestion';
import OneNNAnswer from '@/components/Quiz/Questions/OneNNAnswer';
import { USER_DASHBOARD_ROUTER } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { BodyUpsertQuestionQuiz } from '@/@types/quiz.type';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CreateGeneralInfoQuiz from '../../../features/quiz/components/CreateGeneralInfoQuiz';
import { setCurrentQuizPartId } from '@/redux/slices/quiz.slice';

//region Create question
const ImportQuestions = () => {
    const { currentCreateQuizId } = useAppSelector((state) => state.quiz);
    const [file, setFile] = useState(null);
    const importDataMutation = useMutationHooks((data: any) => FileService.ImportData(data));
    const router = useRouter();
    // useEffect(() => {
    //     console.log(file);
    // }, [file]);
    const handleClick = () => {
        if (!currentCreateQuizId) return toast.error('Lỗi! Xin vui lòng thử lại');
        importDataMutation.mutate({
            file,
            id: currentCreateQuizId,
            collection: 'quiz',
        });
    };
    const [countdown, setCountdown] = useState(3);
    useEffect(() => {
        if (importDataMutation.isSuccess) {
            toast.success('Import câu hỏi thành công');
            setTimeout(() => {
                setCountdown((prev) => {
                    return prev - 1;
                });
            }, 1000);
            importDataMutation.reset();
        } else if (importDataMutation.isError) {
            toast.error('Import câu hỏi thất bại');
        }
        if (countdown === 0) {
            router.push(USER_DASHBOARD_ROUTER.EDIT_MY_QUIZ_NO_PARAMS + currentCreateQuizId);
        }
    }, [importDataMutation.isSuccess, importDataMutation.isError, countdown]);
    useEffect(() => {}, []);
    return (
        <section className="px-3 py-4 rounded-lg border-2 shadow-sm w-full bg-white">
            <Input
                type="file"
                placeholder="Chọn tệp"
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e: any) => setFile(e.target.files[0])}
            />
            <button
                onClick={handleClick}
                className={'w-full py-3 rounded-md border-4 border-dashed border-primary hover:opacity-50 transition'}
            >
                <span className="text-primary font-bold">
                    <p className="text-primary font-bold">
                        Thêm mới{importDataMutation.isPending && <LoadingOutlined />}
                    </p>
                </span>
            </button>
        </section>
    );
};
type TabKey = 'General' | 'Question' | 'Import';
const CreateQuizPageMain = () => {
    const { currentCreateQuizId } = useAppSelector((state) => state.quiz);
    const [currentTabKey, setCurrentTabKey] = useState<TabKey>('General');
    const router = useRouter();
    return (
        <div className="bg-opacity-40 py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Thêm đề thi</h1>
                    <p className="text-slate-500 text-sm font-medium">Thông tin chung đề thi</p>
                </div>

                <Button
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-red-50 rounded-xl px-5 py-2.5 font-bold transition-all duration-200 shadow-sm"
                    onClick={() => router.back()}
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                    Trở lại
                </Button>
            </div>
            <CreateGeneralInfoQuiz />
        </div>
    );
};
export default CreateQuizPageMain;
