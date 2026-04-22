'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = ['bold', 'italic', 'underline', 'list', 'link'];

  return (
    <div className="rich-text-editor">
      <style>{`
        .rich-text-editor .ql-toolbar {
          background: #1c1917;
          border: 1px solid #44403c;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #a8a29e;
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #a8a29e;
        }
        .rich-text-editor .ql-toolbar .ql-picker {
          color: #a8a29e;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #ef4444;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #ef4444;
        }
        .rich-text-editor .ql-container {
          background: #1c1917;
          border: 1px solid #44403c;
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
          min-height: 150px;
          font-size: 1rem;
        }
        .rich-text-editor .ql-editor {
          color: #e7e5e4;
          min-height: 150px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #78716c;
          font-style: normal;
        }
        .rich-text-editor .ql-editor a {
          color: #ef4444;
        }
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-left: 1.5em;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
