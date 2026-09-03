import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  Keyboard, 
  BookOpen, 
  History as HistoryIcon, 
  Sparkles,
  Layers,
  ArrowLeft
} from "lucide-react";
import { TransliterationResult, PresetPhrase, HistoryItem } from "./types";
import { LANGUAGES_PRESETS, PRESET_PHRASES } from "./data";
import { Header } from "./components/Header";
import { CameraViewfinder, FOCUS_TARGETS } from "./components/CameraViewfinder";
import { TextInputPanel } from "./components/TextInputPanel";
import { PresetsPanel } from "./components/PresetsPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { ResultStudio } from "./components/ResultStudio";

export const LANGUAGES = [
  {
    code: "th",
    name: "Thai",
    nativeName: "ไทย",
    locale: "th-TH",
    placeholder: "สวัสดีครับ ยินดีที่ได้รู้จัก",
    transliterateLabel: "🇹🇭 Thai ↔ 🔤 Roman",
    traditionalStyle: "Traditional Looped Style",
    modernStyle: "Modern Loopless Style",
    traditionalFont: "font-thai-looped",
    modernFont: "font-thai-modern",
    flag: "🇹🇭"
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    locale: "ja-JP",
    placeholder: "こんにちは、はじめまして。",
    transliterateLabel: "🇯🇵 Japanese ↔ 🔤 Romanized",
    traditionalStyle: "Mincho (Traditional Serif)",
    modernStyle: "Gothic (Modern Sans)",
    traditionalFont: "font-jp-serif",
    modernFont: "font-jp-sans",
    flag: "🇯🇵"
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    locale: "ko-KR",
    placeholder: "안녕하세요, 만나서 반가워요.",
    transliterateLabel: "🇰🇷 Korean ↔ 🔤 Romanized",
    traditionalStyle: "Batang (Traditional Serif)",
    modernStyle: "Dotum (Modern Sans)",
    traditionalFont: "font-kr-serif",
    modernFont: "font-kr-sans",
    flag: "🇰🇷"
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    locale: "zh-CN",
    placeholder: "你好，很高兴认识你。",
    transliterateLabel: "🇨🇳 Chinese ↔ 🔤 Pinyin",
    traditionalStyle: "Songti (Traditional Serif)",
    modernStyle: "Heiti (Modern Sans)",
    traditionalFont: "font-sc-serif",
    modernFont: "font-sc-sans",
    flag: "🇨🇳"
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    locale: "vi-VN",
    placeholder: "Xin chào, rất vui được gặp bạn.",
    transliterateLabel: "🇻🇳 Vietnamese ↔ 🔤 Phonetics",
    traditionalStyle: "Classical Serif",
    modernStyle: "Modern Sans-serif",
    traditionalFont: "font-jp-serif",
    modernFont: "font-sans",
    flag: "🇻🇳"
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    locale: "hi-IN",
    placeholder: "नमस्ते, आपसे मिलकर खुशी हुई।",
    transliterateLabel: "🇮🇳 Hindi ↔ 🔤 Romanized",
    traditionalStyle: "Traditional Devanagari",
    modernStyle: "Modern Devanagari",
    traditionalFont: "font-hi-serif",
    modernFont: "font-hi-sans",
    flag: "🇮🇳"
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    locale: "ar-SA",
    placeholder: "مرحباً، سعيد بلقائك.",
    transliterateLabel: "🇸🇦 Arabic ↔ 🔤 Romanized",
    traditionalStyle: "Naskh Calligraphy",
    modernStyle: "Modern Kufic/Sans-serif",
    traditionalFont: "font-ar-serif",
    modernFont: "font-ar-sans",
    flag: "🇸🇦"
  }
];

// Helper to crop a base64 image on a canvas using centered percentage dimensions
const cropImageToPercent = (
  base64Src: string,
  widthPct: number,
  heightPct: number,
  mimeType: string = "image/jpeg"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context is unavailable"));
        return;
      }
      const targetWidth = img.width * (widthPct / 100);
      const targetHeight = img.height * (heightPct / 100);
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const sx = (img.width - targetWidth) / 2;
      const sy = (img.height - targetHeight) / 2;

      ctx.drawImage(img, sx, sy, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL(mimeType, 0.9));
    };
    img.onerror = (e) => reject(e);
    img.src = base64Src;
  });
};

