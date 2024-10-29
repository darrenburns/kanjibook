import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Keyboard Shortcuts</h2>
        <ul className="space-y-2 mb-6">
          <li><strong>Ctrl+J (Cmd+J on Mac):</strong> Search in Jisho</li>
          <li><strong>Ctrl+P (Cmd+P on Mac):</strong> Search in JPDB</li>
          <li><strong>Ctrl+W (Cmd+W on Mac):</strong> Search in WaniKani</li>
          <li><strong>Ctrl+L (Cmd+L on Mac):</strong> Ask AI</li>
        </ul>
        <p className="text-sm text-gray-600 mb-4">
          Note: These shortcuts work when text is selected in the editor.
        </p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
