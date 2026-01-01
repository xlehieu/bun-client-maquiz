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
import { BodyUpsertQuestionQuiz } from '@/types/quiz.type';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CreateGeneralInfoQuiz from './components/CreateGeneralInfoQuiz';
import { setCurrentQuizPartId } from '@/redux/slices/quiz.slice';

//region Create question
type QuizSection = {
    id: string;
    name: string;
};
const CreateQuizQuestion = () => {
    const dispatch = useAppDispatch();
    const { listQuestionType } = useAppSelector((state) => state.questionType);
    const { currentCreateQuizId, currentQuizPartId } = useAppSelector((state) => state.quiz);
    //   const [currentQuizPartName, setCurrentQuizPartName] = useState("Phần 1"); //lấy sate này để lưu thông tin phần của câu hỏi

    // mảng tên phần thi = > check đã có trong bài thi chưa
    const [arrQuizPart, setArrQuizPart] = useState<QuizSection[]>([
        {
            id: currentQuizPartId,
            name: 'Phần 1',
        },
    ]); // chứ không phải cái này, cái này chỉ là mảng để render ra những phần mình đã thêm
    const [isActiveQuizPartNameDialog, setIsActiveQuizPartNameDialog] = useState(false);
    const [quizPartNameInput, setQuizPartNameInput] = useState('');
    const [form] = Form.useForm<BodyUpsertQuestionQuiz>();
    const questionTypeWatch = Form.useWatch('questionType', form);
    // Xử lý lưu thông tin câu hỏi
    const createQuestionMutation = useMutationHooks((data: BodyUpsertQuestionQuiz) => QuizService.createQuestion(data));
    //region submit
    const handleSubmitCreateQuestion = (formValues: BodyUpsertQuestionQuiz) => {
        if (!currentCreateQuizId || !currentQuizPartId) {
            toast.error('Có lỗi xảy ra');
            return;
        }
        const bodySubmit: BodyUpsertQuestionQuiz = {
            quizId: currentCreateQuizId,
            partId: currentQuizPartId,
            questionId: uuidv7(),
            partName: arrQuizPart.find((item) => item.id === currentQuizPartId)?.name || 'Maquiz',
            questionType: formValues.questionType,
        };
        if ([1, 2].includes(formValues?.questionType)) {
            bodySubmit.answers = formValues.answers;
            bodySubmit.questionContent = formValues.questionContent;
        } else if (formValues.questionType === 3) {
            bodySubmit.matchQuestions = formValues.matchQuestions;
        }
        createQuestionMutation.mutate(bodySubmit);
    };
    useEffect(() => {
        if (createQuestionMutation.isSuccess && createQuestionMutation.data) {
            toast.success('Lưu thông tin câu hỏi thành công');
            form.resetFields();
            window.scrollTo({
                top: 250,
                behavior: 'smooth', // Lướt mượt mà
            });
        }
        if (createQuestionMutation.isError) {
            toast.error('Lỗi, không thêm được câu hỏi');
        }
    }, [createQuestionMutation.isSuccess, createQuestionMutation.isError]);
    //end
    const handleAddQuizPartName = () => {
        try {
            if (!quizPartNameInput) return toast.error('Vui lòng nhập tên phần thi');
            const idx = arrQuizPart.findIndex((item) => item.name === quizPartNameInput);
            if (idx !== -1) {
                return toast.warning('Tên phần thi này đã có trong danh sách ');
            }
            const newId = uuidv7();
            setArrQuizPart((prevArr) => {
                const newValue = [...prevArr];
                newValue.push({
                    id: newId,
                    name: quizPartNameInput,
                });
                return newValue;
            });
            dispatch(setCurrentQuizPartId(newId));
            setIsActiveQuizPartNameDialog(false);
            setQuizPartNameInput('');
        } catch (err) {
        } finally {
        }
    };
    //   region render
    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitCreateQuestion}
                initialValues={{
                    questionType: '01',
                    answers: Array.from({ length: 4 }).fill({
                        isCorrect: false,
                        content: '',
                    }),
                }}
                onValuesChange={(
                    changeValues: Partial<BodyUpsertQuestionQuiz>,
                    formValues: Partial<BodyUpsertQuestionQuiz>,
                ) => {
                    if (formValues.questionType == 1 && formValues.answers && Array.isArray(changeValues.answers)) {
                        const idxHasValueChange = changeValues.answers.findIndex((item) => item && item.isCorrect);
                        // đáp án 1 chỉ có một đáp án đúng
                        if (idxHasValueChange !== -1) {
                            form.setFieldValue(
                                'answers',
                                formValues.answers.map((item, idx) => {
                                    if (idx === idxHasValueChange) {
                                        return {
                                            ...item,
                                            isCorrect: true,
                                        };
                                    }
                                    return { ...item, isCorrect: false };
                                }),
                            );
                        }
                    }
                }}
            >
                <div className="flex flex-col w-full">
                    <div className="gap-4 flex flex-col md:flex-row items-start">
                        <div className="px-3 py-4 rounded-lg border-2 shadow-sm bg-white w-full md:max-w-96">
                            <div className="flex justify-between">
                                <p className="font-semibold flex-wrap content-center">Danh sách phần thi</p>
                                <Button onClick={() => setIsActiveQuizPartNameDialog(true)}>
                                    <p className="text-primary font-bold">Thêm mới</p>
                                </Button>
                            </div>
                            <div className="grid grid-cols-3">
                                {arrQuizPart.map((quizSection, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            dispatch(setCurrentQuizPartId(quizSection.id));
                                        }}
                                        className={`${
                                            quizSection.id === currentQuizPartId
                                                ? 'bg-primary text-white font-semibold border-2 border-primary'
                                                : 'border-2 text-gray-500'
                                        } rounded-xl py-2 w-11/12 m-auto mt-3`}
                                    >
                                        {quizSection.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* 
//region Thêm câu hỏi
*/}
                        <div className="flex w-full flex-col gap-4 px-6 py-4 rounded-lg border-2 shadow-sm bg-white">
                            <div className="flex justify-between h-10">
                                <p className="font-semibold flex-wrap content-center text-xl">Thêm câu hỏi mới</p>
                            </div>
                            <div className="flex flex-col">
                                <Form.Item<BodyUpsertQuestionQuiz>
                                    name="questionType"
                                    label="Loại câu hỏi"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn loại câu hỏi',
                                        },
                                    ]}
                                >
                                    <Select
                                        id="questionType"
                                        className="sm:w-full lg:w-56"
                                        placeholder="Chọn loại câu hỏi"
                                        //   onChange={(data, option) => {
                                        //     setQuestionType(data);
                                        //   }}
                                        //   value={questionType}
                                    >
                                        {listQuestionType.map((item) => (
                                            <Select.Option value={item.MaMuc}>{item.TenMuc}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            {(questionTypeWatch === 1 || questionTypeWatch === 2) && <OneNNAnswer form={form} />}
                            {questionTypeWatch === 3 && <CreateMatchQuestion />}
                            <div className="mt-4 rounded-4xl flex justify-end gap-3">
                                <Button
                                    type="primary"
                                    loading={createQuestionMutation.isPending}
                                    // className="px-3 py-2 rounded-4xl text-white bg-primary hover:bg-primary-bold hover:scale-110 transition-all ease-in-out"
                                    onClick={form.submit}
                                >
                                    <DeliveredProcedureOutlined />
                                    Lưu và tiếp tục tạo mới
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
            <Modal
                // region Modal thêm phần thi
                title="Thêm phần thi"
                open={isActiveQuizPartNameDialog}
                centered
                onCancel={() => setIsActiveQuizPartNameDialog(false)}
                footer={
                    <div>
                        <Button onClick={() => handleAddQuizPartName()}>Lưu</Button>
                    </div>
                }
            >
                <Input
                    placeholder="Nhập tên phần thi"
                    value={quizPartNameInput}
                    onChange={(e) => setQuizPartNameInput(e.target.value)}
                />
            </Modal>
        </>
    );
};
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

            {/* <Tabs
                defaultActiveKey="1"
                onChange={(activeKey: string) => {
                    if (activeKey === 'Question' && currentCreateQuizId) {
                        setCurrentTabKey(activeKey as TabKey);
                    } else if (activeKey === 'Import' && currentCreateQuizId) {
                        setCurrentTabKey(activeKey as TabKey);
                    } else if (activeKey === 'General') {
                        setCurrentTabKey(activeKey as TabKey);
                    } else {
                        toast.warning('Bạn phải tạo thông tin chung của đề thi trước 😉');
                    }
                }}
                size={'large'}
                style={{ marginBottom: 32 }}
                activeKey={currentTabKey}
            >
                <Tabs.TabPane
                    tab={
                        <div className="flex gap-3 text-lg items-center">
                            <FontAwesomeIcon icon={faClipboard} />
                            Thông tin chung
                        </div>
                    }
                    key="General"
                >
                    <CreateGeneralInfoQuiz />
                </Tabs.TabPane>
                <Tabs.TabPane
                    tab={
                        <div className="flex gap-3 text-lg items-center">
                            <FontAwesomeIcon icon={faQuestionCircle} />
                            Câu hỏi
                        </div>
                    }
                    key="Question"
                >
                    <CreateQuizQuestion />
                </Tabs.TabPane>
                <Tabs.TabPane
                    tab={
                        <div className="flex gap-3 text-lg items-center">
                            <FontAwesomeIcon icon={faFileImport} />
                            Import câu hỏi
                        </div>
                    }
                    key="Import"
                >
                    <ImportQuestions />
                </Tabs.TabPane>
            </Tabs> */}
            <CreateGeneralInfoQuiz />
        </div>
    );
};
export default CreateQuizPageMain;
