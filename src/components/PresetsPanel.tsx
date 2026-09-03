import React from "react";
import { BookOpen, Sparkles, Volume2, ChevronRight } from "lucide-react";
import { LanguageConfig, PresetPhrase } from "../types";

interface PresetsPanelProps {
  currentLang: LanguageConfig;
  presets: PresetPhrase[];
  onSelectPreset: (preset: PresetPhrase) => void;
  onSpeak: (text: string) => void;
}

export const PresetsPanel: React.FC<PresetsPanelProps> = ({
  currentLang,
  presets,
  onSelectPreset,
  onSpeak,
}) => {
  return (
    <div className="h-full flex flex-col min-h-0 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Curated {currentLang.name} Phrasebook</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold">
          {presets.length} Presets
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto my-2 pr-1 space-y-2.5">
        {presets.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectPreset(item)}
            className="p-3 bg-neutral-50 dark:bg-neutral-950/60 hover:bg-amber-500/5 dark:hover:bg-amber-950/20 border border-neutral-200/70 dark:border-neutral-800 hover:border-amber-500/40 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex flex-col min-w-0 pr-2">
              <div className="flex items-baseline gap-2">
                <span className={`text-base font-bold text-neutral-900 dark:text-white ${currentLang.traditionalFont}`}>
                  {item.thai}
                </span>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {item.romanization}
                </span>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                {item.meaning}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(item.thai);
                }}
                className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <div className="w-6 h-6 rounded-lg bg-neutral-200/50 dark:bg-neutral-800 group-hover:bg-amber-500 group-hover:text-black text-neutral-400 flex items-center justify-center transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
