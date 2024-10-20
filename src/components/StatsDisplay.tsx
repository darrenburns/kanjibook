import React from "react";
import { KanjiStats } from "../utils/textAnalysis";

interface StatsDisplayProps {
  stats: KanjiStats;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  const sortedKanji = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedKanji[0]?.[1] || 0;
  const totalCount = sortedKanji.reduce((sum, [_, count]) => sum + count, 0);
  const uniqueKanjiCount = sortedKanji.length;

  return (
    <div>
      <div className="mb-4 space-y-1">
        <p className="text-sm font-semibold">Total Kanji: {totalCount}</p>
        <p className="text-sm font-semibold">Unique Kanji: {uniqueKanjiCount}</p>
      </div>
      <div className="space-y-2">
        {sortedKanji.map(([kanji, count]) => (
          <KanjiItem key={kanji} kanji={kanji} count={count} maxCount={maxCount} />
        ))}
      </div>
    </div>
  );
};

interface KanjiItemProps {
  kanji: string;
  count: number;
  maxCount: number;
}

const KanjiItem: React.FC<KanjiItemProps> = ({ kanji, count, maxCount }) => {
  const percentage = (count / maxCount) * 100;
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-2xl w-8">{kanji}</span>
      <div className="flex-grow bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 rounded-full h-4"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm font-semibold">{count}</span>
    </div>
  );
};

export default StatsDisplay;
