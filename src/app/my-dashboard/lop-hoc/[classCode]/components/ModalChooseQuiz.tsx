import QuizCard from '@/components/Quiz/QuizCard/QuizCard';
import { useAppSelector } from '@/redux/hooks';
import { BodyCreatePost } from '@/types/posr.type';
import { FormInstance, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

const ModalChooseQuiz = ({
    isOpen,
    onClose,
    form,
}: {
    form: FormInstance<BodyCreatePost>;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { listMyQuiz } = useAppSelector((state) => state.quiz);
    const [chooseQuiz, setChooseQuiz] = useState<Set<string>>(new Set());
    const handleChoose = (id: string) => {
        setChooseQuiz((prev) => {
            const prevSet = new Set(prev);
            if (prevSet.has(id)) {
                prevSet.delete(id);
            } else {
                prevSet.add(id);
            }
            return prevSet;
        });
    };
    useEffect(() => {
        const quizzes = form.getFieldValue('quizzes');
        if (quizzes?.length > 0) {
            setChooseQuiz(new Set(quizzes));
        }
    }, [isOpen]);
    const handleOK = () => {
        form.setFieldValue('quizzes', Array.from(chooseQuiz));
        setChooseQuiz(new Set());
        onClose();
    };
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            title="Chọn đề thi"
            okText="Chọn"
            className="md:min-w-[800px]"
            cancelText="Hủy"
            onOk={handleOK}
        >
            <p className="text-camdat mb-2">Đã chọn: {chooseQuiz.size}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {listMyQuiz.map((quiz) => (
                    <button
                        key={quiz._id}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleChoose(quiz._id);
                        }}
                        className={`border-primary rounded-md ${
                            chooseQuiz.has(quiz._id) ? ' border-2' : 'border-0'
                        } transition-all`}
                    >
                        <QuizCard quizDetail={quiz} showButton={false} />
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default ModalChooseQuiz;
