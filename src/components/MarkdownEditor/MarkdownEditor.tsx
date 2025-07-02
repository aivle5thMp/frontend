import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import './MarkdownEditor.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  height = 600,
  placeholder,
  disabled = false
}) => {
  return (
    <div className="markdown-editor-wrapper">
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        hideToolbar={false}
        visibleDragbar={false}
        preview="live"
        data-color-mode="light"
        textareaProps={{
          placeholder: value ? '' : (placeholder || '내용을 입력하세요...'),
          disabled
        }}
      />
    </div>
  );
};

export default MarkdownEditor; 