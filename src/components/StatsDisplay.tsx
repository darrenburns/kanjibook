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
        <JLPTLevelBreakdown
          globalKanjiByLevel={globalKanjiByLevel}
          selectedKanjiByLevel={hasSelection ? selectedKanjiByLevel : undefined}
        />
      </div>

      {/* Kanji counts */}
      <h3 className="text-lg font-semibold mb-2">Kanji Counts</h3>
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

interface JLPTLevelBreakdownProps {
  globalKanjiByLevel: { [level: string]: string[] };
  selectedKanjiByLevel?: { [level: string]: string[] };
}

const JLPTLevelBreakdown: React.FC<JLPTLevelBreakdownProps> = ({ globalKanjiByLevel, selectedKanjiByLevel }) => {
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1', 'Unknown'];
  const maxCount = Math.max(...levels.map(level => globalKanjiByLevel[level].length));

  return (
    <div className="space-y-2">
      {levels.map((level) => {
        const globalCount = globalKanjiByLevel[level].length;
        const selectedCount = selectedKanjiByLevel ? selectedKanjiByLevel[level].length : undefined;
        const percentage = (globalCount / maxCount) * 100;

        return (
          <div key={level} className="flex items-center space-x-2">
            <span className="text-sm font-medium w-16">{level}</span>
            <div className="flex-grow bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full ${selectedCount !== undefined ? 'bg-blue-500' : 'bg-gray-400'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium w-16 text-right">
              {selectedCount !== undefined ? `${selectedCount} / ${globalCount}` : globalCount}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StatsDisplay;
