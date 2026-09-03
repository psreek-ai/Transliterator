import React, { useRef } from "react";
import { 
  Camera, 
  RotateCw, 
  Upload, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  AlertTriangle, 
  RefreshCw, 
  Check, 
  X,
  Sliders
} from "lucide-react";
import { LanguageConfig } from "../types";

export interface FocusTargetConfig {
  name: string;
  description: string;
  widthPct: number;
  heightPct: number;
  wClass: string;
  hClass: string;
  icon: string;
}

export const FOCUS_TARGETS: Record<string, FocusTargetConfig> = {
  word: {
    name: "Word",
    description: "Single word / syllable",
    widthPct: 80,
    heightPct: 8,
    wClass: "w-[80%]",
    hClass: "h-[8%]",
    icon: "🔤"
  },
  phrase: {
    name: "Phrase",
    description: "Short phrase or sign",
    widthPct: 88,
    heightPct: 14,
    wClass: "w-[88%]",
    hClass: "h-[14%]",
    icon: "🏷️"
  },
  sentence: {
    name: "Line",
    description: "Full text line",
    widthPct: 92,
    heightPct: 20,
    wClass: "w-[92%]",
    hClass: "h-[20%]",
    icon: "📝"
  },
  paragraph: {
    name: "Full Frame",
    description: "Entire frame OCR",
    widthPct: 96,
    heightPct: 75,
    wClass: "w-[96%]",
    hClass: "h-[75%]",
    icon: "📖"
  }
};

