import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './texteditor.scss';
const TextEditor = ({
    value,
    onChange,
    placeholder,
}: {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}) => {
    const quillRef = useRef<ReactQuill | null>(null);
    const handleUndo = () => {
        const editor = quillRef.current?.getEditor();
        if (editor) {
            editor.history.undo();
        }
    };

    const handleRedo = () => {
        const editor = quillRef.current?.getEditor();
        if (editor) {
            editor.history.redo();
        }
    };
    const modules = {
        toolbar: [
            [{ align: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
            [{ color: [] }, { background: [] }],

            ['link', 'image'],
            ['clean'],
            [{ list: 'bullet' }, { list: 'ordered' }],
        ],
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true,
        },
    };
    const formats = [
        'font',
        'size',
        'list',
        'align',
        'color',
        'background',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'code-block',
        'link',
        'image',
    ];
    useEffect(() => {
        const textEditor = document.getElementById('text-editor-products_services_management');
        if (textEditor) {
            const qlToolbar = textEditor.querySelector('.ql-toolbar'); // => thẻ div
            if (qlToolbar && !qlToolbar.querySelector('#reundo')) {
                const spanReundo = document.createElement('span');
                spanReundo.className = 'ql-formats';
                spanReundo.id = 'reundo';
                if (spanReundo) {
                    const buttonUndo = document.createElement('button');
                    buttonUndo.className = 'hover:text-[#0569cd]';
                    buttonUndo.innerHTML = `
                    <svg class="w-5 h-5 fill-[#535862] hover:fill-[#0569cd]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.5 6.25H4.88438L7.12625 4.00875L6.25 3.125L2.5 6.875L6.25 10.625L7.12625 9.74062L4.88625 7.5H12.5C13.4946 7.5 14.4484 7.89509 15.1517 8.59835C15.8549 9.30161 16.25 10.2554 16.25 11.25C16.25 12.2446 15.8549 13.1984 15.1517 13.9017C14.4484 14.6049 13.4946 15 12.5 15H7.5V16.25H12.5C13.8261 16.25 15.0979 15.7232 16.0355 14.7855C16.9732 13.8479 17.5 12.5761 17.5 11.25C17.5 9.92392 16.9732 8.65215 16.0355 7.71447C15.0979 6.77678 13.8261 6.25 12.5 6.25Z"></path>
                    </svg>
                    `;
                    buttonUndo.onclick = () => handleUndo();
                    spanReundo.appendChild(buttonUndo);
                    qlToolbar.prepend(spanReundo);
                }
                if (spanReundo) {
                    const buttonRedo = document.createElement('button');
                    buttonRedo.className = 'hover:text-[#0569cd]';
                    buttonRedo.innerHTML = `
                    <svg class="w-5 h-5 fill-[#535862] hover:fill-[#0569cd]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M7.5 6.25H15.1156L12.8737 4.00875L13.75 3.125L17.5 6.875L13.75 10.625L12.8737 9.74062L15.1137 7.5H7.5C6.50544 7.5 5.55161 7.89509 4.84835 8.59835C4.14509 9.30161 3.75 10.2554 3.75 11.25C3.75 12.2446 4.14509 13.1984 4.84835 13.9017C5.55161 14.6049 6.50544 15 7.5 15H12.5V16.25H7.5C6.17392 16.25 4.90215 15.7232 3.96447 14.7855C3.02678 13.8479 2.5 12.5761 2.5 11.25C2.5 9.92392 3.02678 8.65215 3.96447 7.71447C4.90215 6.77678 6.17392 6.25 7.5 6.25Z"></path>
                    </svg>
                    `;
                    buttonRedo.onclick = () => handleRedo();
                    spanReundo.appendChild(buttonRedo);
                    qlToolbar.prepend(spanReundo);
                }
            }
        }
    }, []);
    return (
        <div className="custom-editor-react-quill-new-MAQUIZ w-full h-full">
            <ReactQuill
                ref={quillRef}
                value={value}
                onChange={onChange}
                theme="snow"
                modules={modules}
                formats={formats}
                placeholder={placeholder || 'Nhập văn bản'}
            />
        </div>
    );
};

export default TextEditor;
