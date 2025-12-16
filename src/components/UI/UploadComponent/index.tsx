import React, { useRef, useState, memo } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import LazyImage from '../LazyImage';

const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.addEventListener('load', () => callback(reader.result));
};
const beforeUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return false;
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Bạn phải tải tệp ảnh JPG/PNG !');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Ảnh của bạn phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
const UploadComponent = ({ value, onChange, className, ...props }: any) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (event: any) => {
        if (!beforeUpload(event)) return;
        setLoading(true);
        getBase64(event.target.files[0], (base64: any) => {
            setLoading(false);
            onChange(base64); // tra base64 từ event load của reader
        });
    };
    const handleClickOpenInputFile = () => {
        inputRef?.current?.click();
    };
    const UploadButton = () => (
        <button className="w-full hover:cursor-pointer" type="button" onClick={handleClickOpenInputFile}>
            {loading ? <LoadingOutlined /> : <FontAwesomeIcon className="text-[#333]" icon={faImage} />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                <span className="font-semibold">Tải liên</span>
            </div>
        </button>
    );
    return (
        <div className={`${className} hover:cursor-pointer`} {...props}>
            <input
                type="file"
                className="hidden"
                ref={inputRef}
                onChange={handleChange}
                accept="image/jpeg, image/png"
            />
            <div
                className={`border-2 border-dashed h-44 w-full ${
                    value?.length > 0 ? 'py-5' : ''
                } border-primary flex rounded-md justify-center content-center hover:cursor-pointer`}
            >
                {value ? (
                    <button className="w-full h-full" onClick={() => handleClickOpenInputFile()}>
                        {/* <img
                            src={imageUrl}
                            className="rounded-md cursor-pointer w-full object-cover h-full"
                            alt="thumbnail"
                        /> */}
                        <LazyImage src={value} alt="thumbnail" className="w-full h-full hover:cursor-pointer" />
                    </button>
                ) : (
                    <UploadButton />
                )}
            </div>
        </div>
    );
};
export default memo(UploadComponent);
