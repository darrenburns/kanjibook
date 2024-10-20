import React, { useState, useCallback, useEffect } from "react";
import StatsDisplay from "./StatsDisplay";
import { calculateKanjiStats } from "../utils/textAnalysis";

interface SidebarProps {
  content: string;
  selectedText: string;
}

const Sidebar: React.FC<SidebarProps> = ({ content, selectedText }) => {
  const stats = calculateKanjiStats(selectedText || content);
  const [width, setWidth] = useState(384); // 384px is equivalent to w-96
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = e.clientX;
        setWidth(Math.max(250, Math.min(newWidth, 600))); // Min 250px, Max 600px
      }
    },
    [isDragging]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <aside 
      className="bg-white shadow-lg flex flex-col" 
      style={{ width: `${width}px` }}
    >
      <div className="p-4 flex-grow overflow-auto">
        <h2 className="text-2xl font-semibold mb-4">Kanji Stats</h2>
        {selectedText && (
          <p className="text-sm text-gray-600 mb-2">
            Showing stats for selected text
          </p>
        )}
        <StatsDisplay stats={stats} />
      </div>
      <div
        className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize"
        onMouseDown={handleMouseDown}
        style={{ height: '100%', position: 'absolute', left: 0, top: 0 }}
      />
    </aside>
  );
};

export default Sidebar;
