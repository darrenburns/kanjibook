import { KANJI, KanjiData } from './jouyouKanji';

export interface TextStats {
  wordCount: number;
  readability: number;
  avgSentenceLength: number;
  grammarScore: number;
  possibleErrors: number;
}

export function calculateStats(text: string): TextStats {
  // This is a placeholder implementation. You'll need to implement actual text analysis logic.
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;

  return {
    wordCount,
    readability: 70 + Math.random() * 30, // Placeholder: random score between 70-100
    avgSentenceLength: wordCount / (sentenceCount || 1),
    grammarScore: 80 + Math.random() * 20, // Placeholder: random score between 80-100
    possibleErrors: Math.floor(Math.random() * 5), // Placeholder: random number of errors 0-4
  };
}

export interface KanjiStats {
  [kanji: string]: {
    count: number;
    jlptLevel: number | null;
    grade: number | null;
  };
}

export function calculateKanjiStats(text: string): KanjiStats {
  const kanjiRegex = /[\u4e00-\u9faf]/g;
  const kanjiMatches = text.match(kanjiRegex) || [];
  
  const stats: KanjiStats = {};
  for (const kanji of kanjiMatches) {
    if (!stats[kanji]) {
      const kanjiData: KanjiData | undefined = KANJI[kanji];
      stats[kanji] = {
        count: 0,
        jlptLevel: kanjiData ? kanjiData.jlpt_new : null,
        grade: kanjiData ? kanjiData.grade : null,
      };
    }
    stats[kanji].count += 1;
  }
  
  return stats;
}

export function getKanjiByLevel(stats: KanjiStats): { [level: string]: string[] } {
  const kanjiByLevel: { [level: string]: string[] } = {
    'N5': [], 'N4': [], 'N3': [], 'N2': [], 'N1': [], 'Unknown': []
  };

  for (const [kanji, info] of Object.entries(stats)) {
    const level = info.jlptLevel ? `N${info.jlptLevel}` : 'Unknown';
    kanjiByLevel[level].push(kanji);
  }

  return kanjiByLevel;
}

export function getKanjiByGrade(stats: KanjiStats): { [grade: string]: string[] } {
  const kanjiByGrade: { [grade: string]: string[] } = {
    '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], 'Secondary': [], 'Unknown': []
  };

  for (const [kanji, info] of Object.entries(stats)) {
    let grade: string;
    if (info.grade === null) {
      grade = 'Unknown';
    } else if (info.grade > 6) {
      grade = 'Secondary';
    } else {
      grade = info.grade.toString();
    }
    kanjiByGrade[grade].push(kanji);
  }

  return kanjiByGrade;
}
