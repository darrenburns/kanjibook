import React, { useState, useCallback, useEffect } from "react";
import StatsDisplay from "./StatsDisplay";
import { calculateKanjiStats } from "../utils/textAnalysis";

interface SidebarProps {
  content: string;
  selectedText: string;
}

const Sidebar: React.FC<SidebarProps> = ({ content, selectedText }) => {
  const globalStats = calculateKanjiStats(content);
  const selectedStats = calculateKanjiStats(selectedText);
  const [width, setWidth] = useState(384); // 384px is equivalent to w-96
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.classList.add('resize-cursor', 'select-none');
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove('resize-cursor', 'select-none');
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const newWidth = window.innerWidth - e.clientX;
        setWidth(Math.max(250, Math.min(newWidth, 600))); // Min 250px, Max 600px
      }
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <aside 
      className="bg-gray-100 shadow-lg flex flex-col relative" 
      style={{ width: `${width}px` }}
    >
      <div
        className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize absolute left-0 top-0 bottom-0"
        onMouseDown={handleMouseDown}
      />
      <div className="p-6 flex-grow overflow-auto">
        <h2 className="text-2xl font-semibold mb-6">Kanji Stats</h2>
        {selectedText && (
          <p className="text-sm text-gray-600 mb-4">
            Showing stats for selected text
          </p>
        )}
        <StatsDisplay globalStats={globalStats} selectedStats={selectedStats} />
      </div>
    </aside>
  );
};

export default Sidebar;
