import React, { useState } from "react";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import EditorFooter from "./components/EditorFooter";
import "./App.css";

const App: React.FC = () => {
  const [content, setContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const [highlightedKanji, setHighlightedKanji] = useState<Set<string>>(new Set());

  const toggleKanjiHighlight = (kanji: string) => {
    setHighlightedKanji(prev => {
      const newSet = new Set(prev);
      if (newSet.has(kanji)) {
        newSet.delete(kanji);
      } else {
        newSet.add(kanji);
      }
      return newSet;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="flex-grow flex flex-col overflow-hidden">
        <Editor
          content={content}
          setContent={setContent}
          setSelectedText={setSelectedText}
          fontSize={fontSize}
          highlightedKanji={highlightedKanji}
        />
        <EditorFooter fontSize={fontSize} setFontSize={setFontSize} />
      </div>
      <div className="flex-shrink-0">
        <Sidebar 
          content={content} 
          selectedText={selectedText} 
          toggleKanjiHighlight={toggleKanjiHighlight}
          highlightedKanji={highlightedKanji}
        />
      </div>
    </div>
  );
};

export default App;
