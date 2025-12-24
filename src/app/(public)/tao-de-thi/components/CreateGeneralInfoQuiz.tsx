'use client';
import useMutationHooks from '@/hooks/useMutationHooks';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
//Components
import * as QuizService from '@/api/quiz.service';
import UploadComponent from '@/components/UI/UploadComponent';
//
import { educationLevels, imageQuizThumbDefault } from '@/common/constants';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Input, Select, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchListQuestionType } from '@/redux/slices/questionType.slice';
import { BodyCreateGeneralInformationQuiz } from '@/types/quiz.type';
import { toast } from 'sonner';
import { setCurrentCreateQuizId } from '@/redux/slices/quiz.slice';

const CreateGeneralInfoQuiz = () => {
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
        <Form form={form} initialValues={{ isUseChatBot: false }} layout="vertical" onFinish={handleCreateQuizClick}>
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
                    <div className="flex flex-col">
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
                            <Input autoComplete="off" placeholder="Tên đề thi" type="text"></Input>
                        </Form.Item>
                    </div>
                    <div className="flex flex-col">
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
                        <div className="flex flex-col">
                            <div className="flex flex-col">
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
                                    <Input type="number" placeholder="Năm học"></Input>
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex flex-col">
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
                    <div className="flex flex-col">
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
                            <TextArea rows={4} autoComplete="off" placeholder="Mô tả"></TextArea>
                        </Form.Item>
                    </div>
                    <div className="columns-2 gap-4 ">
                        <div className="flex flex-col">
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
                                <Input placeholder={'Tên trường học'}></Input>
                            </Form.Item>
                        </div>
                        <div className="flex flex-col">
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
                    <div className="flex flex-row items-center gap-3">
                        <Form.Item<BodyCreateGeneralInformationQuiz> name="isUseChatBot">
                            <Switch></Switch>
                        </Form.Item>
                        <label htmlFor="isUseChatBot" className="mb-6">
                            Cho phép sử dụng chat GPT
                        </label>
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

export default CreateGeneralInfoQuiz;
