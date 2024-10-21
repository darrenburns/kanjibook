import React from "react";
import { KanjiStats, getKanjiByLevel } from "../utils/textAnalysis";

interface StatsDisplayProps {
  globalStats: KanjiStats;
  selectedStats: KanjiStats;
  toggleKanjiHighlight: (kanji: string) => void;
  highlightedKanji: Set<string>;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  globalStats,
  selectedStats,
  toggleKanjiHighlight,
  highlightedKanji,
}) => {
  const sortedGlobalKanji = Object.entries(globalStats).sort(
    (a, b) => b[1].count - a[1].count
  );
  const maxCount = sortedGlobalKanji[0]?.[1].count || 0;
  const globalTotalCount = sortedGlobalKanji.reduce(
    (sum, [_, count]) => sum + count.count,
    0
  );
  const globalUniqueKanjiCount = sortedGlobalKanji.length;
  const selectedTotalCount = Object.values(selectedStats).reduce(
    (sum, count) => sum + count.count,
    0
  );
  const selectedUniqueKanjiCount = Object.keys(selectedStats).length;
  const hasSelection = selectedTotalCount > 0;

  const globalKanjiByLevel = getKanjiByLevel(globalStats);
  const selectedKanjiByLevel = getKanjiByLevel(selectedStats);

  // Separate selected and unselected kanji
  const selectedKanji = sortedGlobalKanji.filter(([kanji]) => selectedStats[kanji]);
  const unselectedKanji = sortedGlobalKanji.filter(([kanji]) => !selectedStats[kanji]);

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <StatCard
          title="Total Kanji"
          value={globalTotalCount}
          selectedValue={hasSelection ? selectedTotalCount : undefined}
        />
        <StatCard
          title="Unique Kanji"
          value={globalUniqueKanjiCount}
          selectedValue={hasSelection ? selectedUniqueKanjiCount : undefined}
        />
      </div>
      
      {/* JLPT Level Breakdown */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">JLPT Level Breakdown</h3>
        <div className="grid grid-cols-3 gap-2">
          {['N5', 'N4', 'N3', 'N2', 'N1', 'Unknown'].map((level) => (
            <JLPTLevelCard
              key={level}
              level={level}
              globalCount={globalKanjiByLevel[level].length}
              selectedCount={hasSelection ? selectedKanjiByLevel[level].length : undefined}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {hasSelection && (
          <>
            {selectedKanji.map(([kanji, globalCount]) => (
              <KanjiItem
                key={kanji}
                kanji={kanji}
                globalCount={globalCount.count}
                selectedCount={selectedStats[kanji]?.count || 0}
                maxCount={maxCount}
                hasSelection={hasSelection}
                toggleKanjiHighlight={toggleKanjiHighlight}
                isHighlighted={highlightedKanji.has(kanji)}
              />
            ))}
            {selectedKanji.length > 0 && unselectedKanji.length > 0 && (
              <div className="border-t border-gray-200 my-4"></div>
            )}
          </>
        )}
        {unselectedKanji.map(([kanji, globalCount]) => (
          <KanjiItem
            key={kanji}
            kanji={kanji}
            globalCount={globalCount.count}
            selectedCount={selectedStats[kanji]?.count || 0}
            maxCount={maxCount}
            hasSelection={hasSelection}
            toggleKanjiHighlight={toggleKanjiHighlight}
            isHighlighted={highlightedKanji.has(kanji)}
          />
        ))}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  selectedValue?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, selectedValue }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h3>
      <p className="text-2xl font-semibold">
        {selectedValue !== undefined ? (
          <>
            <span className="text-blue-600">{selectedValue}</span>
            <span className="text-gray-300 mx-1">/</span>
          </>
        ) : null}
        <span className="text-gray-800">{value}</span>
      </p>
    </div>
  );
};

interface KanjiItemProps {
  kanji: string;
  globalCount: number;
  selectedCount: number;
  maxCount: number;
  hasSelection: boolean;
  toggleKanjiHighlight: (kanji: string) => void;
  isHighlighted: boolean;
}

const KanjiItem: React.FC<KanjiItemProps> = ({
  kanji,
  globalCount,
  selectedCount,
  maxCount,
  hasSelection,
  toggleKanjiHighlight,
  isHighlighted,
}) => {
  const percentage = (globalCount / maxCount) * 100;
  const isSelected = hasSelection && selectedCount > 0;

  return (
    <div 
      className={`flex items-center space-x-2 p-1 rounded cursor-pointer ${
        isSelected ? 'bg-blue-50' : ''
      } ${isHighlighted ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => toggleKanjiHighlight(kanji)}
    >
      <span className={`text-2xl w-8 ${isSelected ? 'text-blue-600' : ''} ${
        isHighlighted ? 'font-bold' : ''
      }`}>
        {kanji}
      </span>
      <div className="flex-grow bg-gray-100 rounded-full h-2">
        <div
          className={`rounded-full h-2 ${hasSelection ? (isSelected ? 'bg-blue-500' : 'bg-gray-300') : 'bg-blue-500'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
        {isSelected ? `${selectedCount} / ${globalCount}` : globalCount}
      </span>
    </div>
  );
};

interface JLPTLevelCardProps {
  level: string;
  globalCount: number;
  selectedCount?: number;
}

const JLPTLevelCard: React.FC<JLPTLevelCardProps> = ({ level, globalCount, selectedCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100 text-center">
      <h4 className="text-sm font-medium text-gray-700 mb-1">{level}</h4>
      <p className="text-lg font-semibold">
        {selectedCount !== undefined ? (
          <>
            <span className="text-blue-600">{selectedCount}</span>
            <span className="text-gray-300 mx-1">/</span>
          </>
        ) : null}
        <span className="text-gray-800">{globalCount}</span>
      </p>
    </div>
  );
};

export default StatsDisplay;