export default function App() {
  // Navigation & Language
  const [selectedLanguage, setSelectedLanguage] = useState<string>("th");
  const [activePanel, setActivePanel] = useState<"camera" | "text" | "presets" | "history">("camera");
  const [mobileView, setMobileView] = useState<"input" | "result">("input");

  // Input states
  const [inputText, setInputText] = useState("");
  const [transliterateMode, setTransliterateMode] = useState<"thai-to-roman" | "roman-to-thai">("thai-to-roman");

  // Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [zoomValue, setZoomValue] = useState<number>(1.0);
  const [zoomRange, setZoomRange] = useState({ min: 1.0, max: 4.0, step: 0.1 });
  const [focusMode, setFocusMode] = useState<"word" | "phrase" | "sentence" | "paragraph">("paragraph");
  const [cameraFitMode, setCameraFitMode] = useState<"cover" | "contain">("contain");
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedImageType, setUploadedImageType] = useState<string>("image/jpeg");
  const [shouldMirror, setShouldMirror] = useState(false);

  // Results & History
  const [result, setResult] = useState<TransliterationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [fontStyleMode, setFontStyleMode] = useState<"both" | "traditional" | "modern">("both");

  // Audio / TTS
  const [ttsSpeed, setTtsSpeed] = useState<number>(1.0);
  const [isPlayingTts, setIsPlayingTts] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("siamscript_dark_mode");
      if (saved !== null) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return true;
    }
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  const currentLang = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];
  const currentPresets = LANGUAGES_PRESETS[selectedLanguage] || PRESET_PHRASES;

  // Dark mode effect
  useEffect(() => {
    try {
      localStorage.setItem("siamscript_dark_mode", String(darkMode));
    } catch {}
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("siamscript_history_v2");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveToHistory = (originalText: string, res: TransliterationResult) => {
    const newItem: HistoryItem = {
      id: "hist-" + Date.now(),
      original: res.detectedText || originalText,
      romanized: res.transliteration,
      translation: res.translation,
      result: res,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      language: selectedLanguage,
    };
    const updated = [newItem, ...history.filter((h) => h.original !== (res.detectedText || originalText))].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem("siamscript_history_v2", JSON.stringify(updated));
    } catch {}
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem("siamscript_history_v2", JSON.stringify(updated));
    } catch {}
  };

  const clearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("siamscript_history_v2");
    } catch {}
  };

  // Text-to-Speech Engine
  const speakText = (text: string) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang.locale;
    utterance.rate = ttsSpeed;
    utterance.onstart = () => setIsPlayingTts(true);
    utterance.onend = () => setIsPlayingTts(false);
    utterance.onerror = () => setIsPlayingTts(false);
    window.speechSynthesis.speak(utterance);
  };

  // Camera Management
  const stopCamera = () => {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not supported or accessible in this environment. Please ensure HTTPS or open in a new tab.");
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId } }
          : {
              facingMode: { ideal: "environment" },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      activeStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {}
      }

      setCameraActive(true);

      // Check camera devices
      try {
        const devList = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = devList.filter((d) => d.kind === "videoinput");
        setDevices(videoDevs);
      } catch {}
    } catch (err: any) {
      console.warn("Camera start warning:", err);
      setCameraError("Could not access camera. Please allow permission or upload a photo.");
      setCameraActive(false);
    }
  };

  // Automatically start camera when on camera tab
  useEffect(() => {
    if (activePanel === "camera" && !uploadedImageSrc && !cameraActive) {
      startCamera();
    }
    return () => {
      if (activePanel !== "camera") {
        stopCamera();
      }
    };
  }, [activePanel, selectedDeviceId]);

  // Capture Frame
  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    setErrorMessage(null);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const target = FOCUS_TARGETS[focusMode];

      const vWidth = video.videoWidth || 1280;
      const vHeight = video.videoHeight || 720;

      const cropWidth = vWidth * (target.widthPct / 100);
      const cropHeight = vHeight * (target.heightPct / 100);
      const sx = (vWidth - cropWidth) / 2;
      const sy = (vHeight - cropHeight) / 2;

      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize canvas");

      ctx.drawImage(video, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      const base64 = canvas.toDataURL("image/jpeg", 0.9);

      const response = await fetch("/api/transliterate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType: "image/jpeg", language: selectedLanguage }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "OCR Transliteration failed");
      }

      const data: TransliterationResult = await response.json();
      setResult(data);
      saveToHistory(data.detectedText || "Camera Scan", data);
      setMobileView("result");

      if (data.detectedText) {
        speakText(data.detectedText);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to extract and transliterate script.");
    } finally {
      setIsCapturing(false);
    }
  };

  // Uploaded photo analysis
  const analyzeUploadedFocus = async () => {
    if (!uploadedImageSrc || isCapturing) return;

    setIsCapturing(true);
    setErrorMessage(null);

    try {
      const target = FOCUS_TARGETS[focusMode];
      const croppedImage = await cropImageToPercent(
        uploadedImageSrc,
        target.widthPct,
        target.heightPct,
        uploadedImageType
      );

      const response = await fetch("/api/transliterate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: croppedImage, mimeType: uploadedImageType, language: selectedLanguage }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to analyze photo");
      }

      const data: TransliterationResult = await response.json();
      setResult(data);
      saveToHistory(data.detectedText || "Photo Upload", data);
      setMobileView("result");

      if (data.detectedText) {
        speakText(data.detectedText);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process photo.");
    } finally {
      setIsCapturing(false);
    }
  };

  // Text Transliteration API
  const handleTransliterateText = async (textToUse?: string) => {
    const raw = textToUse !== undefined ? textToUse : inputText;
    if (!raw.trim() || loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/transliterate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: raw.trim(),
          mode: transliterateMode,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to transliterate text");
      }

      const data: TransliterationResult = await response.json();
      setResult(data);
      saveToHistory(raw.trim(), data);
      setMobileView("result");

      if (data.detectedText) {
        speakText(data.detectedText);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Could not process phrase.");
    } finally {
      setLoading(false);
    }
  };

  // Load Preset Phrase
  const handleSelectPreset = (preset: PresetPhrase) => {
    setResult(preset.result);
    setInputText(preset.thai);
    saveToHistory(preset.thai, preset.result);
    setMobileView("result");
    speakText(preset.thai);
  };

  // Load History Item
  const handleSelectHistory = (item: HistoryItem) => {
    setResult(item.result);
    setInputText(item.original);
    setMobileView("result");
    speakText(item.original);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-screen overflow-hidden flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Top Fixed Header */}
      <Header
        languages={LANGUAGES}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(code) => {
          setSelectedLanguage(code);
          setResult(null);
        }}
        ttsSpeed={ttsSpeed}
        onChangeTtsSpeed={setTtsSpeed}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main App Workspace (Viewport-Locked / No Global Page Scroll) */}
      <main className="flex-1 min-h-0 overflow-hidden p-2 sm:p-3 md:p-4">
        {/* Desktop Split View: Left (Inputs/Camera) + Right (Result Studio) */}
        <div className="hidden lg:grid lg:grid-cols-12 h-full gap-3 md:gap-4">
          {/* Left Column (Input Workspace) */}
          <section className="lg:col-span-5 xl:col-span-5 h-full flex flex-col min-h-0 gap-2.5">
            {/* Segmented Mode Selector */}
            <div className="h-10 bg-white dark:bg-neutral-900 rounded-xl p-1 border border-neutral-200/80 dark:border-neutral-800 flex items-center shadow-xs shrink-0">
              <button
                onClick={() => setActivePanel("camera")}
                className={`flex-1 h-full rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activePanel === "camera"
                    ? "bg-amber-500 text-black shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera OCR</span>
              </button>
              <button
                onClick={() => setActivePanel("text")}
                className={`flex-1 h-full rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activePanel === "text"
                    ? "bg-amber-500 text-black shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Text Input</span>
              </button>
              <button
                onClick={() => setActivePanel("presets")}
                className={`flex-1 h-full rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activePanel === "presets"
                    ? "bg-amber-500 text-black shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Phrasebook</span>
              </button>
              <button
                onClick={() => setActivePanel("history")}
                className={`flex-1 h-full rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activePanel === "history"
                    ? "bg-amber-500 text-black shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <HistoryIcon className="w-3.5 h-3.5" />
                <span>History</span>
              </button>
            </div>

            {/* Active Panel View (Fits exactly into the parent height) */}
            <div className="flex-1 min-h-0">
              {activePanel === "camera" && (
                <CameraViewfinder
                  currentLang={currentLang}
                  cameraActive={cameraActive}
                  cameraError={cameraError}
                  isCapturing={isCapturing}
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  zoomValue={zoomValue}
                  zoomRange={zoomRange}
                  onChangeZoom={setZoomValue}
                  focusMode={focusMode}
                  onChangeFocusMode={setFocusMode}
                  cameraFitMode={cameraFitMode}
                  onToggleFitMode={() =>
                    setCameraFitMode(cameraFitMode === "cover" ? "contain" : "cover")
                  }
                  devices={devices}
                  selectedDeviceId={selectedDeviceId}
                  onSelectDeviceId={setSelectedDeviceId}
                  onStartCamera={startCamera}
                  onCaptureFrame={captureFrame}
                  onUploadFile={(file) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setUploadedImageSrc(e.target?.result as string);
                      setUploadedImageType(file.type);
                    };
                    reader.readAsDataURL(file);
                  }}
                  uploadedImageSrc={uploadedImageSrc}
                  onClearUploadedImage={() => setUploadedImageSrc(null)}
                  onAnalyzeUploadedFocus={analyzeUploadedFocus}
                  shouldMirror={shouldMirror}
                />
              )}

              {activePanel === "text" && (
                <TextInputPanel
                  currentLang={currentLang}
                  inputText={inputText}
                  onChangeInputText={setInputText}
                  transliterateMode={transliterateMode}
                  onToggleMode={() =>
                    setTransliterateMode(
                      transliterateMode === "thai-to-roman" ? "roman-to-thai" : "thai-to-roman"
                    )
                  }
                  onTransliterate={() => handleTransliterateText()}
                  loading={loading}
                  presets={currentPresets}
                  onSelectPreset={handleSelectPreset}
                />
              )}

              {activePanel === "presets" && (
                <PresetsPanel
                  currentLang={currentLang}
                  presets={currentPresets}
                  onSelectPreset={handleSelectPreset}
                  onSpeak={speakText}
                />
              )}

              {activePanel === "history" && (
                <HistoryPanel
                  currentLang={currentLang}
                  history={history}
                  onSelectHistory={handleSelectHistory}
                  onDeleteHistory={deleteHistoryItem}
                  onClearHistory={clearAllHistory}
                  onSpeak={speakText}
                />
              )}
            </div>
          </section>

          {/* Right Column (Result Studio) */}
          <section className="lg:col-span-7 xl:col-span-7 h-full flex flex-col min-h-0">
            <ResultStudio
              currentLang={currentLang}
              result={result}
              loading={loading || isCapturing}
              errorMessage={errorMessage}
              isPlayingTts={isPlayingTts}
              onSpeak={speakText}
              onSpeakWord={speakText}
              onSelectSample={(sample) => {
                setInputText(sample);
                handleTransliterateText(sample);
              }}
              fontStyleMode={fontStyleMode}
              onChangeFontStyleMode={setFontStyleMode}
              ttsSpeed={ttsSpeed}
              onChangeTtsSpeed={setTtsSpeed}
            />
          </section>
        </div>

        {/* Mobile Single-Screen View: Switch between Input Mode & Result Studio */}
        <div className="lg:hidden flex flex-col h-full min-h-0">
          {/* Mobile Top View Switcher */}
          <div className="h-10 bg-white dark:bg-neutral-900 rounded-xl p-1 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shadow-xs shrink-0 mb-2">
            <div className="flex items-center gap-1 flex-1">
              <button
                onClick={() => {
                  setActivePanel("camera");
                  setMobileView("input");
                }}
                className={`flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  mobileView === "input" && activePanel === "camera"
                    ? "bg-amber-500 text-black shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="text-[11px]">Camera</span>
              </button>
              <button
                onClick={() => {
                  setActivePanel("text");
                  setMobileView("input");
                }}
                className={`flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  mobileView === "input" && activePanel === "text"
                    ? "bg-amber-500 text-black shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span className="text-[11px]">Text</span>
              </button>
              <button
                onClick={() => {
                  setActivePanel("presets");
                  setMobileView("input");
                }}
                className={`flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  mobileView === "input" && activePanel === "presets"
                    ? "bg-amber-500 text-black shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="text-[11px]">Presets</span>
              </button>
            </div>

            {/* Mobile View Result Studio Tab */}
            <button
              onClick={() => setMobileView("result")}
              className={`ml-1 px-3 h-8 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                mobileView === "result"
                  ? "bg-amber-500 text-black shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio</span>
              {result && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </button>
          </div>

          {/* Mobile Main Body */}
          <div className="flex-1 min-h-0 relative">
            {mobileView === "result" ? (
              <div className="h-full flex flex-col min-h-0">
                <div className="mb-2">
                  <button
                    onClick={() => setMobileView("input")}
                    className="px-2.5 py-1 bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium flex items-center gap-1 shadow-2xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Scanner / Input</span>
                  </button>
                </div>
                <div className="flex-1 min-h-0">
                  <ResultStudio
                    currentLang={currentLang}
                    result={result}
                    loading={loading || isCapturing}
                    errorMessage={errorMessage}
                    isPlayingTts={isPlayingTts}
                    onSpeak={speakText}
                    onSpeakWord={speakText}
                    onSelectSample={(sample) => {
                      setInputText(sample);
                      handleTransliterateText(sample);
                    }}
                    fontStyleMode={fontStyleMode}
                    onChangeFontStyleMode={setFontStyleMode}
                    ttsSpeed={ttsSpeed}
                    onChangeTtsSpeed={setTtsSpeed}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col min-h-0">
                {activePanel === "camera" && (
                  <CameraViewfinder
                    currentLang={currentLang}
                    cameraActive={cameraActive}
                    cameraError={cameraError}
                    isCapturing={isCapturing}
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    zoomValue={zoomValue}
                    zoomRange={zoomRange}
                    onChangeZoom={setZoomValue}
                    focusMode={focusMode}
                    onChangeFocusMode={setFocusMode}
                    cameraFitMode={cameraFitMode}
                    onToggleFitMode={() =>
                      setCameraFitMode(cameraFitMode === "cover" ? "contain" : "cover")
                    }
                    devices={devices}
                    selectedDeviceId={selectedDeviceId}
                    onSelectDeviceId={setSelectedDeviceId}
                    onStartCamera={startCamera}
                    onCaptureFrame={captureFrame}
                    onUploadFile={(file) => {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setUploadedImageSrc(e.target?.result as string);
                        setUploadedImageType(file.type);
                      };
                      reader.readAsDataURL(file);
                    }}
                    uploadedImageSrc={uploadedImageSrc}
                    onClearUploadedImage={() => setUploadedImageSrc(null)}
                    onAnalyzeUploadedFocus={analyzeUploadedFocus}
                    shouldMirror={shouldMirror}
                  />
                )}

                {activePanel === "text" && (
                  <TextInputPanel
                    currentLang={currentLang}
                    inputText={inputText}
                    onChangeInputText={setInputText}
                    transliterateMode={transliterateMode}
                    onToggleMode={() =>
                      setTransliterateMode(
                        transliterateMode === "thai-to-roman" ? "roman-to-thai" : "thai-to-roman"
                      )
                    }
                    onTransliterate={() => handleTransliterateText()}
                    loading={loading}
                    presets={currentPresets}
                    onSelectPreset={handleSelectPreset}
                  />
                )}

                {activePanel === "presets" && (
                  <PresetsPanel
                    currentLang={currentLang}
                    presets={currentPresets}
                    onSelectPreset={handleSelectPreset}
                    onSpeak={speakText}
                  />
                )}

                {activePanel === "history" && (
                  <HistoryPanel
                    currentLang={currentLang}
                    history={history}
                    onSelectHistory={handleSelectHistory}
                    onDeleteHistory={deleteHistoryItem}
                    onClearHistory={clearAllHistory}
                    onSpeak={speakText}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
