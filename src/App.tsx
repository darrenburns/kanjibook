import React, { useState } from "react";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import EditorFooter from "./components/EditorFooter";
import "./App.css";

const App: React.FC = () => {
  const [content, setContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [fontSize, setFontSize] = useState(16);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-grow flex flex-col">
        <div className="flex-grow flex flex-col">
          <Editor
            content={content}
            setContent={setContent}
            setSelectedText={setSelectedText}
            fontSize={fontSize}
          />
          <EditorFooter fontSize={fontSize} setFontSize={setFontSize} />
        </div>
      </div>
      <Sidebar content={content} selectedText={selectedText} />
    </div>
  );
};

export default App;
