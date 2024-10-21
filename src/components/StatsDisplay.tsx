import React from "react";
import { KanjiStats, getKanjiByLevel } from "../utils/textAnalysis";

const jlptColorScale = {
  5: '#2ca02c', // N5 (easiest) - Green
  4: '#82c341', // N4 - Yellow-Green
  3: '#e7ba52', // N3 - Yellow
  2: '#fd8d3c', // N2 - Light Orange
  1: '#d73027', // N1 - Dark Red
  0: '#999999'  // Unknown - Grey
};

interface StatsDisplayProps {
  globalStats: KanjiStats;
  selectedStats: KanjiStats;
  toggleKanjiHighlight: (kanji: string) => void;
  highlightedKanji: Set<string>;
  clearHighlightedKanji: () => void;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  globalStats,
  selectedStats,
  toggleKanjiHighlight,
  highlightedKanji,
  clearHighlightedKanji,
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Kanji Stats</h2>
        {highlightedKanji.size > 0 && (
          <button
            onClick={clearHighlightedKanji}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            Clear Highlights
          </button>
        )}
      </div>

      {/* Add the stat cards here */}
      <div className="grid grid-cols-2 gap-4 mb-6">
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
                jlptLevel={globalStats[kanji].jlptLevel}
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
                jlptLevel={globalCount.jlptLevel}
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
  jlptLevel: number | null;
}

const KanjiItem: React.FC<KanjiItemProps> = ({
  kanji,
  globalCount,
  selectedCount,
  maxCount,
  hasSelection,
  toggleKanjiHighlight,
  isHighlighted,
  jlptLevel,
}) => {
  const percentage = (globalCount / maxCount) * 100;
  const isSelected = hasSelection && selectedCount > 0;
  const jlptColor = jlptColorScale[jlptLevel || 0] as string;

  return (
    <div 
      className={`flex items-center space-x-1 p-1 rounded cursor-pointer ${
        isSelected ? 'bg-blue-50' : ''
      } ${isHighlighted ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => toggleKanjiHighlight(kanji)}
    >
      <span 
        className={`text-2xl w-8 text-center ${isSelected ? 'text-blue-600' : ''} ${
          isHighlighted ? 'font-bold' : ''
        }`}
      >
        {kanji}
      </span>
      <span 
        className="text-xs w-6 font-semibold text-center rounded"
        style={{ 
          color: jlptColor, 
          backgroundColor: `${jlptColor}20`,
          border: `1px solid ${jlptColor}`
        }}
      >
        {jlptLevel ? `N${jlptLevel}` : '-'}
      </span>
      <div className="flex-grow bg-gray-100 rounded-full h-2 min-w-[50px]">
        <div
          className={`rounded-full h-2 ${hasSelection ? (isSelected ? 'bg-blue-500' : 'bg-gray-300') : 'bg-blue-500'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className={`text-md pl-2 font-medium text-right flex-shrink-0 ${isSelected ? 'text-blue-500' : 'text-gray-500'}`}>
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

  return (
    <div className="space-y-2">
      {levels.map((level) => {
        const globalCount = globalKanjiByLevel[level].length;
        const selectedCount = selectedKanjiByLevel ? selectedKanjiByLevel[level].length : undefined;
        const percentage = (globalCount / maxCount) * 100;
        const barColor = jlptColorScale[level === 'Unknown' ? 0 : parseInt(level.slice(1))];

        return (
          <div key={level} className="flex items-center space-x-2">
            <span className="text-sm font-medium w-10">{level === 'Unknown' ? 'Other' : level}</span>
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
