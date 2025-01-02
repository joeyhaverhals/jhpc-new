import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Bold, Italic, Link, Image, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onImageUpload,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (onImageUpload && acceptedFiles.length > 0) {
        try {
          const imageUrl = await onImageUpload(acceptedFiles[0]);
          // Insert image URL into editor content
          onChange(value + `\n![Image](${imageUrl})\n`);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    },
  });

  const toolbar = [
    { icon: Bold, label: 'Bold', action: () => formatText('**', '**') },
    { icon: Italic, label: 'Italic', action: () => formatText('_', '_') },
    { icon: Link, label: 'Link', action: () => insertLink() },
    { icon: List, label: 'Bullet List', action: () => insertList('- ') },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertList('1. ') },
  ];

  const formatText = (prefix: string, suffix: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
    onChange(newText);

    // Reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      formatText('[', `](${url})`);
    }
  };

  const insertList = (prefix: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(start);

    // Ensure we start on a new line
    const newPrefix = beforeText.endsWith('\n') ? prefix : '\n' + prefix;
    const newText = `${beforeText}${newPrefix}${afterText}`;
    onChange(newText);

    // Place cursor after the prefix
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + newPrefix.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="border rounded-md">
      <div className="flex items-center space-x-2 p-2 border-b bg-gray-50">
        {toolbar.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={(e) => {
              e.preventDefault();
              action();
            }}
            className="p-1 hover:bg-gray-200 rounded"
            title={label}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          <button className="p-1 hover:bg-gray-200 rounded" title="Upload Image">
            <Image className="h-4 w-4" />
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 min-h-[200px] focus:outline-none"
        placeholder="Write your content here..."
      />
    </div>
  );
};

export default RichTextEditor;
