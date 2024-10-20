import React from "react";

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  setSelectedText: (selectedText: string) => void;
  fontSize: number;
}

const Editor: React.FC<EditorProps> = ({ content, setContent, setSelectedText, fontSize }) => {
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectedText(target.value.substring(target.selectionStart, target.selectionEnd));
  };

  return (
    <textarea
      className="w-full h-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      style={{ fontSize: `${fontSize}px` }}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onSelect={handleSelect}
      placeholder="Paste your Japanese text here..."
      lang="ja"
    />
  );
};

export default Editor;
