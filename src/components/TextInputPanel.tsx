import React from "react";
import { 
  Languages, 
  Sparkles, 
  RotateCcw, 
  CornerDownLeft, 
  X, 
  Volume2, 
  Keyboard 
} from "lucide-react";
import { LanguageConfig, PresetPhrase } from "../types";

interface TextInputPanelProps {
  currentLang: LanguageConfig;
  inputText: string;
  onChangeInputText: (val: string) => void;
  transliterateMode: "thai-to-roman" | "roman-to-thai";
  onToggleMode: () => void;
  onTransliterate: () => void;
  loading: boolean;
  presets: PresetPhrase[];
  onSelectPreset: (preset: PresetPhrase) => void;
}

export const TextInputPanel: React.FC<TextInputPanelProps> = ({
  currentLang,
  inputText,
  onChangeInputText,
  transliterateMode,
  onToggleMode,
  onTransliterate,
  loading,
  presets,
  onSelectPreset,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onTransliterate();
    }
  };

  const isNativeToRoman = transliterateMode === "thai-to-roman";

  return (
    <div className="h-full flex flex-col min-h-0 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-4 shadow-sm">
      {/* Direction & Mode Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <Keyboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Interactive Text Engine</span>
        </div>

        <button
          onClick={onToggleMode}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl border border-amber-500/20 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          title="Toggle conversion direction"
        >
          <Languages className="w-3.5 h-3.5" />
          <span>
            {isNativeToRoman
              ? `${currentLang.flag} ${currentLang.name} ➔ 🔤 Roman`
              : `🔤 Roman ➔ ${currentLang.flag} ${currentLang.name}`}
          </span>
        </button>
      </div>

      {/* Text Area Container */}
      <div className="flex-1 min-h-0 relative my-2.5 flex flex-col">
        <textarea
          value={inputText}
          onChange={(e) => onChangeInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isNativeToRoman
              ? `Type or paste ${currentLang.name} text (e.g. ${currentLang.placeholder})...`
              : `Type romanized phonetic spelling (e.g. sawatdee, khop khun, aroi mak)...`
          }
          className={`w-full flex-1 p-3.5 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 rounded-xl resize-none outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm leading-relaxed text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-all ${
            isNativeToRoman ? currentLang.traditionalFont : "font-sans"
          }`}
          lang={currentLang.code}
          autoFocus
        />

        {/* Floating Clear Button */}
        {inputText && (
          <button
            onClick={() => onChangeInputText("")}
            className="absolute top-2.5 right-2.5 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 bg-white/80 dark:bg-neutral-800/80 rounded-md transition-colors cursor-pointer"
            title="Clear text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Thai Quick Insertion Toolbar */}
      {currentLang.code === "th" && isNativeToRoman && (
        <div className="shrink-0 mb-2.5 p-2 bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200/60 dark:border-neutral-800/80 rounded-xl">
          <div className="flex items-center justify-between text-[10px] font-mono font-medium text-neutral-400 mb-1.5 px-0.5">
            <span>Thai Quick Particles & Tones</span>
            <span className="text-amber-600 dark:text-amber-400">Click to append</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
            {["ครับ", "ค่ะ", "นะคะ", "ไหม", "ขอบคุณ", "ไม่เป็นไร", "่", "้", "๊", "๋", "์", "ๆ"].map((char, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChangeInputText(inputText + char)}
                className="shrink-0 px-2 py-0.5 bg-white dark:bg-neutral-900 hover:bg-amber-500/10 hover:border-amber-500/40 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-800 rounded-md text-xs font-semibold font-thai-looped transition-all cursor-pointer shadow-2xs"
                title={`Insert ${char}`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Romanized Suggestions when in Roman-to-Thai Mode */}
      {!isNativeToRoman && (
        <div className="shrink-0 mb-2.5 p-2 bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200/60 dark:border-neutral-800/80 rounded-xl">
          <div className="flex items-center justify-between text-[10px] font-mono font-medium text-neutral-400 mb-1.5 px-0.5">
            <span>Common Phonetics</span>
            <span className="text-amber-600 dark:text-amber-400">Click to test</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {[
              { roman: "sawatdee khrap", label: "Hello" },
              { roman: "khop khun mak", label: "Thank you" },
              { roman: "mai pen rai", label: "No worries" },
              { roman: "aroi mak", label: "Delicious" },
              { roman: "yin dee", label: "Welcome" }
            ].map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChangeInputText(item.roman)}
                className="shrink-0 px-2.5 py-0.5 bg-white dark:bg-neutral-900 hover:bg-amber-500/10 hover:border-amber-500/40 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-800 rounded-md text-xs font-medium transition-all cursor-pointer shadow-2xs"
              >
                <span>{item.roman}</span>
                <span className="text-[10px] text-neutral-400 ml-1">({item.label})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preset Quick Chips */}
      {presets.length > 0 && (
        <div className="shrink-0 mb-3">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Quick Sample Phrases
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {presets.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectPreset(item)}
                className="shrink-0 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/10 hover:border-amber-500/30 dark:hover:bg-amber-950/30 border border-neutral-200/60 dark:border-neutral-750 rounded-lg text-xs text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer truncate max-w-[140px]"
                title={`${item.thai} — ${item.meaning}`}
              >
                <span className={`font-semibold mr-1 ${currentLang.traditionalFont}`}>{item.thai}</span>
                <span className="text-[10px] text-neutral-400">({item.meaning})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 shrink-0">
        <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
          <span>{inputText.length} chars</span>
          <span className="hidden sm:inline opacity-60">• Press ⌘+Enter</span>
        </div>

        <button
          onClick={onTransliterate}
          disabled={loading || !inputText.trim()}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-black font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Transliterating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transliterate & Analyze</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
