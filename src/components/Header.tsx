import React from "react";
import { Languages, Volume2, Sun, Moon, Sparkles } from "lucide-react";
import { LanguageConfig } from "../types";

interface HeaderProps {
  languages: LanguageConfig[];
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  ttsSpeed: number;
  onChangeTtsSpeed: (speed: number) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
  ttsSpeed,
  onChangeTtsSpeed,
  darkMode,
  onToggleDarkMode,
}) => {
  const currentLang = languages.find((l) => l.code === selectedLanguage) || languages[0];

  return (
    <header className="h-14 shrink-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 px-4 flex items-center justify-between z-20">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/20 dark:border-amber-400/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-50 truncate">
              Thai Transliteration
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              PRO
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate hidden sm:inline">
            Camera OCR • RTGS • IPA Phonetics • Tone Guide
          </span>
        </div>
      </div>

      {/* Global Utility Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language Selector */}
        <div className="relative flex items-center bg-neutral-100 dark:bg-neutral-800/90 rounded-xl p-0.5 border border-neutral-200/70 dark:border-neutral-700/60 shadow-2xs">
          <div className="pl-2 pr-1 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 shrink-0">
            <Languages className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs">{currentLang.flag}</span>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => onSelectLanguage(e.target.value)}
            className="text-xs font-semibold bg-transparent text-neutral-800 dark:text-neutral-200 py-1 pl-1 pr-6 border-0 focus:ring-0 cursor-pointer appearance-none outline-none"
            aria-label="Select Target Language"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 text-[10px] text-neutral-400 dark:text-neutral-500">▼</span>
        </div>

        {/* TTS Speed Pill */}
        <div className="hidden md:flex items-center bg-neutral-100 dark:bg-neutral-800/90 rounded-xl px-2 py-1 border border-neutral-200/70 dark:border-neutral-700/60 gap-1.5 shadow-2xs">
          <Volume2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <select
            value={ttsSpeed}
            onChange={(e) => onChangeTtsSpeed(parseFloat(e.target.value))}
            className="text-xs font-mono font-medium bg-transparent text-neutral-700 dark:text-neutral-300 border-0 focus:ring-0 p-0 cursor-pointer outline-none"
            aria-label="Speech Speed"
          >
            <option value="0.5" className="bg-white dark:bg-neutral-900">0.5x</option>
            <option value="0.75" className="bg-white dark:bg-neutral-900">0.75x</option>
            <option value="1.0" className="bg-white dark:bg-neutral-900">1.0x</option>
            <option value="1.2" className="bg-white dark:bg-neutral-900">1.2x</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800/90 border border-neutral-200/70 dark:border-neutral-700/60 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer shadow-2xs"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
        </button>
      </div>
    </header>
  );
};
