import React, { useState, useCallback } from "react";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import EditorFooter from "./components/EditorFooter";
import AIResponsePanel from "./components/AIResponsePanel";
import "./App.css";

const App: React.FC = () => {
  const [content, setContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const [highlightedKanji, setHighlightedKanji] = useState<Set<string>>(new Set());
  const [explanation, setExplanation] = useState("");
  const [isAIPanelVisible, setIsAIPanelVisible] = useState(false);

  const toggleKanji = useCallback((kanji: string) => {
    setHighlightedKanji(prev => {
      const newSet = new Set(prev);
      if (newSet.has(kanji)) {
        newSet.delete(kanji);
      } else {
        newSet.add(kanji);
      }
      return newSet;
    });
  }, []);

  const clearHighlightedKanji = useCallback(() => {
    setHighlightedKanji(new Set());
  }, []);

  const toggleAIPanel = useCallback(() => {
    setIsAIPanelVisible(prev => !prev);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="flex-grow flex flex-col overflow-hidden">
        <Editor
          content={content}
          setContent={setContent}
          setSelectedText={setSelectedText}
          fontSize={fontSize}
          highlightedKanji={highlightedKanji}
          setExplanation={setExplanation}
        />
        <EditorFooter 
          fontSize={fontSize} 
          setFontSize={setFontSize} 
          isAIPanelVisible={isAIPanelVisible}
          toggleAIPanel={toggleAIPanel}
        />
        <AIResponsePanel isVisible={isAIPanelVisible} response={explanation} />
      </div>
      <div className="flex-shrink-0">
        <Sidebar 
          content={content} 
          selectedText={selectedText} 
          toggleKanjiHighlight={toggleKanji}
          highlightedKanji={highlightedKanji}
          clearHighlightedKanji={clearHighlightedKanji}
          explanation={explanation}
        />
      </div>
    </div>
  );
};

export default App;
