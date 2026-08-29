/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FullVideoPlayer } from './components/FullVideoPlayer';
import { DialogueViewer } from './components/DialogueViewer';
import { CycleSimulator } from './components/CycleSimulator';
import { ThermodynamicCalculator } from './components/ThermodynamicCalculator';
import { ReviewQuestions } from './components/ReviewQuestions';
import { SummaryCard } from './components/SummaryCard';
import { 
  Tv,
  BookOpen, 
  Cpu, 
  Calculator, 
  HelpCircle, 
  Award,
  Sparkles,
  Snowflake,
  Flame,
  Activity,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('video');
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-slate-800 font-['Cairo',sans-serif] selection:bg-blue-500 selection:text-white flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAudioEnabled={isAudioEnabled}
        setIsAudioEnabled={setIsAudioEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        
        {/* Quick Stats & Context Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div 
            onClick={() => setActiveTab('video')}
            className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 shadow-xs ${
              activeTab === 'video' ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-200' : 'bg-white border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">عرض الفيديو</span>
              <strong className="text-xs sm:text-sm text-slate-800 font-bold">الفيلم الكامل HD</strong>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('simulator')}
            className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 shadow-xs ${
              activeTab === 'simulator' ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-200' : 'bg-white border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">العمليات الحرارية</span>
              <strong className="text-xs sm:text-sm text-slate-800 font-bold">4 عمليات دورية</strong>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('script')}
            className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 shadow-xs ${
              activeTab === 'script' ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-200' : 'bg-white border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">السيناريو التعليمي</span>
              <strong className="text-xs sm:text-sm text-slate-800 font-bold">9 مشاهد حوارية</strong>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('quiz')}
            className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 shadow-xs ${
              activeTab === 'quiz' ? 'bg-green-50/70 border-green-400 ring-1 ring-green-200' : 'bg-white border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 border border-green-100 flex items-center justify-center shrink-0 font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">المراجعة والتقييم</span>
              <strong className="text-xs sm:text-sm text-slate-800 font-bold">8 أسئلة ونموذج حل</strong>
            </div>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'video' && (
          <FullVideoPlayer
            isAudioEnabled={isAudioEnabled}
            setIsAudioEnabled={setIsAudioEnabled}
            onNavigateToSimulator={() => setActiveTab('simulator')}
            onNavigateToCalculator={() => setActiveTab('calculator')}
          />
        )}

        {activeTab === 'script' && (
          <DialogueViewer
            isAudioEnabled={isAudioEnabled}
            onNavigateToComponent={() => setActiveTab('simulator')}
            onNavigateToVideo={() => setActiveTab('video')}
          />
        )}

        {activeTab === 'simulator' && (
          <CycleSimulator
            onNavigateToCalculator={() => setActiveTab('calculator')}
          />
        )}

        {activeTab === 'calculator' && (
          <ThermodynamicCalculator />
        )}

        {activeTab === 'quiz' && (
          <ReviewQuestions />
        )}

        {activeTab === 'summary' && (
          <SummaryCard
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="font-bold text-slate-700">
              مقرر أنظمة التبريد والتكييف – الباب الأول: دائرة التبريد البسيطة
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            د. عبدالله • محمد • حسين • بسنت | Vapor Compression Refrigeration System
          </p>
        </div>
      </footer>

    </div>
  );
}

