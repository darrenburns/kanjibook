import React from "react";

interface EditorFooterProps {
  fontSize: number;
  setFontSize: (size: number) => void;
}

const EditorFooter: React.FC<EditorFooterProps> = ({ fontSize, setFontSize }) => {
  const changeFontSize = (delta: number) => {
    setFontSize(Math.max(8, Math.min(32, fontSize + delta)));
  };

  return (
    <div className="bg-white border-t border-gray-200 p-2 flex items-center justify-end">
      <span className="mr-2">Font Size:</span>
      <button
        className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
        onClick={() => changeFontSize(-1)}
      >
        -
      </button>
      <span className="px-2 py-1 bg-gray-100">{fontSize}px</span>
      <button
        className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
        onClick={() => changeFontSize(1)}
      >
        +
      </button>
    </div>
  );
};

export default EditorFooter;
