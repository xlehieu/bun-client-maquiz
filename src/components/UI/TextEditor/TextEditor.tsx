'use client';
import configEditor from '@/config/editor';
import JoditEditor from 'jodit-react';
import React, { memo } from 'react';
type TextEditorProps = {
    placeholder?: string;
    value?: any;
    onChange?: (text: string) => void;
};
const TextEditor = ({ placeholder, value, onChange }: TextEditorProps) => {
    return (
        <JoditEditor
            config={{
                ...configEditor,
                placeholder: placeholder || '',
                askBeforePasteHTML: false,
                defaultActionOnPaste: 'insert_as_html',
            }}
            className="mt-2"
            value={value}
            onBlur={(newContent) => onChange?.(newContent)} // preferred to use only this option to update the content for performance reasons
        />
    );
};

export default memo(TextEditor);
