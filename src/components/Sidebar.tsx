import React, { useState, useCallback, useEffect, useRef } from "react";
import StatsDisplay from "./StatsDisplay";
import { calculateKanjiStats } from "../utils/textAnalysis";

interface SidebarProps {
  content: string;
  selectedText: string;
  toggleKanjiHighlight: (kanji: string) => void;
  highlightedKanji: Set<string>;
  clearHighlightedKanji: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  content, 
  selectedText, 
  toggleKanjiHighlight,
  highlightedKanji,
  clearHighlightedKanji
}) => {
  const globalStats = calculateKanjiStats(content);
  const selectedStats = calculateKanjiStats(selectedText);
  const [width, setWidth] = useState(384); // 384px is equivalent to w-96
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback((e: MouseEvent) => {
    if (sidebarRef.current) {
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.max(250, Math.min(newWidth, 600))); // Min 250px, Max 600px
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [handleResize]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.removeProperty('cursor');
    document.body.style.removeProperty('user-select');
  }, [handleResize]);

  useEffect(() => {
    const resizeHandle = resizeHandleRef.current;
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', handleMouseDown as any);
    }
    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener('mousedown', handleMouseDown as any);
      }
    };
  }, [handleMouseDown]);

  return (
    <aside 
      ref={sidebarRef}
      className="bg-white shadow-lg flex flex-col relative h-screen no-select" 
      style={{ width: `${width}px`, minWidth: '250px', maxWidth: '600px' }}
    >
      <div
        ref={resizeHandleRef}
        className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize absolute left-0 top-0 bottom-0"
      />
      <div className="p-6 flex-grow overflow-auto">
        <StatsDisplay 
          globalStats={globalStats} 
          selectedStats={selectedStats} 
          toggleKanjiHighlight={toggleKanjiHighlight}
          highlightedKanji={highlightedKanji}
          clearHighlightedKanji={clearHighlightedKanji}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
