'use client';
import dynamic from 'next/dynamic';
import React, { useState, useCallback, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import useMutationHooks from '@/hooks/useMutationHooks';
import { LoadingOutlined, DeleteOutlined, PlusOutlined, DeliveredProcedureOutlined } from '@ant-design/icons';

const JoditEditor = dynamic(() => import('jodit-react'));
//Components
import UploadComponent from '@/components/UI/UploadComponent';
import * as QuizService from '@/services/quiz.service';
import * as FileService from '@/services/file.service';
import Button from '@/components/UI/Button';
import CreateQuizPart from '@/components/UI/CreateQuizPart';
import BlurBackground from '@/components/UI/BlurBackground';
//
import { Input, Select } from 'antd';
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

const TabIndexContext = createContext<any>({});
const QuizIdContext = createContext<any>({});
const QuizContextProvider = ({ children }: { children: ReactNode }) => {
    //region Tab index context
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [quizId, setQuizId] = useState();
    return (
        <TabIndexContext.Provider value={{ currentTabIndex, setCurrentTabIndex }}>
            <QuizIdContext.Provider value={{ quizId, setQuizId }}>{children}</QuizIdContext.Provider>
        </TabIndexContext.Provider>
    );
};
const CreateQuizGeneralInfo = () => {
    const { currentTabIndex, setCurrentTabIndex } = useContext(TabIndexContext);
    const { setQuizId } = useContext(QuizIdContext);
    //region General information
    const [imageUrl, setImageUrl] = useState(''); //Anh base64
    const [quizName, setQuizName] = useState('');
    const [quizDesc, setQuizDesc] = useState('');
    const [quizSchool, setQuizSchool] = useState('');
    const [quizSubject, setQuizSubject] = useState('');
    const [quizEducationLevel, setQuizEducationLevel] = useState([]);
    const [quizSchoolYear, setQuizSchoolYear] = useState(new Date().getFullYear());
    const [quizTopic, setQuizTopic] = useState('');
    // ref vào các span để hiển  thị validate
    const refQuizName = useRef<any>('');
    const refQuizDesc = useRef<any>('');
    const refQuizSchool = useRef<any>('');
    const refQuizSubject = useRef<any>('');
    const refQuizEducationLevel = useRef<any>('');
    const refQuizSchoolYear = useRef<any>('');
    const refQuizTopic = useRef<any>('');
    const handleChangeImage = useCallback((url: any) => {
        setImageUrl(url);
    }, []); // ở đây phải sử dụng useCallback vì dùng hàm setImageUrl này truyền vào cmp Upload, bên trong cmp Upload phải sử dụng memo

    // Tạo thông tin chung về bài trắc nghiệm
    const createQuizGeneralInfoMutation = useMutationHooks((data: IQuiz) => QuizService.createQuiz(data));

    useEffect(() => {
        if (createQuizGeneralInfoMutation.isSuccess && createQuizGeneralInfoMutation.data) {
            setCurrentTabIndex(1);
            setQuizId(createQuizGeneralInfoMutation?.data?._id);
            toast.success('Tạo bài trắc nghiệm thành công');
            createQuizGeneralInfoMutation.reset();
        } else if (createQuizGeneralInfoMutation.isError) {
            toast.error('Tạo bài trắc nghiệm thất bại. Vui lòng thử lại');
            createQuizGeneralInfoMutation.reset();
        }
    }, [createQuizGeneralInfoMutation.isSuccess, createQuizGeneralInfoMutation.isError]);

    const handleCreateQuizClick = () => {
        if (!quizName || !quizDesc || !quizSchool || !quizSubject) {
            if (!quizName) {
                refQuizName.current.textContent = 'Đây là trường bắt buộc';
            }
            if (!quizDesc) {
                refQuizDesc.current.textContent = 'Đây là trường bắt buộc';
            }
            if (!quizSchool) {
                refQuizSchool.current.textContent = 'Đây là trường bắt buộc';
            }
            if (!quizSubject) {
                refQuizSubject.current.textContent = 'Đây là trường bắt buộc';
            }
            if (quizEducationLevel.length <= 0) {
                refQuizEducationLevel.current.textContent = 'Đây là trường bắt buộc';
            }
            if (!quizSchoolYear) {
                refQuizSchoolYear.current.textContent = 'Đây là trường bắt buộc';
            }
            if (!quizTopic) {
                refQuizTopic.current.textContent = 'Đây là trường bắt buộc';
            }
            return;
        }
        createQuizGeneralInfoMutation.mutate({
            name: quizName,
            description: quizDesc,
            school: quizSchool,
            subject: quizSubject,
            thumb: imageUrl,
            schoolYear: quizSchoolYear,
            topic: quizTopic,
            educationLevel: quizEducationLevel,
        });
    };
    //END
    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
            <div className="px-3 py-4 rounded-lg border-2 shadow-sm w-full md:max-w-96 bg-white">
                <p className="font-semibold pb-2">Ảnh đề thi</p>
                <UploadComponent setImageUrl={handleChangeImage} imageUrl={imageUrl} />
                <div className="flex flex-wrap mt-2">
                    {imageQuizThumbDefault.map((imageSrc, index) => (
                        <button key={index} onClick={() => setImageUrl(imageSrc)} className="w-1/2 px-1 py-1 border">
                            <img src={imageSrc} alt="image-default" className="object-cover w-full" />
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 px-6 py-4 rounded-lg border-2 shadow-sm bg-white">
                <div className="flex flex-col focus-within:text-primary">
                    <div className="mb-2">
                        <label htmlFor="quizName" className="font-semibold">
                            Tên đề thi
                        </label>
                    </div>
                    <Input
                        value={quizName}
                        onChange={(e) => {
                            setQuizName(e.target.value);
                            refQuizName.current.textContent = '';
                        }}
                        autoComplete="off"
                        placeholder="Tên đề thi"
                        type="text"
                        className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                    ></Input>
                    <span className="text-sm text-red-600" ref={refQuizName}></span>
                </div>
                <div className="flex flex-col focus-within:text-primary">
                    <div className="mb-2">
                        <label htmlFor="quizSubject" className="font-semibold">
                            Trình độ
                        </label>
                    </div>
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Please select"
                        value={quizEducationLevel}
                        onChange={(e) => setQuizEducationLevel(e)}
                    >
                        {educationLevels?.map((level, index) => (
                            <Select.Option value={level} key={index}>
                                {level}
                            </Select.Option>
                        ))}
                    </Select>
                    <span className="text-sm text-red-600" ref={refQuizEducationLevel}></span>
                </div>
                <div className="columns-2 gap-4">
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="flex flex-col focus-within:text-primary">
                            <div className="mb-2">
                                <label htmlFor="quizSchool" className="font-semibold">
                                    Năm học
                                </label>
                            </div>
                            <Input
                                onChange={(e) => setQuizSchoolYear(Number(e.target.value))}
                                value={quizSchoolYear}
                                type="number"
                                className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                                placeholder="Năm học"
                            ></Input>
                            <span className="text-sm text-red-600" ref={refQuizSchoolYear}></span>
                        </div>
                    </div>
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="mb-2">
                            <label htmlFor="quizName" className="font-semibold">
                                Chủ đề bài thi
                            </label>
                        </div>
                        <Input
                            value={quizTopic}
                            onChange={(e) => {
                                setQuizTopic(e.target.value);
                            }}
                            autoComplete="off"
                            placeholder="Chủ đề bài thi"
                            type="text"
                            className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                        ></Input>
                        <span className="text-sm text-red-600" ref={refQuizTopic}></span>
                    </div>
                </div>
                <div className="flex flex-col focus-within:text-primary">
                    <div className="mb-2">
                        <label htmlFor="quizDescription" className="font-semibold">
                            Mô tả đề thi
                        </label>
                    </div>
                    <TextArea
                        onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setQuizDesc(e.target.value);
                            refQuizDesc.current.textContent = '';
                        }}
                        value={quizDesc}
                        rows={4}
                        autoComplete="off"
                        placeholder="Mô tả"
                        className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                    ></TextArea>
                    <span className="text-sm text-red-600" ref={refQuizDesc}></span>
                </div>
                <div className="columns-2 gap-4 ">
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="mb-2">
                            <label htmlFor="quizSchool" className="font-semibold">
                                Trường học
                            </label>
                        </div>
                        <Input
                            onChange={(e) => setQuizSchool(e.target.value)}
                            value={quizSchool}
                            className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                            placeholder={'Tên trường học'}
                        ></Input>
                        <span className="text-sm text-red-600" ref={refQuizSchool}></span>
                    </div>
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="mb-2">
                            <label htmlFor="quizSubject" className="font-semibold">
                                Tên môn học
                            </label>
                        </div>

                        <Input
                            value={quizSubject}
                            onChange={(e) => {
                                setQuizSubject(e.target.value);
                                refQuizSubject.current.textContent = '';
                            }}
                            autoComplete="off"
                            placeholder="Tên môn học"
                            type="text"
                            className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                        ></Input>
                        <span className="text-sm text-red-600" ref={refQuizSubject}></span>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleCreateQuizClick}
                        className="py-2 px-4 rounded-md bg-primary text-white font-semibold hover:bg-primary-bold transition"
                    >
                        {createQuizGeneralInfoMutation.isPending ? (
                            <LoadingOutlined />
                        ) : (
                            <FontAwesomeIcon icon={faPlusCircle} />
                        )}{' '}
                        Thêm đề thi mới
                    </button>
                </div>
            </div>
        </div>
    );
};
//region Create question
const CreateQuizQuestion = () => {
    const { quizId } = useContext(QuizIdContext);
    // region QUIZ
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
                        <Select
                            id="questionType"
                            className="sm:w-full lg:w-56"
                            value={questionType}
                            onChange={(e) => setQuestionType(Number(e))}
                        >
                            <Select.Option value={1}>Một đáp án</Select.Option>
                            <Select.Option value={2}>Nhiều đáp án</Select.Option>
                            <Select.Option value={3}>Nối đáp án</Select.Option>
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
const tabContent: Record<number, ReactNode> = {
    0: <CreateQuizGeneralInfo />,
    1: <CreateQuizQuestion />,
    2: <ImportQuestions />,
};
const CreateQuizPageMain = () => {
    const { quizId } = useContext(QuizIdContext);
    const { currentTabIndex, setCurrentTabIndex } = useContext(TabIndexContext);
    const router = useRouter();
    const handleClickTabCauHoi = () => {
        setCurrentTabIndex(1);
        if (currentTabIndex === 0) {
            return toast.warning('Bạn phải tạo thông tin chung của đề thi trước 😉');
        } else {
        }
    };
    const tabs = [
        {
            key: 0,
            label: 'Thông tin chung',
            icon: <FontAwesomeIcon icon={faClipboard} />,
        },
        {
            key: 1,
            label: 'Câu hỏi',
            icon: <FontAwesomeIcon icon={faQuestionCircle} />,
            handleClick: handleClickTabCauHoi,
        },
    ];
    const handleClickImportCauHoi = () => {
        if (!quizId) return toast.warning('Bạn phải tạo thông tin chung của đề thi trước 😉');
        setCurrentTabIndex(2);
    };
    return (
        <div className="bg-opacity-40 py-10">
            <div className="w-full m-auto flex justify-between">
                <h4 className="font-semibold">Tạo đề thi mới</h4>
                <button onClick={() => router.back()} className="rounded-lg bg-red-500 px-2 py-1 text-white">
                    <FontAwesomeIcon icon={faReply} className="mr-1" />
                    Quay lại
                </button>
            </div>
            <div className="w-full m-auto mt-3 px-4 rounded-lg border-2 shadow-sm flex gap-4 bg-white py-3">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={tab.handleClick}
                        className={`${
                            currentTabIndex === tab.key
                                ? 'bg-primary text-white border-primary'
                                : 'border-slate-300 opacity-40'
                        } rounded-3xl px-3 py-2 border-2 transition-all ease-in`}
                    >
                        {tab.icon}
                        <span className="ml-2">{tab.label}</span>
                    </button>
                ))}
                <button
                    onClick={handleClickImportCauHoi}
                    className={`${
                        currentTabIndex === 2 ? 'bg-primary text-white border-primary' : 'border-slate-300 opacity-40'
                    } rounded-3xl px-3 py-2 border-2 transition-all ease-in`}
                >
                    <FontAwesomeIcon icon={faFileImport} />
                    <span className="ml-2">Import câu hỏi</span>
                </button>
            </div>
            <div className="w-full m-auto mt-3 flex justify-center ">{tabContent[currentTabIndex]}</div>
        </div>
    );
};
const CreateQuizPage = () => {
    const router = useRouter();
    const user = useSelector((state: any) => state.user);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!user.email && !loading) {
            console.log(user.email);
            router.push(siteRouter.signIn);
        }
    }, [user, loading]);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2222);
    }, []);
    return <QuizContextProvider>{loading ? <LoadingComponent /> : <CreateQuizPageMain />}</QuizContextProvider>;
};
export default CreateQuizPage;
