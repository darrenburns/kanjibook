import React from "react";

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Ctrl + /</span>
            <span>Toggle AI Assistant</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Ctrl + Shift + K</span>
            <span>Clear Highlighted Kanji</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Ctrl + .</span>
            <span>Switch Sidebar Tab</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Ctrl + Shift + A</span>
            <span>Ask AI About Selection</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
