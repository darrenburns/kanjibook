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
    <div className="bg-gray-100 border border-t-0 border-gray-200 p-2 flex items-center justify-end rounded-b-md">
      <button
        className="px-2 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded-l"
        onClick={() => changeFontSize(-1)}
      >
        -
      </button>
      <span className="px-2 py-1 bg-white border-y border-gray-300">{fontSize}px</span>
      <button
        className="px-2 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded-r"
        onClick={() => changeFontSize(1)}
      >
        +
      </button>
    </div>
  );
};

export default EditorFooter;
