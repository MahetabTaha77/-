import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  SkipForward, 
  SkipBack, 
  Settings, 
  Subtitles, 
  Tv, 
  Sparkles, 
  GraduationCap, 
  User, 
  HelpCircle, 
  Layers, 
  Activity, 
  Flame, 
  Snowflake, 
  Filter, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  Search,
  ListVideo,
  FileText,
  Camera,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { CHARACTERS, SCENES } from '../data/scriptData';
import { Scene, DialogueLine, Character } from '../types';
import { soundFX } from '../utils/soundEffects';

interface FullVideoPlayerProps {
  isAudioEnabled: boolean;
  setIsAudioEnabled: (enabled: boolean) => void;
  onNavigateToSimulator?: () => void;
  onNavigateToCalculator?: () => void;
}

export const FullVideoPlayer: React.FC<FullVideoPlayerProps> = ({
  isAudioEnabled,
  setIsAudioEnabled,
  onNavigateToSimulator,
  onNavigateToCalculator,
}) => {
  // Video State
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [subtitleSize, setSubtitleSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const transcriptScrollRef = useRef<HTMLDivElement>(null);

  const currentScene: Scene = SCENES[currentSceneIdx] || SCENES[0];
  const currentDialogue: DialogueLine | undefined = currentScene.dialogues[currentDialogueIdx];
  const speaker: Character = currentDialogue ? (CHARACTERS[currentDialogue.characterId] || CHARACTERS.dr_abdullah) : CHARACTERS.dr_abdullah;

  // Calculate total scenario metrics
  const totalDialoguesCount = SCENES.reduce((acc, s) => acc + s.dialogues.length, 0);
  
  // Calculate current overall index
  let globalDialogueIndex = 0;
  for (let s = 0; s < currentSceneIdx; s++) {
    globalDialogueIndex += SCENES[s].dialogues.length;
  }
  globalDialogueIndex += currentDialogueIdx + 1;

  // Estimated progress percentage
  const progressPercent = Math.min(100, Math.round((globalDialogueIndex / totalDialoguesCount) * 100));

  // Estimated timestamps (assuming ~5 seconds per line at 1x)
  const currentSeconds = Math.round(globalDialogueIndex * 5.5 / playbackSpeed);
  const totalSeconds = Math.round(totalDialoguesCount * 5.5 / playbackSpeed);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Sync SFX settings
  useEffect(() => {
    soundFX.enabled = sfxEnabled;
  }, [sfxEnabled]);

  // Speech Synthesis for Arabic Voiceover
  const speakLine = (line: DialogueLine) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (!isAudioEnabled) return;

    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.lang = 'ar-SA';
    utterance.rate = playbackSpeed;

    // Pitch tuning for realistic voice separation
    if (line.characterId === 'dr_abdullah') {
      utterance.pitch = 0.88;
    } else if (line.characterId === 'mohamed') {
      utterance.pitch = 1.08;
    } else if (line.characterId === 'hussein') {
      utterance.pitch = 0.95;
    } else if (line.characterId === 'basant') {
      utterance.pitch = 1.25;
    }

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onend = () => {
      if (isPlaying) {
        advanceNext();
      }
    };

    utterance.onerror = () => {
      if (isPlaying) {
        setTimeout(advanceNext, 3000 / playbackSpeed);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Advance to next line or next scene
  const advanceNext = () => {
    if (currentDialogueIdx < currentScene.dialogues.length - 1) {
      setCurrentDialogueIdx((prev) => prev + 1);
    } else if (currentSceneIdx < SCENES.length - 1) {
      if (sfxEnabled) soundFX.playSceneTransition();
      setCurrentSceneIdx((prev) => prev + 1);
      setCurrentDialogueIdx(0);
    } else {
      // Finished entire movie!
      setIsPlaying(false);
      if (sfxEnabled) soundFX.playKeyConceptChime();
    }
  };

  // Advance to previous line or prev scene
  const advancePrev = () => {
    window.speechSynthesis?.cancel();
    if (currentDialogueIdx > 0) {
      setCurrentDialogueIdx((prev) => prev - 1);
    } else if (currentSceneIdx > 0) {
      const prevScene = SCENES[currentSceneIdx - 1];
      setCurrentSceneIdx((prev) => prev - 1);
      setCurrentDialogueIdx(prevScene.dialogues.length - 1);
    }
  };

  // Jump to specific scene & dialogue
  const jumpToMoment = (sceneIndex: number, dialogueIndex: number = 0) => {
    window.speechSynthesis?.cancel();
    setCurrentSceneIdx(sceneIndex);
    setCurrentDialogueIdx(dialogueIndex);
    if (sfxEnabled) soundFX.playTick();
  };

  // Play / Pause handler
  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (sfxEnabled) soundFX.playTick();
      if (currentDialogue) {
        speakLine(currentDialogue);
      }
    }
  };

  // Auto-play trigger on state change
  useEffect(() => {
    if (isPlaying && currentDialogue) {
      if (isAudioEnabled) {
        speakLine(currentDialogue);
      } else {
        const textLength = currentDialogue.text.length;
        const durationMs = Math.max(2500, (textLength * 70)) / playbackSpeed;
        const timer = setTimeout(() => {
          if (isPlaying) advanceNext();
        }, durationMs);
        return () => clearTimeout(timer);
      }
    }
  }, [isPlaying, currentSceneIdx, currentDialogueIdx, isAudioEnabled, playbackSpeed]);

  // Keyboard shortcuts (Space: Play/Pause, Arrows: Prev/Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        e.preventDefault();
        advanceNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        e.preventDefault();
        advancePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentSceneIdx, currentDialogueIdx]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Copy transcript or take snapshot
  const copyCurrentSceneScript = () => {
    const fullText = `=== ${currentScene.title} ===\nالموقع: ${currentScene.location}\n\n` +
      currentScene.dialogues.map((d) => `${CHARACTERS[d.characterId]?.name || 'متحدث'}: ${d.text}`).join('\n');
    navigator.clipboard?.writeText(fullText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className={`space-y-4 transition-all duration-300 ${isTheaterMode ? 'max-w-full' : 'max-w-7xl'} mx-auto`}>
      
      {/* Top Header & Mode Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <Tv className="w-3.5 h-3.5" />
              مشغل الفيديو والسيناريو السينمائي الكامل
            </span>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
              9 SCENES • HD 1080p
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            الباب الأول: دائرة التبريد البسيطة (الفيلم التعليمي التفاعلي)
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
              showTranscript 
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ListVideo className="w-3.5 h-3.5" />
            <span>نص السيناريو المتزامن</span>
          </button>

          <button
            onClick={copyCurrentSceneScript}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
            title="نسخ حوار المشهد الحالي"
          >
            {copiedNotification ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">تم النسخ!</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>نسخ المشهد</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Video Cinema Container */}
      <div 
        ref={videoContainerRef}
        className={`relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 transition-all ${
          isFullscreen ? 'w-screen h-screen flex flex-col justify-between' : ''
        }`}
      >
        
        {/* VIDEO STAGE (16:9 Aspect ratio canvas) */}
        <div className="relative w-full aspect-video min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden">
          
          {/* Ambient Lighting & Stage Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

          {/* Top Video Overlay: Scene Title & Watermark */}
          <div className="relative z-20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-white shadow-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold text-blue-300">المشهد {currentScene.id}:</span>
              <span className="text-slate-200 font-medium">{currentScene.title.split(':')[1] || currentScene.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[11px] text-slate-300 font-mono">
                {currentScene.location}
              </span>
            </div>
          </div>

          {/* CENTER STAGE: Dynamic Smartboard & Character Studio */}
          <div className="relative z-10 my-auto grid grid-cols-12 gap-4 items-center max-w-6xl mx-auto w-full">
            
            {/* Left: 3 Students Desks (Col 3.5) */}
            <div className="col-span-12 sm:col-span-3 space-y-2 order-2 sm:order-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>مقاعد الطلاب بالمعمل</span>
              </div>
              
              {/* Student Mohamed */}
              <div className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2.5 ${
                currentDialogue?.characterId === 'mohamed'
                  ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-400/40 shadow-lg scale-102'
                  : 'bg-slate-900/50 border-slate-800 opacity-60 hover:opacity-100'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                  مح
                </div>
                <div className="min-w-0">
                  <strong className="text-xs text-white block leading-tight">محمد</strong>
                  <span className="text-[10px] text-amber-300 block truncate">طالب هندسة - دوائر وتطبيقات</span>
                </div>
                {currentDialogue?.characterId === 'mohamed' && (
                  <div className="mr-auto flex gap-0.5">
                    <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" />
                    <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                )}
              </div>

              {/* Student Hussein */}
              <div className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2.5 ${
                currentDialogue?.characterId === 'hussein'
                  ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg scale-102'
                  : 'bg-slate-900/50 border-slate-800 opacity-60 hover:opacity-100'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  حس
                </div>
                <div className="min-w-0">
                  <strong className="text-xs text-white block leading-tight">حسين</strong>
                  <span className="text-[10px] text-emerald-300 block truncate">طالب هندسة - تساؤلات ومفاهيم</span>
                </div>
                {currentDialogue?.characterId === 'hussein' && (
                  <div className="mr-auto flex gap-0.5">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                )}
              </div>

              {/* Student Basant */}
              <div className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2.5 ${
                currentDialogue?.characterId === 'basant'
                  ? 'bg-purple-950/70 border-purple-400 ring-2 ring-purple-400/40 shadow-lg scale-102'
                  : 'bg-slate-900/50 border-slate-800 opacity-60 hover:opacity-100'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                  بس
                </div>
                <div className="min-w-0">
                  <strong className="text-xs text-white block leading-tight">بسنت</strong>
                  <span className="text-[10px] text-purple-300 block truncate">طالبة هندسة - تحليل فيزيائي ورياضي</span>
                </div>
                {currentDialogue?.characterId === 'basant' && (
                  <div className="mr-auto flex gap-0.5">
                    <span className="w-1 h-3 bg-purple-400 rounded-full animate-bounce" />
                    <span className="w-1 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-1 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                )}
              </div>
            </div>

            {/* Center: Interactive Smartboard Screen inside the Video Stage (Col 6) */}
            <div className="col-span-12 sm:col-span-6 bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 shadow-2xl relative overflow-hidden order-1 sm:order-2 min-h-[220px] flex flex-col justify-between">
              <div className="absolute top-2 left-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/70" />
                <span className="w-2 h-2 rounded-full bg-amber-500/70" />
                <span className="w-2 h-2 rounded-full bg-green-500/70" />
                <span className="text-[10px] text-slate-500 font-mono mr-2">LAB SMARTBOARD</span>
              </div>

              {/* Dynamic Content based on Scene & Line */}
              <div className="pt-4 pb-2 text-center my-auto">
                
                {/* Scene 1: Heat Transfer Concept */}
                {currentScene.id === 1 && (
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      المبدأ الأساسي: الثلاجة تنقل الحرارة ولا تصنع البرودة
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs">
                      <div className="p-3 bg-slate-950 rounded-xl border border-blue-500/30 text-blue-300">
                        <Snowflake className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                        <span>الحيز البارد (الثلاجة)</span>
                      </div>
                      <div className="text-slate-400 font-bold flex flex-col items-center">
                        <span className="text-amber-400 font-mono font-bold">Q_in ➔ Q_out</span>
                        <span className="text-[10px] text-slate-400">بذل شغل ميكانيكي (W)</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/30 text-rose-300">
                        <Flame className="w-5 h-5 mx-auto mb-1 text-rose-400" />
                        <span>الوسط المحيط الساخن</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 2, 3, 4, 5: 4-Component Schematic */}
                {[2, 3, 4, 5].includes(currentScene.id) && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`p-2.5 rounded-xl border transition-all ${
                        currentDialogue?.relatedComponentId === 'compressor' || currentScene.id === 5
                          ? 'bg-rose-950/80 border-rose-400 text-rose-200 ring-2 ring-rose-500/40 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <strong className="text-xs">الضاغط Compressor</strong>
                          <Activity className="w-3.5 h-3.5 text-rose-400" />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">1 ➔ 2: رفع الضغط والحرارة (w_c)</span>
                      </div>

                      <div className={`p-2.5 rounded-xl border transition-all ${
                        currentDialogue?.relatedComponentId === 'condenser'
                          ? 'bg-amber-950/80 border-amber-400 text-amber-200 ring-2 ring-amber-500/40 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <strong className="text-xs">المكثف Condenser</strong>
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">2 ➔ 3: طرد الحرارة وتكثيف (q_c)</span>
                      </div>

                      <div className={`p-2.5 rounded-xl border transition-all ${
                        currentDialogue?.relatedComponentId === 'expansion'
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <strong className="text-xs">صمام التمدد Expansion</strong>
                          <Filter className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">3 ➔ 4: خنق ثبوت الإنثالبي (h₃=h₄)</span>
                      </div>

                      <div className={`p-2.5 rounded-xl border transition-all ${
                        currentDialogue?.relatedComponentId === 'evaporator'
                          ? 'bg-blue-950/80 border-blue-400 text-blue-200 ring-2 ring-blue-500/40 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <strong className="text-xs">المبخر Evaporator</strong>
                          <Snowflake className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">4 ➔ 1: امتصاص الحرارة والتبريد (q_e)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 6 & 7: Equations & COP */}
                {[6, 7].includes(currentScene.id) && (
                  <div className="space-y-2.5">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
                      معادلات الديناميكا الحرارية ومعامل الأداء
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-950 rounded-xl border border-blue-500/30">
                        <span className="text-slate-400 text-[10px] block">تأثير التبريد النوعي</span>
                        <strong className="text-blue-300 font-mono text-xs sm:text-sm">q_e = h_1 - h_4</strong>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-xl border border-rose-500/30">
                        <span className="text-slate-400 text-[10px] block">شغل الضاغط النوعي</span>
                        <strong className="text-rose-300 font-mono text-xs sm:text-sm">w_c = h_2 - h_1</strong>
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-emerald-500/40 text-center">
                      <span className="text-slate-400 text-[10px] block">معامل الأداء التبريدي (Coefficient of Performance)</span>
                      <strong className="text-emerald-300 font-mono text-sm sm:text-base">COP_r = q_e / w_c = (h_1 - h_4) / (h_2 - h_1)</strong>
                    </div>
                  </div>
                )}

                {/* Scene 8: Worked Example */}
                {currentScene.id === 8 && (
                  <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-cyan-500/40">
                    <div className="flex items-center justify-between text-xs text-slate-300 pb-1.5 border-b border-slate-800 font-mono">
                      <span>h₁ = 240 kJ/kg</span>
                      <span>h₂ = 280 kJ/kg</span>
                      <span>h₄ = 100 kJ/kg</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                      <div className="p-2 rounded-lg bg-slate-900 border border-blue-500/30">
                        <span className="text-[10px] text-slate-400 block">q_e</span>
                        <strong className="text-blue-300 font-mono">140 kJ/kg</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-rose-500/30">
                        <span className="text-[10px] text-slate-400 block">w_c</span>
                        <strong className="text-rose-300 font-mono">40 kJ/kg</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-emerald-500/30">
                        <span className="text-[10px] text-slate-400 block">COP_r</span>
                        <strong className="text-emerald-300 font-mono text-base">3.5</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 9: Summary & Next Chapter */}
                {currentScene.id === 9 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-400">الرباعية الذهبية لدورة التبريد</span>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Compression</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Condensation</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Expansion</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Evaporation</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      موعدنا القادم: الباب الثاني - طرق تحسين كفاءة دائرة التبريد
                    </p>
                  </div>
                )}

              </div>

              {/* Active Formula or Note Callout if available */}
              {currentDialogue?.formula && (
                <div className="bg-slate-950/90 py-1.5 px-3 rounded-lg border border-blue-500/30 text-blue-300 font-mono text-xs font-bold" dir="ltr">
                  {currentDialogue.formula}
                </div>
              )}
            </div>

            {/* Right: Dr. Abdullah Lectern & Character Podium (Col 3) */}
            <div className="col-span-12 sm:col-span-3 space-y-2 order-3">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>منصة المحاضر</span>
              </div>

              <div className={`p-3 rounded-2xl border transition-all duration-300 text-center ${
                currentDialogue?.characterId === 'dr_abdullah'
                  ? 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-400/40 shadow-xl scale-102'
                  : 'bg-slate-900/60 border-slate-800 opacity-70'
              }`}>
                {/* Doctor Avatar with Speaking Waves */}
                <div className="relative inline-block mx-auto mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-blue-400/50">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  {currentDialogue?.characterId === 'dr_abdullah' && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping" />
                  )}
                </div>

                <div>
                  <strong className="text-sm text-white block">د. عبدالله</strong>
                  <span className="text-[11px] text-blue-300 block font-medium">أستاذ أنظمة التبريد والتكييف</span>
                </div>

                {currentDialogue?.characterId === 'dr_abdullah' && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <span className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-blue-400 rounded-full animate-pulse [animation-delay:0.1s]" />
                    <span className="w-1 h-4 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.3s]" />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* LOWER-THIRD: Animated Subtitle & Speaker HUD */}
          {showSubtitles && currentDialogue && (
            <div className="relative z-20 max-w-4xl mx-auto w-full">
              <div className="bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-800/90 shadow-2xl flex items-start gap-3">
                {/* Speaker Mini Badge */}
                <div className="shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                    currentDialogue.characterId === 'dr_abdullah'
                      ? 'bg-blue-600 text-white'
                      : currentDialogue.characterId === 'mohamed'
                        ? 'bg-amber-600 text-white'
                        : currentDialogue.characterId === 'hussein'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-purple-600 text-white'
                  }`}>
                    {speaker.name}
                  </span>
                </div>

                {/* Subtitle Text */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-white leading-relaxed ${
                    subtitleSize === 'lg' ? 'text-base sm:text-lg' : subtitleSize === 'md' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                  }`}>
                    {currentDialogue.text}
                  </p>
                  
                  {currentDialogue.keyConcepts && currentDialogue.keyConcepts.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {currentDialogue.keyConcepts.map((concept, idx) => (
                        <span key={idx} className="text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                          ✦ {concept}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* VIDEO SCRUBBER & PLAYER CONTROLS (Bottom Bar) */}
        <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 space-y-2.5">
          
          {/* Progress Bar & Chapter Markers */}
          <div className="space-y-1">
            <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer group">
              {/* Filled Track */}
              <div 
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-200 relative"
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
              </div>

              {/* Scene Divider Points on Scrubber */}
              <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
                {SCENES.map((s, idx) => (
                  <span 
                    key={s.id} 
                    className={`w-0.5 h-full ${idx <= currentSceneIdx ? 'bg-blue-300/40' : 'bg-slate-700'}`} 
                  />
                ))}
              </div>
            </div>

            {/* Time & Chapter Details */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{formatTime(currentSeconds)}</span>
                <span>/</span>
                <span>{formatTime(totalSeconds)}</span>
                <span className="text-slate-500 hidden sm:inline">• الجملة {globalDialogueIndex} من {totalDialoguesCount}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">{progressPercent}% تم إنجازه</span>
              </div>
            </div>
          </div>

          {/* Control Buttons Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            
            {/* Left Controls: Play, Prev, Next, Replay */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={advancePrev}
                title="الجملة السابقة (السهم الأيسر)"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                title={isPlaying ? 'إيقاف مؤقت (المسافة)' : 'تشغيل الفيديو (المسافة)'}
                className={`p-2.5 sm:px-4 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-md ${
                  isPlaying 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span className="hidden sm:inline">{isPlaying ? 'إيقاف مؤقت' : 'تشغيل الفيلم'}</span>
              </button>

              <button
                onClick={advanceNext}
                title="الجملة التالية (السهم الأيمن)"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => jumpToMoment(0, 0)}
                title="إعادة تشغيل الفيلم من البداية"
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Center Scene Quick Jumper Tabs */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {SCENES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => jumpToMoment(idx, 0)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                    currentSceneIdx === idx 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={s.title}
                >
                  مشهد {s.id}
                </button>
              ))}
            </div>

            {/* Right Controls: Speed, Audio, Subtitles, Fullscreen */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Playback Speed Switcher */}
              <div className="relative">
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="bg-slate-800 text-slate-200 text-xs font-bold rounded-lg px-2 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                  title="سرعة تشغيل الفيديو"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1.0x (طبيعي)</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2.0x</option>
                </select>
              </div>

              {/* Voiceover Speech Toggle */}
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                title={isAudioEnabled ? 'كتم القارئ الصوتي' : 'تفعيل القارئ الصوتي للحوار'}
                className={`p-2 rounded-lg border transition ${
                  isAudioEnabled 
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50' 
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Subtitles CC Toggle */}
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                title={showSubtitles ? 'إخفاء شريط الترجمة (Subtitles)' : 'إظهار شريط الترجمة'}
                className={`p-2 rounded-lg border transition ${
                  showSubtitles 
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50' 
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة السينمائي (F)'}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* SYNCHRONIZED SCRIPT TRANSCRIPT & SCENE NAVIGATOR */}
      {showTranscript && (
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ListVideo className="w-4 h-4 text-blue-600" />
                سيناريو الفيديو المتزامن مع الإشارة الزمنية
              </h3>
              <p className="text-xs text-slate-500">
                اضغط على أي جملة للانتقال إليها مباشرة في الفيديو
              </p>
            </div>

            {/* Search Filter in Transcript */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في نص الفيديو..."
                className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg pr-8 pl-3 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Transcript Scenes List */}
          <div ref={transcriptScrollRef} className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {SCENES.map((scene, sIdx) => {
              const isCurrentScene = currentSceneIdx === sIdx;
              const filteredLines = scene.dialogues.filter((d) => 
                searchQuery.trim() === '' || 
                d.text.includes(searchQuery) || 
                (CHARACTERS[d.characterId]?.name.includes(searchQuery))
              );

              if (filteredLines.length === 0 && searchQuery.trim() !== '') return null;

              return (
                <div 
                  key={scene.id}
                  className={`rounded-xl border p-3.5 transition-all ${
                    isCurrentScene 
                      ? 'bg-blue-50/40 border-blue-300 ring-1 ring-blue-100' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {scene.id}
                      </span>
                      <strong className="text-xs text-slate-900">{scene.title}</strong>
                    </div>
                    <button
                      onClick={() => jumpToMoment(sIdx, 0)}
                      className="text-[11px] text-blue-600 font-bold hover:underline"
                    >
                      بدء هذا المشهد
                    </button>
                  </div>

                  {/* Lines List */}
                  <div className="space-y-1.5 pr-2 border-r-2 border-slate-200">
                    {filteredLines.map((line, lIdx) => {
                      const isCurrentLine = isCurrentScene && currentDialogueIdx === lIdx;
                      const char = CHARACTERS[line.characterId] || CHARACTERS.dr_abdullah;

                      return (
                        <div
                          key={line.id}
                          onClick={() => jumpToMoment(sIdx, lIdx)}
                          className={`p-2 rounded-lg cursor-pointer transition-all flex items-start gap-2.5 text-xs ${
                            isCurrentLine
                              ? 'bg-blue-600 text-white shadow-xs font-medium'
                              : 'hover:bg-white text-slate-700'
                          }`}
                        >
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            isCurrentLine
                              ? 'bg-white/20 text-white'
                              : line.characterId === 'dr_abdullah'
                                ? 'bg-slate-200 text-slate-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}>
                            {char.name}
                          </span>
                          <span className="leading-relaxed flex-1">{line.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 9 SCENE CHAPTER CARDS GRID (Quick Scene Selector) */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            فهرس فصول ومشاهد الفيلم (9 مشاهد تعليمية)
          </h3>
          <span className="text-xs text-slate-500 font-medium">اختر أي مشهد للانتقال الفوري</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SCENES.map((scene, idx) => {
            const isCurrent = currentSceneIdx === idx;
            return (
              <div
                key={scene.id}
                onClick={() => jumpToMoment(idx, 0)}
                className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1.5 relative overflow-hidden ${
                  isCurrent 
                    ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-100 shadow-xs' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    المشهد {scene.id}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {scene.dialogues.length} حوارات
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                  {scene.title.split(':')[1] || scene.title}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {scene.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
