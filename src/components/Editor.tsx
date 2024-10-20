import React, { useRef, useEffect } from "react";

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  setSelectedText: (selectedText: string) => void;
  fontSize: number;
  highlightedKanji: Set<string>;
}

const Editor: React.FC<EditorProps> = ({ 
  content, 
  setContent, 
  setSelectedText, 
  fontSize, 
  highlightedKanji 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerText);
    }
  };

  const handleSelect = () => {
    const selection = window.getSelection();
    if (selection) {
      setSelectedText(selection.toString());
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      const kanjiRegex = /[\u4e00-\u9faf]/g;
      const highlightedContent = content.split('\n').map(line => 
        line.replace(kanjiRegex, (kanji) => {
          if (highlightedKanji.has(kanji)) {
            return `<span class="highlighted-kanji">${kanji}</span>`;
          }
          return kanji;
        })
      ).join('<br>');
      editorRef.current.innerHTML = highlightedContent;
    }
  }, [content, highlightedKanji]);

  return (
    <div
      ref={editorRef}
      className="w-full h-full p-4 focus:outline-none border-r overflow-auto whitespace-pre-wrap"
      style={{ fontSize: `${fontSize}px` }}
      contentEditable
      onInput={handleInput}
      onSelect={handleSelect}
      suppressContentEditableWarning={true}
    />
  );
};

export default Editor;
