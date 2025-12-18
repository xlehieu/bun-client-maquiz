'use client';
import dynamic from 'next/dynamic';
import React, { useState, useCallback, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import useMutationHooks from '@/hooks/useMutationHooks';
import { LoadingOutlined, DeleteOutlined, PlusOutlined, DeliveredProcedureOutlined } from '@ant-design/icons';

const JoditEditor = dynamic(() => import('jodit-react'));
//Components
import UploadComponent from '@/components/UI/UploadComponent';
import * as QuizService from '@/api/quiz.service';
import * as FileService from '@/api/file.service';
import Button from '@/components/UI/Button';
import CreateQuizPart from '@/components/UI/CreateQuizPart';
import BlurBackground from '@/components/UI/BlurBackground';
//
import { Form, Input, Select, Tabs } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { educationLevels, imageQuizThumbDefault } from '@/common/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faFileImport, faPlusCircle, faQuestionCircle, faReply } from '@fortawesome/free-solid-svg-icons';

import configEditor from '@/config/editor';
import { useSelector } from 'react-redux';
import siteRouter, { userDashboardRouter } from '@/config';
import { IQuiz } from '@/interface';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LoadingComponent from '@/components/UI/LoadingComponent';
import CreateMatchQuestion from '@/components/Quiz/Questions/CreateMatchQuestion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchListQuestionType } from '@/redux/slices/questionType.slice';
import { setCurrentCreateQuizId } from '@/redux/slices/createQuiz.slice';
import { BodyCreateGeneralInformationQuiz } from '@/types/quiz.type';

const CreateQuizGeneralInfo = () => {
    const dispatch = useAppDispatch();
    const { listQuestionType } = useAppSelector((state) => state.questionType);
    const [form] = Form.useForm<BodyCreateGeneralInformationQuiz>();
    const createQuizGeneralInfoMutation = useMutationHooks((data: BodyCreateGeneralInformationQuiz) =>
        QuizService.createGeneralInformationQuiz(data),
    );

    useEffect(() => {
        if (createQuizGeneralInfoMutation.isSuccess && createQuizGeneralInfoMutation.data) {
            dispatch(setCurrentCreateQuizId(createQuizGeneralInfoMutation?.data?._id));
            toast.success('Tạo bài trắc nghiệm thành công');
            createQuizGeneralInfoMutation.reset();
        } else if (createQuizGeneralInfoMutation.isError) {
            toast.error('Tạo bài trắc nghiệm thất bại. Vui lòng thử lại');
            createQuizGeneralInfoMutation.reset();
        }
    }, [createQuizGeneralInfoMutation.isSuccess, createQuizGeneralInfoMutation.isError]);

    const handleCreateQuizClick = (formValue: BodyCreateGeneralInformationQuiz) => {
        createQuizGeneralInfoMutation.mutate({
            ...formValue,
        });
    };
    useEffect(() => {
        if (listQuestionType.length <= 0) {
            dispatch(fetchListQuestionType());
        }
    }, [listQuestionType]);
    //END
    return (
        <Form form={form} layout="vertical" onFinish={handleCreateQuizClick}>
            <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
                <div className="px-3 py-4 rounded-lg border-2 shadow-sm w-full md:max-w-96 bg-white">
                    <Form.Item<BodyCreateGeneralInformationQuiz> name="thumb">
                        <UploadComponent />
                    </Form.Item>
                    <div className="flex flex-wrap mt-2">
                        {imageQuizThumbDefault.map((imageSrc, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    (form as any).setFieldValue('thumb', imageSrc);
                                }}
                                className="w-1/2 px-1 py-1 border"
                            >
                                <img src={imageSrc} alt="image-default" className="object-cover w-full" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 px-6 py-4 rounded-lg border-2 shadow-sm bg-white">
                    <div className="flex flex-col focus-within:text-primary">
                        <Form.Item<BodyCreateGeneralInformationQuiz>
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên đề thi là bắt buộc',
                                },
                            ]}
                            label="Tên đề thi"
                        >
                            <Input
                                autoComplete="off"
                                placeholder="Tên đề thi"
                                type="text"
                                className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                            ></Input>
                        </Form.Item>
                    </div>
                    <div className="flex flex-col focus-within:text-primary">
                        <Form.Item<BodyCreateGeneralInformationQuiz>
                            name="educationLevel"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trình độ bài thi',
                                },
                            ]}
                            label="Trình độ bài thi"
                        >
                            <Select mode="multiple" allowClear placeholder="Chọn trình độ bài thi">
                                {educationLevels?.map((level, index) => (
                                    <Select.Option value={level} key={index}>
                                        {level}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="columns-2 gap-4">
                        <div className="flex flex-col focus-within:text-primary">
                            <div className="flex flex-col focus-within:text-primary">
                                <Form.Item<BodyCreateGeneralInformationQuiz>
                                    name="schoolYear"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Năm học của bài thi là bắt buộc',
                                        },
                                    ]}
                                    label="Năm học"
                                >
                                    <Input
                                        type="number"
                                        className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                                        placeholder="Năm học"
                                    ></Input>
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex flex-col focus-within:text-primary">
                            <Form.Item<BodyCreateGeneralInformationQuiz>
                                name="topic"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn chủ đề bài thi',
                                    },
                                ]}
                                label="Chủ đề bài thi"
                            >
                                <Select mode="multiple" allowClear placeholder="Chủ đề bài thi">
                                    {educationLevels?.map((level, index) => (
                                        <Select.Option value={level} key={index}>
                                            {level}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="flex flex-col focus-within:text-primary">
                        <Form.Item<BodyCreateGeneralInformationQuiz>
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mô tả bài thi là bắt buộc',
                                },
                            ]}
                            label="Mô tả đề thi"
                        >
                            <TextArea
                                rows={4}
                                autoComplete="off"
                                placeholder="Mô tả"
                                className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                            ></TextArea>
                        </Form.Item>
                    </div>
                    <div className="columns-2 gap-4 ">
                        <div className="flex flex-col focus-within:text-primary">
                            <Form.Item<BodyCreateGeneralInformationQuiz>
                                name="school"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên trường học',
                                    },
                                ]}
                                label="Tên trường học"
                            >
                                <Input
                                    className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                                    placeholder={'Tên trường học'}
                                ></Input>
                            </Form.Item>
                        </div>
                        <div className="flex flex-col focus-within:text-primary">
                            <Form.Item<BodyCreateGeneralInformationQuiz>
                                name="subject"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn tên môn học',
                                    },
                                ]}
                                label="Môn học"
                            >
                                <Select mode="multiple" allowClear placeholder="Chọn tên môn học" showSearch>
                                    {educationLevels?.map((level, index) => (
                                        <Select.Option value={level} key={index}>
                                            {level}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={form.submit}
                            className="py-2 px-4 rounded-md bg-primary text-white font-semibold hover:bg-primary-bold transition"
                        >
                            {createQuizGeneralInfoMutation.isPending ? (
                                <LoadingOutlined />
                            ) : (
                                <FontAwesomeIcon icon={faPlusCircle} />
                            )}
                            Thêm đề thi mới
                        </button>
                    </div>
                </div>
            </div>
        </Form>
    );
};
//region Create question
const CreateQuizQuestion = () => {
    const { listQuestionType } = useAppSelector((state) => state.questionType);
    const { quizId } = useContext(QuizIdContext);
    const [currentQuizPartName, setCurrentQuizPartName] = useState('Phần 1'); //lấy sate này để lưu thông tin phần của câu hỏi

    // mảng tên phần thi = > check đã có trong bài thi chưa
    const [arrQuizPartName, setArrQuizPartName] = useState([currentQuizPartName]); // chứ không phải cái này, cái này chỉ là mảng để render ra những phần mình đã thêm
    const [isActiveQuizPartNameDialog, setIsActiveQuizPartNameDialog] = useState(false);

    const [questionType, setQuestionType] = useState(1);
    const [questionContent, setQuestionContent] = useState('');
    const initAnswers = [
        {
            content: '',
            isCorrect: true,
        },
        {
            content: '',
            isCorrect: false,
        },
        {
            content: '',
            isCorrect: false,
        },
        {
            content: '',
            isCorrect: false,
        },
    ];
    const [answers, setAnswers] = useState(initAnswers);
    const [matchQuestions, setMatchQuestions] = useState<any>();
    const handleAddAnswer = () => {
        setAnswers((preAnswers) => {
            preAnswers = [...preAnswers];
            preAnswers.push({ content: '', isCorrect: false });
            return preAnswers;
        });
    };
    const handleRemoveAnswers = (index: any) => {
        setAnswers((prevAnswers) => {
            prevAnswers = [...prevAnswers];
            prevAnswers.splice(index, 1);
            return prevAnswers;
        });
    };
    const handleChangeAnswer = (text: any, index: any) => {
        setAnswers((prevAnswers) => {
            prevAnswers = [...prevAnswers];
            prevAnswers[index].content = text;
            return prevAnswers;
        });
    };
    const handleChangeSingleChoice = (index: any) => {
        setAnswers((prevAnswers) => {
            prevAnswers = [...prevAnswers];
            prevAnswers.forEach((answers) => {
                answers.isCorrect = false;
            });
            prevAnswers[index].isCorrect = true;
            return prevAnswers;
        });
    };
    const handleChangeMultipleChoice = (index: any) => {
        setAnswers((prevAnswers) => {
            prevAnswers = [...prevAnswers];
            prevAnswers[index].isCorrect = !prevAnswers[index].isCorrect;
            return prevAnswers;
        });
    };
    //END

    // Xử lý lưu thông tin câu hỏi
    const createQuestionMutation = useMutationHooks((data: any) => QuizService.createQuestion(data));
    const handleCreateQuestionClick = () => {
        if (!quizId) {
            toast.error('Lỗi');
            return;
        }
        if (!currentQuizPartName || !Number.isInteger(questionType) || !questionContent || !answers) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        let data;
        if ([1, 2].includes(questionType)) {
            data = {
                id: quizId,
                partName: currentQuizPartName,
                questionType: questionType,
                questionContent: questionContent,
                answers: answers,
            };
        } else if (questionType === 3) {
            data = {
                id: quizId,
                matchQuestions,
            };
        }
        createQuestionMutation.mutate(data);
    };
    useEffect(() => {
        if (createQuestionMutation.isSuccess && createQuestionMutation.data) {
            toast.success('Lưu thông tin câu hỏi thành công');
            setQuestionContent('');
            setAnswers(initAnswers);
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
    const handleAddQuizPartName = (partName: any) => {
        setArrQuizPartName((prevArr) => {
            if (!prevArr.includes(partName)) return [...prevArr, partName];
            else {
                toast.error('Phần này đã có trong danh sách ');
                return prevArr;
            }
        });
    };
    const handleReceiveQuestion = (data: any) => {
        setMatchQuestions(data);
    };
    //1 -n đáp án
    const OneNNAnswer = () => (
        <React.Fragment>
            {[1, 2].includes(questionType) && (
                <React.Fragment>
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <label className="font-semibold">Soạn câu hỏi</label>
                        </div>
                        <JoditEditor
                            config={{
                                ...configEditor,
                                placeholder: 'Nhập câu hỏi',
                                askBeforePasteHTML: false,
                                defaultActionOnPaste: 'insert_as_html',
                            }}
                            value={questionContent}
                            onBlur={(newContent) => setQuestionContent(newContent)} // preferred to use only this option to update the content for performance reasons
                            //onChange={setQuestionContent}
                        />
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <p className="font-semibold">Câu trả lời</p>
                        </div>
                        {answers.map((answer, index) => (
                            <div key={index} className="flex flex-col mt-4">
                                <div className="flex justify-between content-center">
                                    <div className="flex">
                                        {questionType === 1 ? (
                                            <input
                                                name="isCorrect"
                                                checked={answer.isCorrect}
                                                onChange={(e) => handleChangeSingleChoice(index)}
                                                type="radio"
                                                className="mr-2"
                                                id={`${'answer' + index}`}
                                            />
                                        ) : (
                                            <input
                                                name="isCorrect"
                                                checked={answer.isCorrect}
                                                onChange={(e) => handleChangeMultipleChoice(index)}
                                                type="checkbox"
                                                className="mr-2"
                                                id={`${'answer' + index}`}
                                            />
                                        )}
                                        <label htmlFor={`${'answer' + index}`} className="flex-wrap content-center">
                                            Đáp án {`${index + 1}`}
                                        </label>
                                    </div>
                                    <Button
                                        className="hover:scale-110 transition-all ease-initial"
                                        onClick={() => handleRemoveAnswers(index)}
                                    >
                                        <p className="text-red-600">
                                            <DeleteOutlined className="mr-1" />
                                            Xóa đáp án
                                        </p>
                                    </Button>
                                </div>
                                <JoditEditor
                                    config={{
                                        ...configEditor,
                                        placeholder: `Nhập câu trả lời ${index + 1}`,
                                        askBeforePasteHTML: false,
                                        defaultActionOnPaste: 'insert_as_html',
                                    }}
                                    className="mt-2"
                                    value={answer.content}
                                    onBlur={(newContent) => handleChangeAnswer(newContent, index)} // preferred to use only this option to update the content for performance reasons
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleAddAnswer}
                        className={
                            'w-full py-3 rounded-md hover:rounded-2xl border-4 border-dashed border-primary hover:opacity-50 transition-all ease-in hover:scale-95'
                        }
                    >
                        <span className="text-primary font-bold">
                            <PlusOutlined className="text-xl pr-2" />
                            Thêm đáp án
                        </span>
                    </button>
                </React.Fragment>
            )}
        </React.Fragment>
    );

    const createQuestion: Record<number, ReactNode> = {
        1: <OneNNAnswer />,
        2: <OneNNAnswer />,
        // câu hỏi nối đáp án
        3: <CreateMatchQuestion onSendMatchQuestion={handleReceiveQuestion} />,
    };
    return (
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
                        {arrQuizPartName.map((quizPartName, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuizPartName(quizPartName)}
                                className={`${
                                    quizPartName === currentQuizPartName
                                        ? 'bg-primary text-white font-semibold border-2 border-primary'
                                        : 'border-2 text-gray-500'
                                } rounded-xl py-2 w-11/12 m-auto mt-3`}
                            >
                                {quizPartName}
                            </button>
                        ))}
                    </div>
                </div>
                <CreateQuizPart
                    setCurrentQuizPartName={(quizPartName: any) => setCurrentQuizPartName(quizPartName)}
                    setArrQuizPartName={handleAddQuizPartName}
                    callback={(quizPartName: any) => {
                        setCurrentQuizPartName(quizPartName);
                        handleAddQuizPartName(quizPartName);
                    }}
                    isActiveQuizPartNameDialog={isActiveQuizPartNameDialog}
                    setIsActiveQuizPartNameDialog={setIsActiveQuizPartNameDialog}
                />
                <div className="flex w-full flex-col gap-4 px-6 py-4 rounded-lg border-2 shadow-sm bg-white">
                    <div className="flex justify-between h-10">
                        <p className="font-semibold flex-wrap content-center text-xl">Thêm câu hỏi mới</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <label htmlFor="questionType" className="font-semibold">
                                Loại câu hỏi
                            </label>
                        </div>
                        <Select id="questionType" className="sm:w-full lg:w-56" value={questionType}>
                            {listQuestionType.map((item) => (
                                <Select.Option value={item.MaMuc}>{item.TenMuc}</Select.Option>
                            ))}
                        </Select>
                    </div>
                    {createQuestion[questionType]}

                    <div className="mt-4 rounded-4xl flex justify-end gap-3">
                        <button
                            className="px-3 py-2 rounded-4xl text-white bg-primary hover:bg-primary-bold hover:scale-110 transition-all ease-in-out"
                            onClick={() => handleCreateQuestionClick()}
                        >
                            {createQuestionMutation.isPending ? <LoadingOutlined /> : <DeliveredProcedureOutlined />}{' '}
                            Lưu và tiếp tục tạo mới
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full items-end">
                <BlurBackground isActive={isActiveQuizPartNameDialog} />
            </div>
        </div>
    );
};
const ImportQuestions = () => {
    const { quizId } = useContext(QuizIdContext);
    const [file, setFile] = useState(null);
    const importDataMutation = useMutationHooks((data: any) => FileService.ImportData(data));
    const router = useRouter();
    // useEffect(() => {
    //     console.log(file);
    // }, [file]);
    const handleClick = () => {
        if (!quizId) return toast.error('Lỗi! Xin vui lòng thử lại');
        importDataMutation.mutate({
            file,
            id: quizId,
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
            router.push(userDashboardRouter.editMyQuizNoParam + quizId);
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
    const { currentCreateQuizId } = useAppSelector((state) => state.createQuiz);
    const [currentTabKey, setCurrentTabKey] = useState<TabKey>('General');
    const router = useRouter();
    // const handleClickTabCauHoi = () => {
    //     setCurrentTabIndex(1);
    //     if (currentTabIndex === 0) {
    //         return toast.warning('Bạn phải tạo thông tin chung của đề thi trước 😉');
    //     } else {
    //     }
    // };
    // const handleClickImportCauHoi = () => {
    //     if (!quizId) return toast.warning('Bạn phải tạo thông tin chung của đề thi trước 😉');
    //     setCurrentTabIndex(2);
    // };
    return (
        <div className="bg-opacity-40 py-10">
            <div className="w-full m-auto flex justify-between">
                <h4 className="font-semibold">Tạo đề thi mới</h4>
                <button onClick={() => router.back()} className="rounded-lg bg-red-500 px-2 py-1 text-white">
                    <FontAwesomeIcon icon={faReply} className="mr-1" />
                    Quay lại
                </button>
            </div>
            <Tabs
                defaultActiveKey="1"
                onChange={(activeKey: string) => {
                    if (activeKey === 'Question' && currentCreateQuizId) {
                        setCurrentTabKey(activeKey as TabKey);
                    } else if (activeKey === 'Import' && currentCreateQuizId) {
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
                    <CreateQuizGeneralInfo />
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
            </Tabs>
        </div>
    );
};
export default CreateQuizPageMain;