interface CameraViewfinderProps {
  currentLang: LanguageConfig;
  cameraActive: boolean;
  cameraError: string | null;
  isCapturing: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  zoomValue: number;
  zoomRange: { min: number; max: number; step: number };
  onChangeZoom: (val: number) => void;
  focusMode: "word" | "phrase" | "sentence" | "paragraph";
  onChangeFocusMode: (mode: "word" | "phrase" | "sentence" | "paragraph") => void;
  cameraFitMode: "cover" | "contain";
  onToggleFitMode: () => void;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  onSelectDeviceId: (id: string) => void;
  onStartCamera: () => void;
  onCaptureFrame: () => void;
  onUploadFile: (file: File) => void;
  uploadedImageSrc: string | null;
  onClearUploadedImage: () => void;
  onAnalyzeUploadedFocus: () => void;
  shouldMirror: boolean;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  currentLang,
  cameraActive,
  cameraError,
  isCapturing,
  videoRef,
  canvasRef,
  zoomValue,
  zoomRange,
  onChangeZoom,
  focusMode,
  onChangeFocusMode,
  cameraFitMode,
  onToggleFitMode,
  devices,
  selectedDeviceId,
  onSelectDeviceId,
  onStartCamera,
  onCaptureFrame,
  onUploadFile,
  uploadedImageSrc,
  onClearUploadedImage,
  onAnalyzeUploadedFocus,
  shouldMirror,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeFocus = FOCUS_TARGETS[focusMode] || FOCUS_TARGETS.paragraph;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 relative shadow-sm">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onUploadFile(e.target.files[0]);
          }
        }}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Overlay Controls Bar */}
      <div className="absolute top-0 inset-x-0 z-10 p-2.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
        {/* Focus Mode Selector */}
        <div className="flex items-center bg-black/60 backdrop-blur-md rounded-xl p-0.5 border border-white/10 shadow-xs">
          {(["word", "phrase", "sentence", "paragraph"] as const).map((mode) => {
            const cfg = FOCUS_TARGETS[mode];
            const isSelected = focusMode === mode;
            return (
              <button
                key={mode}
                onClick={() => onChangeFocusMode(mode)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? "bg-amber-500 text-black font-semibold shadow-xs"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                title={cfg.description}
              >
                <span>{cfg.icon}</span>
                <span className="hidden sm:inline">{cfg.name}</span>
              </button>
            );
          })}
        </div>

        {/* Action icons (Fit toggle, camera switch, upload) */}
        <div className="flex items-center gap-1.5">
          {devices.length > 1 && (
            <button
              onClick={() => {
                const currIdx = devices.findIndex((d) => d.deviceId === selectedDeviceId);
                const nextIdx = (currIdx + 1) % devices.length;
                onSelectDeviceId(devices[nextIdx].deviceId);
              }}
              className="p-1.5 bg-black/60 backdrop-blur-md hover:bg-white/20 text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
              title="Switch Camera Lens"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onToggleFitMode}
            className="p-1.5 bg-black/60 backdrop-blur-md hover:bg-white/20 text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
            title={cameraFitMode === "contain" ? "Fill Viewfinder" : "Fit Frame"}
          >
            {cameraFitMode === "contain" ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 bg-black/60 backdrop-blur-md hover:bg-white/20 text-white rounded-xl border border-white/10 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
            title="Upload from Photo Library"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Photo</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Content Area */}
      <div
        className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden bg-neutral-950"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* State A: Uploaded Image Preview */}
        {uploadedImageSrc ? (
          <div className="w-full h-full relative flex items-center justify-center p-2">
            <img
              src={uploadedImageSrc}
              alt="Uploaded photo"
              className={`max-h-full max-w-full rounded-lg ${
                cameraFitMode === "cover" ? "object-cover w-full h-full" : "object-contain"
              }`}
            />
            {/* Target crop overlay bounding box */}
            <div
              className={`absolute border-2 border-amber-400 bg-amber-400/10 rounded-lg pointer-events-none transition-all shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] ${activeFocus.wClass} ${activeFocus.hClass}`}
            >
              <div className="absolute top-1 left-1 bg-amber-400 text-black text-[9px] font-bold px-1.5 py-0.2 rounded">
                Target: {activeFocus.name}
              </div>
            </div>

            {/* Clear photo button */}
            <button
              onClick={onClearUploadedImage}
              className="absolute top-12 right-3 p-1.5 bg-black/70 hover:bg-black text-white rounded-full border border-white/20 cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* State B: Live Video Feed */
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full transition-transform duration-100 ${
                cameraFitMode === "cover" ? "object-cover" : "object-contain"
              }`}
              style={{
                transform: `${shouldMirror ? "scaleX(-1)" : "scaleX(1)"} scale(${zoomValue})`,
                transformOrigin: "center center",
              }}
            />

            {/* Scan targeting box */}
            {cameraActive && !cameraError && (
              <div
                className={`absolute border-2 border-amber-400/90 rounded-xl pointer-events-none transition-all shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] ${activeFocus.wClass} ${activeFocus.hClass} flex items-center justify-center`}
              >
                {/* Corner crosshairs */}
                <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-bottom-2 border-l-2 border-amber-400" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400" />

                {/* Animated laser scan beam during active capture */}
                {isCapturing ? (
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-scan-beam" />
                ) : null}

                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-xs text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/30 whitespace-nowrap">
                  Align {currentLang.name} script inside
                </div>
              </div>
            )}

            {/* Camera Inactive / Permission Needed / Error Overlay */}
            {(!cameraActive || cameraError) && (
              <div className="absolute inset-0 bg-neutral-900/95 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center z-10">
                <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-500 mb-3 shadow-inner">
                  {cameraError ? <AlertTriangle className="w-6 h-6 text-red-400" /> : <Camera className="w-6 h-6" />}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {cameraError ? "Camera Access Blocked" : "Live Viewfinder Standby"}
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mb-4 leading-relaxed">
                  {cameraError
                    ? "Camera permission is restricted or unavailable. You can click retry or pick a photo from your gallery."
                    : `Start the live camera scanner to read and transliterate ${currentLang.name} signs, menus, and text in real-time.`}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onStartCamera}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {cameraError ? "Retry Camera" : "Launch Camera"}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs border border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls Bar: Zoom Slider + Big Tactile Shutter */}
      <div className="p-3 bg-neutral-900/95 border-t border-neutral-800 shrink-0 flex flex-col gap-2 z-10">
        {/* Zoom Quick Selector */}
        <div className="flex items-center justify-between gap-3 text-white/80">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Sliders className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">Zoom:</span>
          </div>

          <div className="flex items-center gap-1">
            {[1.0, 1.5, 2.0, 3.0].map((z) => (
              <button
                key={z}
                onClick={() => onChangeZoom(z)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                  Math.abs(zoomValue - z) < 0.1
                    ? "bg-amber-500 text-black shadow-xs"
                    : "bg-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                {z}x
              </button>
            ))}
          </div>

          <input
            type="range"
            min={zoomRange.min}
            max={zoomRange.max}
            step={zoomRange.step}
            value={zoomValue}
            onChange={(e) => onChangeZoom(parseFloat(e.target.value))}
            className="w-24 sm:w-32 accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            aria-label="Zoom Level"
          />
        </div>

        {/* Shutter / Action Row */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] font-medium">Gallery</span>
          </button>

          {/* Primary Shutter Button */}
          {uploadedImageSrc ? (
            <button
              onClick={onAnalyzeUploadedFocus}
              disabled={isCapturing}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Script...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Photo Segment
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onCaptureFrame}
              disabled={isCapturing || !cameraActive}
              className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
              title="Snap and Transliterate Live Frame"
              aria-label="Capture and Transliterate"
            >
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/40 group-hover:scale-105 transition-transform" />
              {isCapturing ? (
                <RefreshCw className="w-5 h-5 text-black animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-xs">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          )}

          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider text-right">
            {isCapturing ? "Scanning..." : "Ready"}
          </div>
        </div>
      </div>
    </div>
  );
};
