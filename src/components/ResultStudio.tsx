import React, { useState } from "react";
import { 
  Volume2, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  Info, 
  Layers, 
  Play, 
  Pause,
  MessageSquare,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { LanguageConfig, TransliterationResult } from "../types";

interface ResultStudioProps {
  currentLang: LanguageConfig;
  result: TransliterationResult | null;
  loading: boolean;
  errorMessage: string | null;
  isPlayingTts: boolean;
  onSpeak: (text: string) => void;
  onSpeakWord: (word: string) => void;
  onSelectSample: (text: string) => void;
  fontStyleMode: "both" | "traditional" | "modern";
  onChangeFontStyleMode: (mode: "both" | "traditional" | "modern") => void;
  ttsSpeed?: number;
  onChangeTtsSpeed?: (speed: number) => void;
}

export const ResultStudio: React.FC<ResultStudioProps> = ({
  currentLang,
  result,
  loading,
  errorMessage,
  isPlayingTts,
  onSpeak,
  onSpeakWord,
  onSelectSample,
  fontStyleMode,
  onChangeFontStyleMode,
  ttsSpeed = 1.0,
  onChangeTtsSpeed,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "breakdown" | "insights">("overview");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showToneGuide, setShowToneGuide] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getToneBadge = (toneStr: string) => {
    const t = toneStr.toLowerCase();
    if (t.includes("falling") || t.includes("4th") || t.includes("โท")) {
      return {
        label: "Falling ⤵",
        fullLabel: "Falling Tone (โท) ⤵",
        pitch: "51 (High peak dropping)",
        className: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
      };
    }
    if (t.includes("rising") || t.includes("2nd") || t.includes("จัตวา")) {
      return {
        label: "Rising ⤴",
        fullLabel: "Rising Tone (จัตวา) ⤴",
        pitch: "214 (Dips then rises)",
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
      };
    }
    if (t.includes("high") || t.includes("1st") || t.includes("ตรี")) {
      return {
        label: "High ↗",
        fullLabel: "High Tone (ตรี) ↗",
        pitch: "45 (High ascending)",
        className: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
      };
    }
    if (t.includes("low") || t.includes("3rd") || t.includes("เอก")) {
      return {
        label: "Low ↘",
        fullLabel: "Low Tone (เอก) ↘",
        pitch: "21 (Low chest dropping)",
        className: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
      };
    }
    if (t.includes("mid") || t.includes("สามัญ")) {
      return {
        label: "Mid ➡️",
        fullLabel: "Mid Tone (สามัญ) ➡️",
        pitch: "33 (Neutral flat)",
        className: "bg-neutral-500/10 text-neutral-700 dark:text-neutral-300 border-neutral-500/20",
      };
    }
    return {
      label: toneStr || "Standard",
      fullLabel: toneStr || "Standard",
      pitch: "Variable",
      className: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20",
    };
  };

  const THAI_TONE_EXAMPLES = [
    { name: "Mid Tone (สามัญ)", thai: "กา", roman: "kā", mark: "No mark", pitch: "33 Flat", icon: "➡️", desc: "Even, comfortable middle pitch with zero inflection." },
    { name: "Low Tone (เอก)", thai: "ก่า", roman: "kà", mark: "่ (Mai Ek)", pitch: "21 Low drop", icon: "↘️", desc: "Starts in lower register and dips slightly lower." },
    { name: "Falling Tone (โท)", thai: "ก้า", roman: "kâ", mark: "้ (Mai Tho)", pitch: "51 High fall", icon: "⤵️", desc: "Starts high with emphasis, then plunges sharply downward." },
    { name: "High Tone (ตรี)", thai: "ก๊า", roman: "ká", mark: "๊ (Mai Tri)", pitch: "45 High rise", icon: "↗️", desc: "Starts high and ascends higher, like an eager question." },
    { name: "Rising Tone (จัตวา)", thai: "ก๋า", roman: "kǎ", mark: "๋ (Mai Chattawa)", pitch: "214 Dip & rise", icon: "⤴️", desc: "Dips deep to bottom and sweeps up, like 'Really?!'." },
  ];

  return (
    <div className="h-full flex flex-col min-h-0 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm overflow-hidden">
      {/* Studio Header Bar */}
      <div className="px-4 py-2.5 bg-neutral-50/90 dark:bg-neutral-950/70 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shrink-0">
        {/* Navigation Tabs */}
        <div className="flex items-center bg-neutral-200/60 dark:bg-neutral-800/80 rounded-xl p-0.5 border border-neutral-200/70 dark:border-neutral-700/60">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("breakdown")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "breakdown"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <span>Word Breakdown</span>
            {result?.words && (
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded font-mono">
                {result.words.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "insights"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Linguistic Notes
          </button>
        </div>

        {/* Global Action Icons (Copy, Font Selector) */}
        {result && (
          <div className="flex items-center gap-1.5">
            {/* Font Style Toggle */}
            <div className="hidden sm:flex items-center bg-neutral-200/60 dark:bg-neutral-800/80 rounded-lg p-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50">
              <button
                onClick={() => onChangeFontStyleMode("both")}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  fontStyleMode === "both" ? "bg-white dark:bg-neutral-900 font-bold text-neutral-900 dark:text-white shadow-2xs" : ""
                }`}
                title="Show both font styles"
              >
                Dual Font
              </button>
              <button
                onClick={() => onChangeFontStyleMode("traditional")}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  fontStyleMode === "traditional" ? "bg-white dark:bg-neutral-900 font-bold text-neutral-900 dark:text-white shadow-2xs" : ""
                }`}
                title="Traditional script"
              >
                Trad
              </button>
              <button
                onClick={() => onChangeFontStyleMode("modern")}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  fontStyleMode === "modern" ? "bg-white dark:bg-neutral-900 font-bold text-neutral-900 dark:text-white shadow-2xs" : ""
                }`}
                title="Modern loopless script"
              >
                Mod
              </button>
            </div>

            {/* Master Copy Button */}
            <button
              onClick={() => {
                const fullText = `Native: ${result.detectedText}\nRomanization: ${result.transliteration}\nIPA: ${result.ipa}\nTranslation: ${result.translation}`;
                copyToClipboard(fullText, "all");
              }}
              className="p-1.5 bg-neutral-200/60 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              title="Copy Complete Analysis"
            >
              {copiedField === "all" ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Master Speech Button */}
            <button
              onClick={() => onSpeak(result.detectedText || result.transliteration)}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Pronounce Native Speech"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Listen</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {/* Loading State */}
        {loading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
              <Sparkles className="w-5 h-5 text-amber-500 absolute inset-0 m-auto" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
              Decoding {currentLang.name} Script...
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
              Generating tone contours, International Phonetic Alphabet (IPA), and morpheme segmentation.
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-700 dark:text-red-300 text-xs flex flex-col gap-2">
            <div className="font-semibold flex items-center gap-1.5 text-sm">
              <span>Analysis Encountered an Issue</span>
            </div>
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !errorMessage && !result && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
              Linguistic Studio Ready
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-5 leading-relaxed">
              Point your camera at text or type in any phrase to view immediate Romanized phonetics, IPA, tones, and word breakdowns.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => onSelectSample("สวัสดีครับ")}
                className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/10 hover:border-amber-500/30 border border-neutral-200/80 dark:border-neutral-700 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Try "สวัสดีครับ" (Hello)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              </button>
              <button
                onClick={() => onSelectSample("ขอบคุณมากค่ะ")}
                className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/10 hover:border-amber-500/30 border border-neutral-200/80 dark:border-neutral-700 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Try "ขอบคุณมากค่ะ" (Thanks)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              </button>
            </div>
          </div>
        )}

        {/* Populated Result Content */}
        {!loading && result && (
          <div>
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                {/* Native Script Box with Dual Typography Presentation */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950/60 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                    <span>Original Script ({currentLang.name})</span>
                    <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">
                      {result.syllablesCount} Syllables
                    </span>
                  </div>

                  {/* Dual or Single Font Renderer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(fontStyleMode === "both" || fontStyleMode === "traditional") && (
                      <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200/60 dark:border-neutral-800 shadow-2xs">
                        <span className="text-[10px] font-mono text-neutral-400 block mb-1">
                          {currentLang.traditionalStyle}
                        </span>
                        <div
                          className={`text-xl font-bold text-neutral-900 dark:text-white leading-relaxed ${currentLang.traditionalFont}`}
                          lang={currentLang.code}
                        >
                          {result.detectedText || "—"}
                        </div>
                      </div>
                    )}

                    {(fontStyleMode === "both" || fontStyleMode === "modern") && (
                      <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200/60 dark:border-neutral-800 shadow-2xs">
                        <span className="text-[10px] font-mono text-neutral-400 block mb-1">
                          {currentLang.modernStyle}
                        </span>
                        <div
                          className={`text-xl font-bold text-neutral-900 dark:text-white leading-relaxed ${currentLang.modernFont}`}
                          lang={currentLang.code}
                        >
                          {result.detectedText || "—"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Segment Flow (Syllables/Words) */}
                {result.words && result.words.length > 0 && (
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-950/60 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                      <span>Morpheme & Tone Segments</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">Click word to listen</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.words.map((word, idx) => {
                        const badge = getToneBadge(word.tone);
                        const isSelected = activeWordIdx === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setActiveWordIdx(idx);
                              onSpeakWord(word.thai);
                            }}
                            className={`px-3 py-1.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected
                                ? "bg-amber-500/15 border-amber-500/60 shadow-xs"
                                : "bg-white dark:bg-neutral-900 border-neutral-200/70 dark:border-neutral-800 hover:border-amber-500/40 shadow-2xs"
                            }`}
                          >
                            <span className={`text-base font-bold text-neutral-900 dark:text-white ${currentLang.traditionalFont}`}>
                              {word.thai}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                {word.romanization}
                              </span>
                              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate max-w-[100px]">
                                {word.meaning}
                              </span>
                            </div>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold border ${badge.className}`}>
                              {badge.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Romanization + IPA Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Romanized Phonetics */}
                  <div className="p-3.5 bg-amber-500/5 dark:bg-amber-400/5 rounded-xl border border-amber-500/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                        <span>Romanized Phonetics (RTGS)</span>
                        <button
                          onClick={() => copyToClipboard(result.transliteration, "roman")}
                          className="p-1 hover:bg-amber-500/10 rounded cursor-pointer"
                        >
                          {copiedField === "roman" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="text-lg font-bold text-neutral-900 dark:text-amber-100 font-sans tracking-wide">
                        {result.transliteration}
                      </div>
                    </div>
                  </div>

                  {/* IPA Transcription */}
                  <div className="p-3.5 bg-neutral-50 dark:bg-neutral-950/60 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                        <span>IPA Transcription</span>
                        <button
                          onClick={() => copyToClipboard(result.ipa, "ipa")}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded cursor-pointer"
                        >
                          {copiedField === "ipa" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="text-base font-mono font-medium text-neutral-800 dark:text-neutral-200">
                        {result.ipa}
                      </div>
                    </div>
                  </div>
                </div>

                {/* English Translation */}
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-950/60 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                  <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                    English Translation
                  </div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white leading-relaxed">
                    "{result.translation}"
                  </div>
                </div>

                {/* Thai 5-Tone Visualizer Quick Card Toggle */}
                {currentLang.code === "th" && (
                  <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowToneGuide(!showToneGuide)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-950/70 hover:bg-amber-500/5 dark:hover:bg-amber-950/20 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                          <span>🇹🇭 Thai 5-Tone Pitch Contour Guide</span>
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold">
                          Essential
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 font-semibold">
                        {showToneGuide ? "Hide ▲" : "View Tones ▼"}
                      </span>
                    </button>

                    {showToneGuide && (
                      <div className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200/70 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-5 gap-2">
                        {THAI_TONE_EXAMPLES.map((tone, idx) => (
                          <div
                            key={idx}
                            onClick={() => onSpeak(tone.thai)}
                            className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-neutral-800 hover:border-amber-500/40 flex flex-col justify-between group cursor-pointer transition-all shadow-2xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base font-bold text-neutral-900 dark:text-white font-thai-looped">
                                {tone.thai}
                              </span>
                              <Volume2 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                            </div>
                            <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                              {tone.roman} <span className="font-normal text-[10px] text-neutral-400">({tone.pitch})</span>
                            </div>
                            <div className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                              {tone.name}
                            </div>
                            <div className="text-[9px] text-neutral-400 leading-tight mt-1">
                              {tone.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Fast Audio Playback Bar with Speed Toggles */}
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800/90 rounded-xl border border-neutral-200/70 dark:border-neutral-700/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onSpeak(result.detectedText || result.transliteration)}
                      className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-xs transition-colors cursor-pointer shrink-0"
                      title="Play Pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        Native Audio Pronunciation
                      </span>
                      <span className="text-[10px] text-neutral-400 truncate">
                        {isPlayingTts ? "Speaking..." : "Listen at normal or slow speed"}
                      </span>
                    </div>
                  </div>

                  {/* Audio Speed Controls */}
                  {onChangeTtsSpeed && (
                    <div className="flex items-center bg-white dark:bg-neutral-900 rounded-lg p-0.5 border border-neutral-200/80 dark:border-neutral-700 text-[10px] font-mono shrink-0">
                      {[
                        { val: 0.75, label: "0.75x Slow" },
                        { val: 1.0, label: "1.0x Normal" },
                      ].map((sp) => (
                        <button
                          key={sp.val}
                          type="button"
                          onClick={() => onChangeTtsSpeed(sp.val)}
                          className={`px-2 py-1 rounded cursor-pointer transition-all ${
                            Math.abs(ttsSpeed - sp.val) < 0.05
                              ? "bg-amber-500 text-black font-bold shadow-2xs"
                              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                          }`}
                        >
                          {sp.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: WORD-BY-WORD BREAKDOWN */}
            {activeTab === "breakdown" && (
              <div className="space-y-3">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  Click on any segment chip to hear its exact individual phonetic pronunciation:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.words?.map((word, idx) => {
                    const badge = getToneBadge(word.tone);
                    return (
                      <div
                        key={idx}
                        onClick={() => onSpeakWord(word.thai)}
                        className="p-3 bg-neutral-50 dark:bg-neutral-950/60 hover:bg-amber-500/5 dark:hover:bg-amber-950/20 border border-neutral-200/80 dark:border-neutral-800 hover:border-amber-500/40 rounded-xl transition-all flex flex-col justify-between group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={`text-lg font-bold text-neutral-900 dark:text-white ${currentLang.traditionalFont}`}>
                              {word.thai}
                            </span>
                            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                              {word.romanization}
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>

                        <div className="mt-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                          <span className="text-neutral-600 dark:text-neutral-300 font-medium truncate max-w-[150px]">
                            {word.meaning}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-400">
                            {word.ipa}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: LINGUISTIC INSIGHTS */}
            {activeTab === "insights" && (
              <div className="space-y-3.5">
                {/* Pronunciation Coach */}
                {result.pronunciationGuide && (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-950/60 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                      <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Phonetic & Tone Guide</span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {result.pronunciationGuide}
                    </p>
                  </div>
                )}

                {/* Cultural & Linguistic Etiquette Notes */}
                {result.languageNotes && (
                  <div className="p-4 bg-amber-500/5 dark:bg-amber-400/5 rounded-xl border border-amber-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                      <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Cultural & Etymology Notes</span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {result.languageNotes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
