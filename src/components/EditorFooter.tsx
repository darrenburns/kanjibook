import React, { useState } from "react";
import HelpModal from "./HelpModal";

interface EditorFooterProps {
  fontSize: number;
  setFontSize: (size: number) => void;
}

const EditorFooter: React.FC<EditorFooterProps> = ({ 
  fontSize, 
  setFontSize, 
}) => {
  const [showHelp, setShowHelp] = useState(false);
  
  const changeFontSize = (delta: number) => {
    setFontSize(Math.max(8, Math.min(32, fontSize + delta)));
  };

  return (
    <>
      <div className="bg-gray-200 text-gray-600 border-t border-gray-300 flex items-center justify-between p-1 px-5 select-none">
        <div className="flex items-center gap-4">
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
          
          <button
            className="px-3 py-0.5 text-sm hover:bg-gray-300 border rounded-sm border-gray-300"
            onClick={() => setShowHelp(true)}
          >
            Help
          </button>
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
};

export default EditorFooter;
