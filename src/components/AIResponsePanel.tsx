import React from 'react';

interface AIResponsePanelProps {
  isVisible: boolean;
  response: string;
}

const AIResponsePanel: React.FC<AIResponsePanelProps> = ({ isVisible, response }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white border-t border-gray-200 p-4 overflow-auto" style={{ maxHeight: '30vh' }}>
      <h3 className="text-lg font-semibold mb-2">AI Response</h3>
      <p className="whitespace-pre-wrap">{response}</p>
    </div>
  );
};

export default AIResponsePanel;
