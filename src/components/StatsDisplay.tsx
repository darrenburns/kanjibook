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

  // Sort selected kanji based on their occurrence in the selection
  const sortedSelectedKanji = Object.entries(selectedStats)
    .sort((a, b) => b[1].count - a[1].count);

  // Separate unselected kanji
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
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Selected Kanji
            </h4>
            {sortedSelectedKanji.map(([kanji, selectedCount]) => (
              <KanjiItem
                key={kanji}
                kanji={kanji}
                globalCount={globalStats[kanji].count}
                selectedCount={selectedCount.count}
                maxCount={maxCount}
                hasSelection={hasSelection}
                toggleKanjiHighlight={toggleKanjiHighlight}
                isHighlighted={highlightedKanji.has(kanji)}
              />
            ))}
          </>
        )}
        {unselectedKanji.length > 0 && (
          <>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              {hasSelection ? "Unselected Kanji" : "All Kanji"}
            </h4>
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
          </>
        )}
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
  const hasSelection = selectedValue !== undefined;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h3>
      <p className="text-2xl font-semibold">
        {hasSelection ? (
          <>
            <span className="text-blue-600">{selectedValue}</span>
            <span className="text-gray-300 mx-1">/</span>
          </>
        ) : null}
        <span className={hasSelection ? "text-gray-400" : "text-gray-800"}>{value}</span>
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
      <span className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
        {isSelected ? (
          <>
            <span className="text-blue-600">{selectedCount}</span>
            <span className="text-gray-500"> / {globalCount}</span>
          </>
        ) : globalCount}
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

  // Updated color scale with N5 more towards green and N3 towards yellow
  const colorScale = [
    '#2ca02c', // N5 (easiest) - Green
    '#82c341', // N4 - Yellow-Green
    '#e7ba52', // N3 - Yellow (still visible on white)
    '#fd8d3c', // N2 - Light Orange
    '#d73027', // N1 - Dark Red
    '#999999'  // Unknown - Grey
  ];

  return (
    <div className="space-y-2">
      {levels.map((level, index) => {
        const globalCount = globalKanjiByLevel[level].length;
        const selectedCount = selectedKanjiByLevel ? selectedKanjiByLevel[level].length : undefined;
        const percentage = (globalCount / maxCount) * 100;
        const barColor = colorScale[index];

        return (
          <div key={level} className="flex items-center space-x-2">
            <span className="text-sm font-medium w-16">{level === 'Unknown' ? 'Other' : level}</span>
            <div className="flex-grow bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="h-full"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: barColor
                }}
              ></div>
            </div>
            <span className="text-sm font-medium w-16 text-right">
              {selectedCount !== undefined ? (
                <>
                  <span className="text-blue-600">{selectedCount}</span>
                  <span className="text-gray-500"> / {globalCount}</span>
                </>
              ) : globalCount}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StatsDisplay;
