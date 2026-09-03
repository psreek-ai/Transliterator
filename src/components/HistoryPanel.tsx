import React from "react";
import { History, Trash2, Volume2, ChevronRight, CornerDownLeft } from "lucide-react";
import { HistoryItem, LanguageConfig } from "../types";

interface HistoryPanelProps {
  currentLang: LanguageConfig;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
  onSpeak: (text: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  currentLang,
  history,
  onSelectHistory,
  onDeleteHistory,
  onClearHistory,
  onSpeak,
}) => {
  return (
    <div className="h-full flex flex-col min-h-0 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Recent Transliterations</span>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[11px] text-neutral-400 hover:text-red-500 flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto my-2 pr-1 space-y-2.5">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
            <History className="w-8 h-8 stroke-[1.5] mb-2 opacity-40" />
            <p className="text-xs">No recent transliterations yet.</p>
            <span className="text-[10px] text-neutral-500 mt-1">
              Scans and text inputs will appear here for fast recall.
            </span>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="p-3 bg-neutral-50 dark:bg-neutral-950/60 hover:bg-amber-500/5 dark:hover:bg-amber-950/20 border border-neutral-200/70 dark:border-neutral-800 hover:border-amber-500/40 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-baseline gap-2">
                  <span className={`text-base font-bold text-neutral-900 dark:text-white ${currentLang.traditionalFont}`}>
                    {item.original}
                  </span>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {item.romanized}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
                    {item.translation}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                    • {item.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(item.original);
                  }}
                  className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                  title="Pronounce"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => onDeleteHistory(item.id, e)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                  title="Delete from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
