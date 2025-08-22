import React, { useState } from 'react';
import Button from '@/components/UI/Button';
import { PlusOutlined, CloseSquareOutlined } from '@ant-design/icons';
import Input from 'antd/es/input/Input';
const CreateQuizPart = ({ callback, isActiveQuizPartNameDialog, setIsActiveQuizPartNameDialog }: any) => {
    const [quizPartName, setQuizPartName] = useState('');
    const handleAddQuizPartName = (partName: string) => {
        if (partName.trim() === '') return;
        callback(partName);
        setIsActiveQuizPartNameDialog(false);
        setQuizPartName('');
    };
    return (
        <div
            className={`${
                isActiveQuizPartNameDialog ? 'block' : 'hidden'
            } z-[999999999] sm:w-full md:w-1/3 bg-white shadow-lg left-1/2 -translate-x-1/2 -translate-y-1/2 absolute rounded px-6 py-6`}
        >
            <div className="block relative">
                <button className="absolute right-0" onClick={() => setIsActiveQuizPartNameDialog(false)}>
                    <CloseSquareOutlined className="text-red-600 text-2xl" />
                </button>
                <div className="mb-5">
                    <label htmlFor="quizPartName">Tên phần thi</label>
                </div>
                <Input
                    id="quizPartName"
                    value={quizPartName}
                    onChange={(e) => setQuizPartName(e.target.value)}
                    autoComplete="off"
                    placeholder="Tên phần thi"
                    className="mb-5 caret-primary px-3 py-2 border-2 rounded w-full outline-primary"
                ></Input>
                <div>
                    <Button
                        onClick={() => handleAddQuizPartName(quizPartName)}
                        className={'float-end bg-camdat'}
                        leftIcon={<PlusOutlined />}
                    >
                        Thêm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuizPart;
