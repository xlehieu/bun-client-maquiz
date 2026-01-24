'use client';
import * as QuizService from '@/api/quiz.service';
import { educationLevels, imageQuizThumbDefault, UNIVERSITIES } from '@/common/constants';
import LazyImage from '@/components/UI/LazyImage';
import UploadComponent from '@/components/UI/UploadComponent';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { BodyCreateGeneralInformationQuiz } from '@/@types/quiz.type';
import { LoadingOutlined } from '@ant-design/icons';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faImage, faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { COLLECTION_NAME, useCollection } from '@/features/admin/tai-nguyen-he-thong/subject/collection.tanstack';
import { fetchQuizDetail } from '@/redux/slices/quiz.slice';

const EditGeneralInformationTab = () => {
    const params = useParams();
    const { quizDetail } = useAppSelector((state) => state.quiz);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const { data: listSchool } = useCollection(COLLECTION_NAME.SCHOOL, [COLLECTION_NAME.SCHOOL]);
    const { data: listSubject } = useCollection(COLLECTION_NAME.SUBJECT, [COLLECTION_NAME.SUBJECT]);
    const handleSubmitForm = async (formValue: BodyCreateGeneralInformationQuiz) => {
        try {
            setIsLoading(true);
            if (params.id && !Array.isArray(params.id)) {
                await QuizService.updateQuizGeneralInfo(params.id, formValue);
                toast.success('Cập nhật thông tin chung bài trắc nghiệm thành công');
            }
        } catch (error) {
            toast.error('Cập nhật thông tin chung bài trắc nghiệm thất bại');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (quizDetail) {
            form.setFieldsValue({ ...quizDetail });
        }
    }, [quizDetail, form]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitForm}
            className="space-y-8 animate-in fade-in duration-500"
        >
            <div className="bg-white overflow-hidden">
                <Row gutter={[40, 32]}>
                    {/* CỘT TRÁI: HÌNH ẢNH */}
                    <Col xs={24} lg={8}>
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-slate-800 mb-4">
                                <FontAwesomeIcon icon={faImage} className="text-primary" />
                                <span className="font-bold uppercase tracking-wider text-xs">Hình ảnh đại diện</span>
                            </div>
                            <Form.Item name="thumb" className="mb-4">
                                <UploadComponent />
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-3">
                                {imageQuizThumbDefault.map((imageSrc, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() => form.setFieldValue('thumb', imageSrc)}
                                        className="relative aspect-video  overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary transition-all group"
                                    >
                                        <LazyImage src={imageSrc} alt="default" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-[10px] font-bold bg-primary/80 px-2 py-1 rounded">
                                                Chọn
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Col>

                    {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
                    <Col xs={24} lg={16}>
                        <div className="space-y-5">
                            <Form.Item
                                name="name"
                                label={<span className="font-bold text-slate-600">Tên đề thi</span>}
                                rules={[{ required: true, message: 'Tên đề thi là bắt buộc' }]}
                            >
                                <Input
                                    className=" border-slate-200 hover:border-primary focus:border-primary"
                                    placeholder="Nhập tên đề thi hấp dẫn..."
                                />
                            </Form.Item>
                            <Row gutter={[12, 0]} className="m-0">
                                <Col span={12}>
                                    <Form.Item
                                        name="schoolYear"
                                        label={<span className="font-bold text-slate-600">Năm học</span>}
                                        rules={[{ required: true, message: 'Năm học là bắt buộc' }]}
                                    >
                                        <Input type="number" className="" placeholder="2024" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="educationLevel"
                                        label={<span className="font-bold text-slate-600">Trình độ</span>}
                                        rules={[{ required: true, message: 'Vui lòng chọn trình độ' }]}
                                    >
                                        <Select mode="multiple" className="" placeholder="Chọn trình độ">
                                            {educationLevels?.map((level) => (
                                                <Select.Option value={level} key={level}>
                                                    {level}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item<BodyCreateGeneralInformationQuiz>
                                name="school"
                                label={<span className="font-bold text-slate-600">Trường học</span>}
                                rules={[{ required: true, message: 'Vui lòng chọn trình độ' }]}
                            >
                                <Select mode='tags' className="" placeholder="Chọn trường học">
                                    {listSchool?.map((school) => (
                                        <Select.Option value={school.TenMuc} key={school._id}>
                                            {school.TenMuc}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="subject"
                                label={<span className="font-bold text-slate-600">Môn học</span>}
                                rules={[{ required: true, message: 'Chọn ít nhất một môn học' }]}
                            >
                                <Select mode="tags"  className="" placeholder="Toán, Lý, Hóa...">
                                    {listSubject?.map((subject) => (
                                        <Select.Option value={subject.TenMuc} key={subject._id}>
                                            {subject.TenMuc}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label={<span className="font-bold text-slate-600">Mô tả chi tiết</span>}
                                rules={[{ required: true, message: 'Mô tả bài thi là bắt buộc' }]}
                            >
                                <TextArea
                                    rows={4}
                                    className=" p-4"
                                    placeholder="Viết mô tả ngắn gọn về nội dung đề thi này..."
                                />
                            </Form.Item>

                            <div className="p-5 bg-blue-50/50 rounded-2xl flex items-center justify-between border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                        <FontAwesomeIcon icon={faRobot} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 leading-none">Hỗ trợ AI (ChatGPT)</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Cho phép học sinh sử dụng AI giải thích đáp án
                                        </p>
                                    </div>
                                </div>
                                <Form.Item name="isUseChatBot" valuePropName="checked" className="mb-0">
                                    <Switch className="bg-slate-300" />
                                </Form.Item>
                            </div>
                            <div className="p-5 bg-blue-50/50 rounded-2xl flex items-center justify-between border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="font-bold text-slate-700 leading-none">Ẩn bài thi</p>
                                    </div>
                                </div>
                                <Switch
                                    className="bg-slate-300"
                                    value={quizDetail?.isDisabled || false}
                                    onChange={async () => {
                                        if (quizDetail?._id) {
                                            await QuizService.changeUserQuizDisabled(quizDetail?._id);
                                            dispatch(fetchQuizDetail(quizDetail?._id));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex justify-end pt-6 border-t border-slate-100">
                <Button
                    onClick={form.submit}
                    disabled={isLoading}
                    className="h-14 px-10 rounded-2xl bg-gradient-to-r from-[#2b76b9] to-[#04b78a] text-white border-none font-black text-lg shadow-[0_10px_20px_-5px_rgba(4,183,138,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(4,183,138,0.5)] transition-all active:scale-95 flex items-center gap-2"
                >
                    {isLoading ? <LoadingOutlined /> : <FontAwesomeIcon icon={faSave} />}
                    LƯU THÔNG TIN
                </Button>
            </div>
        </Form>
    );
};

export default EditGeneralInformationTab;
