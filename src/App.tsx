import React, { useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import EditorFooter from "./components/EditorFooter";

function App() {
  const [content, setContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [fontSize, setFontSize] = useState(16);

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-grow p-6 flex flex-col">
        <h1 className="text-3xl font-bold mb-4">Kanji Counter</h1>
        <div className="flex-grow">
          <Editor
            content={content}
            setContent={setContent}
            setSelectedText={setSelectedText}
            fontSize={fontSize}
          />
        </div>
        <EditorFooter fontSize={fontSize} setFontSize={setFontSize} />
      </main>
      <Sidebar content={content} selectedText={selectedText} />
    </div>
  );
}

export default App;
