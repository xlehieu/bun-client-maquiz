import TextEditor from '@/components/UI/TextEditor/TextEditor';
import { BodyUpsertQuestionQuiz } from '@/types/quiz.type';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, FormInstance, Radio } from 'antd';
import React from 'react';
type OneNNAnswerProps = {
    form: FormInstance<BodyUpsertQuestionQuiz>;
};
const OneNNAnswer = ({ form }: OneNNAnswerProps) => {
    return (
        <React.Fragment>
            <div className="flex flex-col">
                <div className="mb-2">
                    <label className="font-semibold">Soạn câu hỏi</label>
                </div>
                <Form.Item<BodyUpsertQuestionQuiz> name="questionContent">
                    <TextEditor placeholder="Nhập nội dung câu hỏi" />
                </Form.Item>
            </div>
            <div className="flex flex-col">
                <div>
                    <p className="font-semibold">Câu trả lời</p>
                </div>
                <Form.List name="answers">
                    {(fields, { remove }) => (
                        <>
                            {fields.map(({ key, name }, index) => (
                                <div key={key} className="flex flex-col mt-4">
                                    <div className="flex justify-between content-center">
                                        <div className="flex">
                                            {form.getFieldValue('questionType') === 1 ? (
                                                <Form.Item<BodyUpsertQuestionQuiz['answers']>
                                                    name={[name, 'isCorrect']}
                                                    valuePropName="checked"
                                                >
                                                    <Radio>Đáp án {index + 1}</Radio>
                                                </Form.Item>
                                            ) : (
                                                <Form.Item<BodyUpsertQuestionQuiz['answers']>
                                                    name={[name, 'isCorrect']}
                                                    valuePropName="checked"
                                                >
                                                    <Checkbox>Đáp án {index + 1}</Checkbox>
                                                </Form.Item>
                                            )}
                                        </div>
                                        <Button
                                            className="hover:scale-110 transition-all ease-initial"
                                            onClick={() => remove(index)}
                                        >
                                            <p className="text-red-600">
                                                <DeleteOutlined className="mr-1" />
                                                Xóa đáp án
                                            </p>
                                        </Button>
                                    </div>
                                    <Form.Item<BodyUpsertQuestionQuiz['answers']>
                                        name={[name, 'content']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Nhập câu hỏi',
                                            },
                                        ]}
                                    >
                                        <TextEditor placeholder={`Nhập đáp án ${index + 1}`} />
                                    </Form.Item>
                                </div>
                            ))}
                        </>
                    )}
                </Form.List>
            </div>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    if (e.detail === 0) return;
                    form.setFieldValue('answers', [
                        ...form?.getFieldValue('answers'),
                        {
                            isCorrect: false,
                            content: '',
                        },
                    ]);
                }}
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
    );
};

export default OneNNAnswer;
