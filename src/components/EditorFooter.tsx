import React from "react";

interface EditorFooterProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  isAIPanelVisible: boolean;
  toggleAIPanel: () => void;
}

const EditorFooter: React.FC<EditorFooterProps> = ({ 
  fontSize, 
  setFontSize, 
  isAIPanelVisible, 
  toggleAIPanel 
}) => {
  const changeFontSize = (delta: number) => {
    setFontSize(Math.max(8, Math.min(32, fontSize + delta)));
  };

  return (
    <div className="bg-gray-200 text-gray-600 border-t border-gray-300 flex items-center justify-between p-1 select-none">
      <button
        className={`px-2 py-1 text-sm rounded ${isAIPanelVisible ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`}
        onClick={toggleAIPanel}
      >
        {isAIPanelVisible ? 'Hide AI Response' : 'Show AI Response'}
      </button>
      <div className="flex items-center">
        <button
          className="px-1.5 text-sm hover:bg-gray-300 border w-6 rounded-l-sm border-gray-300"
          onClick={() => changeFontSize(-1)}
        >
          -
        </button>
        <span className="px-2 text-sm border-y bg-gray-200 w-auto text-center border-gray-300">{fontSize}px</span>
        <button
          className="px-1.5 text-sm hover:bg-gray-300 border w-6 rounded-r-sm border-gray-300"
          onClick={() => changeFontSize(1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default EditorFooter;
