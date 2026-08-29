import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Info,
  CheckCircle2,
  GraduationCap,
  User,
  HelpCircle,
  Cpu,
  Layers,
  Tv
} from 'lucide-react';
import { CHARACTERS, SCENES } from '../data/scriptData';
import { DialogueLine, Scene } from '../types';

interface DialogueViewerProps {
  onNavigateToComponent?: (componentId: string) => void;
  onNavigateToVideo?: () => void;
  isAudioEnabled: boolean;
}

export const DialogueViewer: React.FC<DialogueViewerProps> = ({
  onNavigateToComponent,
  onNavigateToVideo,
  isAudioEnabled,
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState<number>(0);
  const [speechPitch] = useState<number>(1);
  const [speechRate] = useState<number>(1);

  const dialogueListRef = useRef<HTMLDivElement>(null);
  const currentScene: Scene = SCENES[selectedSceneIndex];

  // Filter dialogues based on character and search query
  const filteredDialogues = currentScene.dialogues.filter((d) => {
    const matchChar = selectedCharacterFilter === 'all' || d.characterId === selectedCharacterFilter;
    const matchSearch = searchQuery.trim() === '' || 
      d.text.includes(searchQuery) || 
      (d.keyConcepts && d.keyConcepts.some((k) => k.includes(searchQuery))) ||
      CHARACTERS[d.characterId]?.name.includes(searchQuery);
    return matchChar && matchSearch;
  });

  // Web Speech synthesis for Arabic reading
  const speakText = (text: string, characterId: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = speechRate;

    // Pitch variation per character for engaging realism
    if (characterId === 'dr_abdullah') {
      utterance.pitch = 0.9;
    } else if (characterId === 'mohamed') {
      utterance.pitch = 1.05;
    } else if (characterId === 'hussein') {
      utterance.pitch = 0.95;
    } else if (characterId === 'basant') {
      utterance.pitch = 1.25;
    } else {
      utterance.pitch = speechPitch;
    }

    // Try finding Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => {
      if (isPlaying && activeDialogueIndex < filteredDialogues.length - 1) {
        setActiveDialogueIndex((prev) => prev + 1);
      } else if (isPlaying) {
        setIsPlaying(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle Autoplay progression
  useEffect(() => {
    if (isPlaying && isAudioEnabled) {
      const currentDialogue = filteredDialogues[activeDialogueIndex];
      if (currentDialogue) {
        speakText(currentDialogue.text, currentDialogue.characterId);
      }
    } else if (isPlaying && !isAudioEnabled) {
      const timer = setTimeout(() => {
        if (activeDialogueIndex < filteredDialogues.length - 1) {
          setActiveDialogueIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, activeDialogueIndex, selectedSceneIndex]);

  // Stop speech when scene changes
  const handleSceneChange = (index: number) => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setSelectedSceneIndex(index);
    setActiveDialogueIndex(0);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner / Scene Overview */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                المشهد {currentScene.id} من {SCENES.length}
              </span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                📍 {currentScene.location}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              {currentScene.title}
            </h2>
            {currentScene.subtitle && (
              <p className="text-xs sm:text-sm text-blue-600 font-medium">
                {currentScene.subtitle}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              {currentScene.description}
            </p>
          </div>

          {/* Autoplay & Reading controls */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 self-start lg:self-center">
            {onNavigateToVideo && (
              <button
                onClick={onNavigateToVideo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs"
              >
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                <span>مشاهدة كفيديو كامل HD</span>
              </button>
            )}

            <button
              onClick={() => {
                if (isPlaying) {
                  window.speechSynthesis?.cancel();
                  setIsPlaying(false);
                } else {
                  setIsPlaying(true);
                  if (isAudioEnabled && filteredDialogues[activeDialogueIndex]) {
                    speakText(filteredDialogues[activeDialogueIndex].text, filteredDialogues[activeDialogueIndex].characterId);
                  }
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm ${
                isPlaying 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'إيقاف مؤقت' : 'تشغيل المشهد'}</span>
            </button>

            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsPlaying(false);
                setActiveDialogueIndex(0);
              }}
              title="إعادة المشهد للبداية"
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Character Badges Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            الشخصيات:
          </span>
          {Object.values(CHARACTERS).map((char) => {
            const isSelected = selectedCharacterFilter === char.id;
            return (
              <button
                key={char.id}
                onClick={() => setSelectedCharacterFilter(isSelected ? 'all' : char.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  isSelected
                    ? `${char.avatarColor} shadow-sm ring-2 ring-blue-400`
                    : `${char.badgeBg} hover:border-slate-400`
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[9px]">
                  {char.avatarText}
                </span>
                <span>{char.name}</span>
                {isSelected && <span className="text-[9px] bg-white/20 px-1 rounded">محدد</span>}
              </button>
            );
          })}
          {selectedCharacterFilter !== 'all' && (
            <button
              onClick={() => setSelectedCharacterFilter('all')}
              className="text-xs text-blue-600 underline hover:text-blue-700 mr-2 font-medium"
            >
              عرض الجميع
            </button>
          )}
        </div>
      </div>

      {/* Scene Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {SCENES.map((scene, idx) => {
          const isCurrent = idx === selectedSceneIndex;
          return (
            <button
              key={scene.id}
              onClick={() => handleSceneChange(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                isCurrent
                  ? 'bg-blue-50 text-blue-700 border-blue-400 font-bold shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {scene.id}
              </span>
              <span>{scene.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في نصوص وحوارات المشهد..."
            className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg pr-9 pl-3 py-2 border border-slate-200 focus:border-blue-500 focus:outline-none focus:bg-white placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto text-xs text-slate-500">
          <span>
            إجمالي الجمل: <strong className="text-slate-800">{filteredDialogues.length}</strong>
          </span>
          <div className="flex items-center gap-1 mr-4">
            <button
              disabled={selectedSceneIndex === 0}
              onClick={() => handleSceneChange(selectedSceneIndex - 1)}
              className="p-1 rounded bg-slate-100 text-slate-600 border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200"
              title="المشهد السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              disabled={selectedSceneIndex === SCENES.length - 1}
              onClick={() => handleSceneChange(selectedSceneIndex + 1)}
              className="p-1 rounded bg-slate-100 text-slate-600 border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200"
              title="المشهد التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialogue Stream Container */}
      <div ref={dialogueListRef} className="space-y-3">
        {filteredDialogues.map((dialogue, index) => {
          const char = CHARACTERS[dialogue.characterId] || {
            name: dialogue.characterId,
            role: '',
            avatarColor: 'bg-slate-700 text-white',
            badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
            borderColor: 'border-slate-200',
            avatarText: '؟',
          };
          const isCurrentActive = isPlaying && activeDialogueIndex === index;
          const isDr = dialogue.characterId === 'dr_abdullah';

          return (
            <div
              key={dialogue.id}
              onClick={() => setActiveDialogueIndex(index)}
              className={`rounded-xl p-4 transition-all border relative ${
                isCurrentActive
                  ? 'bg-blue-50/70 border-blue-400 shadow-sm ring-1 ring-blue-300'
                  : isDr
                    ? 'bg-white border-slate-200 border-r-4 border-r-slate-800 shadow-sm hover:border-slate-300'
                    : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              {/* Speaker Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm ${char.avatarColor}`}>
                    {char.avatarText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{char.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${char.badgeBg}`}>
                        {char.role.split('-')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Speak button for this single line */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(dialogue.text, dialogue.characterId);
                  }}
                  title="استماع للجملة صوتياً"
                  className="p-1 rounded-md bg-slate-50 text-slate-500 border border-slate-200 hover:text-blue-600 hover:bg-blue-50 transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dialogue Text */}
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal pr-10">
                {dialogue.text}
              </p>

              {/* Formula Callout if any */}
              {dialogue.formula && (
                <div className="mt-2.5 mr-10 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-xs text-blue-900 font-bold">المعادلة المستنتجة:</span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-blue-700 font-bold bg-white px-2.5 py-0.5 rounded border border-blue-200" dir="ltr">
                    {dialogue.formula}
                  </div>
                </div>
              )}

              {/* Scientific Note if any */}
              {dialogue.note && (
                <div className="mt-2 mr-10 p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-amber-800 mb-0.5">إضاءة فيزيائية وهندسية:</strong>
                    <span className="text-amber-900/90">{dialogue.note}</span>
                  </div>
                </div>
              )}

              {/* Key Concepts Tags */}
              {dialogue.keyConcepts && dialogue.keyConcepts.length > 0 && (
                <div className="mt-2.5 mr-10 flex flex-wrap gap-1.5">
                  {dialogue.keyConcepts.map((concept, cIdx) => (
                    <span
                      key={cIdx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-blue-500" />
                      {concept}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredDialogues.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs">لا توجد نتائج مطابقة لبحثك في هذا المشهد.</p>
          </div>
        )}
      </div>

      {/* Footer Scene Navigation Bar */}
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
        <button
          disabled={selectedSceneIndex === 0}
          onClick={() => handleSceneChange(selectedSceneIndex - 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition border border-slate-200"
        >
          <ChevronRight className="w-3.5 h-3.5" />
          <span>المشهد السابق ({selectedSceneIndex > 0 ? SCENES[selectedSceneIndex - 1].title.split(':')[0] : ''})</span>
        </button>

        <span className="text-xs text-slate-400 font-mono font-bold hidden sm:inline">
          {selectedSceneIndex + 1} / {SCENES.length}
        </span>

        <button
          disabled={selectedSceneIndex === SCENES.length - 1}
          onClick={() => handleSceneChange(selectedSceneIndex + 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
        >
          <span>المشهد التالي ({selectedSceneIndex < SCENES.length - 1 ? SCENES[selectedSceneIndex + 1].title.split(':')[0] : ''})</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
