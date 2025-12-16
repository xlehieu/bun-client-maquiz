'use client';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as QuizService from '@/api/quiz.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { educationLevels, imageQuizThumbDefault } from '@/common/constants';
import UploadComponent from '@/components/UI/UploadComponent';
import { Input, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import useMutationHooks from '@/hooks/useMutationHooks';
import LazyImage from '@/components/UI/LazyImage';
import { IQuiz } from '@/interface';
import { QuizDetailContext } from '@/context/QuizContext';
import { toast } from 'sonner';
const EditGeneralInformationTab = () => {
    const quizDetail = useContext(QuizDetailContext);
    const [imageUrl, setImageUrl] = useState(''); //Anh base64
    const [quizName, setQuizName] = useState('');
    const [quizDesc, setQuizDesc] = useState('');
    const [quizSchool, setQuizSchool] = useState('');
    const [quizSubject, setQuizSubject] = useState('');

    const [quizTopic, setQuizTopic] = useState('');
    const [quizSchoolYear, setQuizSchoolYear] = useState<number>(new Date().getFullYear());
    const [quizEducationLevel, setQuizEducationLevel] = useState([]);

    const refQuizName = useRef<any>({});
    const refQuizDesc = useRef<any>({});
    const refQuizSchool = useRef<any>({});
    const refQuizSubject = useRef<any>({});
    const handleChangeImage = useCallback(
        (url: string) => {
            setImageUrl(url);
        },
        [imageUrl],
    );
    const updateQuizGeneralMutation = useMutationHooks((data: IQuiz) => QuizService.updateQuizGeneralInfo(data));
    const handleUpdateQuizGeneralInfo = () => {
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
            // if (quizEducationLevel.length <= 0) {
            //     refQuizEducationLevel.current.textContent = 'Đây là trường bắt buộc';
            // }
            // if (!quizSchoolYear) {
            //     refQuizSchoolYear.current.textContent = 'Đây là trường bắt buộc';
            // }
            // if (!quizTopic) {
            //     refQuizTopic.current.textContent = 'Đây là trường bắt buộc';
            // }
            return;
        }
        if (!quizName || !quizSchool || !quizSubject || !quizDesc || !quizDetail._id) {
            return toast.error('Vui lòng kiểm tra lại thông tin');
        }
        updateQuizGeneralMutation.mutate({
            id: quizDetail._id,
            name: quizName,
            description: quizDesc,
            subject: quizSubject,
            school: quizSchool,
            thumb: imageUrl,
            topic: quizTopic,
            schoolYear: quizSchoolYear,
            educationLevel: quizEducationLevel,
        });
    };
    useEffect(() => {
        setImageUrl(quizDetail?.thumb);
        setQuizName(quizDetail?.name);
        setQuizDesc(quizDetail?.description);
        setQuizSchool(quizDetail?.school);
        setQuizSubject(quizDetail?.subject);
        setQuizEducationLevel(quizDetail?.educationLevel);
        setQuizTopic(quizDetail?.topic);
        setQuizSchoolYear(quizDetail?.schoolYear);
    }, [quizDetail]);
    useEffect(() => {
        if (updateQuizGeneralMutation.isSuccess) {
            toast.success('Cập nhật thông tin chung bài trắc nghiệm thành công');
        } else if (updateQuizGeneralMutation.isError) {
            toast.error('Cập nhật thông tin chung bài trắc nghiệm thất bại');
        }
    }, [updateQuizGeneralMutation.isSuccess, updateQuizGeneralMutation.isError]);
    // END GENERAL INFO
    return (
        <section className="bg-white px-2 rounded">
            <div className="grid grid-flow-col grid-cols-11 gap-4">
                <div className="col-span-4 px-3 py-4 bg-white">
                    <p className="font-semibold pb-2">Ảnh đề thi</p>
                    <UploadComponent setImageUrl={handleChangeImage} imageUrl={imageUrl} />
                    <div className="flex flex-wrap mt-2">
                        {imageQuizThumbDefault.map((imageSrc, index) => (
                            <button
                                key={index}
                                onClick={() => setImageUrl(imageSrc)}
                                className="w-1/2 px-1 py-1 border"
                            >
                                <LazyImage src={imageSrc} alt="image-default" className="w-full- h-full" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-span-7 flex flex-col gap-4 px-6 py-4 bg-white">
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
                            }}
                            autoComplete="off"
                            placeholder="Tên đề thi"
                            type="text"
                            className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                        ></Input>
                        <span className="text-sm text-red-600" ref={refQuizName}></span>
                    </div>
                    <div className="columns-2 gap-4 focus-within:text-primary">
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
                                    className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                                    placeholder="Năm học"
                                ></Input>
                            </div>
                        </div>
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
                                // gán lại bằng rỗng khi bắt đầu cập nhật
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
                </div>
            </div>
            <div className="mt-4 w-full flex justify-end bg-white py-3 px-4 rounded shadow-sm">
                <button
                    onClick={handleUpdateQuizGeneralInfo}
                    disabled={updateQuizGeneralMutation.isPending}
                    className="bg-primary px-3 py-2 text-lg text-white rounded transition-all hover:opacity-70 duration-300"
                >
                    {updateQuizGeneralMutation.isPending ? (
                        <LoadingOutlined className="mr-1" />
                    ) : (
                        <FontAwesomeIcon icon={faSave} className="mr-1" />
                    )}
                    Lưu
                </button>
            </div>
        </section>
    );
};
export default EditGeneralInformationTab;
