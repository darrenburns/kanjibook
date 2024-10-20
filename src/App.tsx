import React, { useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import EditorFooter from "./components/EditorFooter";

const App: React.FC = () => {
  const [content, setContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [fontSize, setFontSize] = useState(16);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-grow flex flex-col">
        <div className="flex-grow p-4">
          <div className="bg-white shadow-md rounded-md h-full flex flex-col">
            <Editor
              content={content}
              setContent={setContent}
              setSelectedText={setSelectedText}
              fontSize={fontSize}
            />
            <EditorFooter fontSize={fontSize} setFontSize={setFontSize} />
          </div>
        </div>
      </div>
      <Sidebar content={content} selectedText={selectedText} />
    </div>
  );
};

export default App;
