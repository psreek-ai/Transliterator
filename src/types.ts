export interface WordSegment {
  thai: string;
  romanization: string;
  tone: string; // e.g., "mid", "low", "falling", "high", "rising"
  meaning: string;
  ipa: string;
}

export interface TransliterationResult {
  detectedText?: string;
  transliteration: string;
  translation: string;
  ipa: string;
  syllablesCount: number;
  words: WordSegment[];
  pronunciationGuide: string;
  languageNotes: string;
}

export interface PresetPhrase {
  id: string;
  thai: string;
  romanization: string;
  meaning: string;
  result: TransliterationResult;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  locale: string;
  placeholder: string;
  transliterateLabel: string;
  traditionalStyle: string;
  modernStyle: string;
  traditionalFont: string;
  modernFont: string;
  flag: string;
}

export interface HistoryItem {
  id: string;
  original: string;
  romanized: string;
  translation: string;
  result: TransliterationResult;
  timestamp: string;
  language?: string;
}
