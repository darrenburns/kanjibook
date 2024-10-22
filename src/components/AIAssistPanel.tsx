import React, { useState } from 'react';

interface AIAssistPanelProps {
  selectedText: string;
}

interface AIAssistItem {
  query: string;
  response: string;
}

const AIAssistPanel: React.FC<AIAssistPanelProps> = ({ selectedText }) => {
  const [assistItems, setAssistItems] = useState<AIAssistItem[]>([]);

  const ask = (query: string) => {
    // For now, we'll just add the query to the list without an actual response
    setAssistItems(prevItems => [{
      query,
      response: "AI response will appear here."
    }, ...prevItems]);
  };

  return (
    <div className="space-y-4">
      {selectedText && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Selected Text:</h3>
          <p className="text-sm text-blue-700">{selectedText}</p>
          <button
            onClick={() => ask(selectedText)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Ask AI
          </button>
        </div>
      )}
      {assistItems.map((item, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Query:</h3>
          <p className="text-sm text-gray-700 mb-4">{item.query}</p>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Response:</h3>
          <p className="text-sm text-gray-700">{item.response}</p>
        </div>
      ))}
    </div>
  );
};

export default AIAssistPanel;
