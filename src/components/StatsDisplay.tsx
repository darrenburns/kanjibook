import React, { useState } from "react";
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
        <div className="flex-grow">
          {highlightedKanji.size > 0 && (
            <button
              onClick={clearHighlightedKanji}
              className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              Clear Highlights
            </button>
          )}
        </div>
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
        <JLPTLevelBreakdown
          globalKanjiByLevel={globalKanjiByLevel}
          selectedKanjiByLevel={hasSelection ? selectedKanjiByLevel : undefined}
        />
      </div>

      {/* Kanji counts */}
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
                meaning={globalStats[kanji].meaning}
                kunyomi={globalStats[kanji].kunyomi}
                onyomi={globalStats[kanji].onyomi}
                frequency={globalStats[kanji].frequency}
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
                meaning={globalCount.meaning}
                kunyomi={globalCount.kunyomi}
                onyomi={globalCount.onyomi}
                frequency={globalCount.frequency}
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
  meaning: string;
  kunyomi: string[];
  onyomi: string[];
  frequency: number | null;
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
  meaning,
  kunyomi,
  onyomi,
  frequency,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const percentage = (globalCount / maxCount) * 100;
  const isSelected = hasSelection && selectedCount > 0;
  const jlptColor = jlptColorScale[jlptLevel || 0] as string;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`mb-2 ${isSelected ? 'bg-blue-50' : ''} rounded-lg overflow-hidden`}>
      <div className="flex items-center space-x-1 p-1">
        <button
          onClick={() => toggleKanjiHighlight(kanji)}
          className={`w-4 h-4 flex-shrink-0 rounded-full border ${
            isHighlighted 
              ? 'bg-blue-500 border-blue-500' 
              : 'bg-white border-gray-300 hover:bg-gray-100'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          title={isHighlighted ? "Remove highlight" : "Highlight kanji"}
        />
        <span 
          onClick={toggleExpand}
          className={`text-2xl w-8 text-center cursor-pointer ${isSelected ? 'text-blue-600' : ''}`}
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
      {isExpanded && (
        <div className="p-3 bg-gray-50 border-t border-gray-200 select-auto">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-gray-800">{meaning}</div>
            {frequency !== null && (
              <span className="text-xs font-medium text-blue-500 border border-blue-200 bg-blue-100 rounded-full px-2 py-0.5">
                #{frequency}
              </span>
            )}
          </div>
          <div className="flex text-sm">
            <div className="flex-1">
              <span className="font-medium text-gray-600">Kun'yomi:</span>
              <div className="text-gray-800">{kunyomi.join(', ') || 'N/A'}</div>
            </div>
            <div className="w-px bg-gray-300 mx-2"></div>
            <div className="flex-1">
              <span className="font-medium text-gray-600">On'yomi:</span>
              <div className="text-gray-800">{onyomi.join(', ') || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}
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
    <div className="flex flex-wrap gap-2">
      {levels.map((level) => {
        const globalCount = globalKanjiByLevel[level].length;
        const selectedCount = selectedKanjiByLevel ? selectedKanjiByLevel[level].length : undefined;
        const percentage = (globalCount / maxCount) * 100;
        const jlptLevel = level === 'Unknown' ? 0 : parseInt(level.slice(1));
        const barColor = jlptColorScale[jlptLevel];

        return (
          <div key={level} className="flex-1 min-w-[100px] mb-1">
            <div className="flex items-center justify-between mb-1.5">
              <span 
                className="text-xs font-semibold text-center rounded px-1"
                style={{ 
                  color: barColor, 
                  backgroundColor: `${barColor}20`,
                  border: `1px solid ${barColor}`
                }}
              >
                {level === 'Unknown' ? 'Other' : level}
              </span>
              <span className="text-xs font-medium">
                {selectedCount !== undefined ? (
                  <>
                    <span className="text-blue-600">{selectedCount}</span>
                    <span className="text-gray-500">/{globalCount}</span>
                  </>
                ) : globalCount}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
              <div
                className="h-full"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: barColor
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsDisplay;
