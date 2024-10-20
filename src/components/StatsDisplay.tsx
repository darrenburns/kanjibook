import React from "react";
import { KanjiStats } from "../utils/textAnalysis";

interface StatsDisplayProps {
  globalStats: KanjiStats;
  selectedStats: KanjiStats;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ globalStats, selectedStats }) => {
  const sortedGlobalKanji = Object.entries(globalStats).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedGlobalKanji[0]?.[1] || 0;
  const globalTotalCount = sortedGlobalKanji.reduce((sum, [_, count]) => sum + count, 0);
  const globalUniqueKanjiCount = sortedGlobalKanji.length;
  const selectedTotalCount = Object.values(selectedStats).reduce((sum, count) => sum + count, 0);
  const selectedUniqueKanjiCount = Object.keys(selectedStats).length;
  const hasSelection = selectedTotalCount > 0;

  return (
    <div>
      <div className="mb-4 space-y-1">
        <p className="text-sm font-semibold">
          Total Kanji: {hasSelection ? `${selectedTotalCount} / ` : ''}{globalTotalCount}
        </p>
        <p className="text-sm font-semibold">
          Unique Kanji: {hasSelection ? `${selectedUniqueKanjiCount} / ` : ''}{globalUniqueKanjiCount}
        </p>
      </div>
      <div className="space-y-2">
        {sortedGlobalKanji.map(([kanji, globalCount]) => (
          <KanjiItem 
            key={kanji} 
            kanji={kanji} 
            globalCount={globalCount} 
            selectedCount={selectedStats[kanji] || 0} 
            maxCount={maxCount} 
            hasSelection={hasSelection}
          />
        ))}
      </div>
    </div>
  );
};

interface KanjiItemProps {
  kanji: string;
  globalCount: number;
  selectedCount: number;
  maxCount: number;
  hasSelection: boolean;
}

const KanjiItem: React.FC<KanjiItemProps> = ({ kanji, globalCount, selectedCount, maxCount, hasSelection }) => {
  const percentage = (globalCount / maxCount) * 100;
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-2xl w-8">{kanji}</span>
      <div className="flex-grow bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 rounded-full h-4"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm font-semibold">
        {hasSelection && selectedCount > 0 ? `${selectedCount} / ${globalCount}` : globalCount}
      </span>
    </div>
  );
};

export default StatsDisplay;
