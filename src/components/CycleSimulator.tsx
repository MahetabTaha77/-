import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Flame, 
  Filter, 
  Snowflake, 
  Info, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Gauge,
  Thermometer,
  Layers,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { CYCLE_COMPONENTS, STATE_POINTS } from '../data/scriptData';
import { PhDiagram } from './PhDiagram';
import { StatePoint, CycleComponent } from '../types';

interface CycleSimulatorProps {
  onNavigateToCalculator?: () => void;
}

export const CycleSimulator: React.FC<CycleSimulatorProps> = ({ onNavigateToCalculator }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'schematic' | 'ph_diagram' | 'both'>('both');
  const [selectedStatePoint, setSelectedStatePoint] = useState<1 | 2 | 3 | 4 | null>(1);
  const [selectedComponent, setSelectedComponent] = useState<CycleComponent | null>(CYCLE_COMPONENTS[0]);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Default example enthalpies from Scene 8
  const h1 = 240;
  const h2 = 280;
  const h3 = 100;
  const h4 = 100;

  // Auto step progression if playing in step mode
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === 4 ? 1 : ((prev + 1) as 1 | 2 | 3 | 4)));
    }, 2500 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const currentStateInfo = STATE_POINTS.find((p) => p.id === (selectedStatePoint || activeStep)) || STATE_POINTS[0];

  return (
    <div className="space-y-4">
      
      {/* Top Controller & Mode Selector */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                المختبر التفاعلي
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                محاكي دورة الانضغاط البخاري ومخطط P-h
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              تتبع سريان مركب التبريد، انتقال الحرارة، وتحولات الطور بين المكونات الأربعة
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTab('schematic')}
                className={`px-2.5 py-1 rounded transition text-xs ${
                  activeTab === 'schematic' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                مخطط الدائرة
              </button>
              <button
                onClick={() => setActiveTab('ph_diagram')}
                className={`px-2.5 py-1 rounded transition text-xs ${
                  activeTab === 'ph_diagram' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                مخطط P-h
              </button>
              <button
                onClick={() => setActiveTab('both')}
                className={`px-2.5 py-1 rounded transition text-xs ${
                  activeTab === 'both' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                عرض مزدوج
              </button>
            </div>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition border ${
                isPlaying 
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' 
                  : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'إيقاف السريان' : 'تشغيل السريان'}</span>
            </button>

            {/* Speed selection */}
            <div className="flex items-center bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs gap-1 text-slate-600">
              <span className="text-[10px]">السرعة:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-1.5 py-0.5 rounded font-mono font-bold text-xs ${
                    speed === s ? 'bg-blue-600 text-white shadow-sm' : 'hover:text-slate-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual / Single Visual Grid */}
      <div className={`grid gap-4 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        
        {/* Schematic Circuit Section */}
        {(activeTab === 'schematic' || activeTab === 'both') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-7' : 'w-full'} bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3`}>
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-600" />
                  دائرة التبريد الميكانيكية المغلقة
                </h3>
                <span className="text-[11px] text-slate-500">
                  انقر على أي مكون أو نقطة للاطلاع على تفاصيل الحالة الفيزيائية
                </span>
              </div>

              {/* Pressure zones indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold">
                  ▲ ضغط عالي (High P)
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                  ▼ ضغط منخفض (Low P)
                </span>
              </div>
            </div>

            {/* Interactive Circuit Canvas */}
            <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-hidden select-none">
              
              {/* Pressure Zone Background tint */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-red-500/5 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-500/5 pointer-events-none" />

              {/* SVG Piping & Animated Particles */}
              <svg viewBox="0 0 500 360" className="w-full h-full">
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Piping Frame - Outer Loop */}
                {/* 1 -> Compressor (Left side bottom to top) */}
                <path
                  d="M 120 280 L 80 280 L 80 140 L 120 140"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90"
                />

                {/* Compressor to Condenser (Top Left to Center) */}
                <path
                  d="M 170 110 L 170 60 L 220 60"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90"
                />

                {/* Condenser to Expansion Valve (Top Center to Right to Middle) */}
                <path
                  d="M 320 60 L 420 60 L 420 180"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90"
                />

                {/* Expansion Valve to Evaporator (Middle Right to Bottom Center) */}
                <path
                  d="M 420 220 L 420 300 L 330 300"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90"
                />

                {/* Evaporator to State 1 */}
                <path
                  d="M 210 300 L 120 300"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90"
                />

                {/* Animated Particles flowing clockwise */}
                {isPlaying && (
                  <>
                    {/* Evap -> Comp (Cold Vapor) */}
                    <circle r="4" fill="#0284c7">
                      <animateMotion
                        path="M 210 300 L 80 300 L 80 140 L 120 140"
                        dur={`${4 / speed}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                    {/* Comp -> Cond (Hot Superheated Vapor) */}
                    <circle r="4" fill="#dc2626">
                      <animateMotion
                        path="M 160 110 L 170 60 L 220 60"
                        dur={`${2 / speed}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                    {/* Cond -> Exp (Warm Saturated Liquid) */}
                    <circle r="4" fill="#ea580c">
                      <animateMotion
                        path="M 320 60 L 420 60 L 420 180"
                        dur={`${3.5 / speed}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                    {/* Exp -> Evap (Cold Two-phase Mix) */}
                    <circle r="4" fill="#0891b2">
                      <animateMotion
                        path="M 420 220 L 420 300 L 330 300"
                        dur={`${3 / speed}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}

                {/* High / Low Pressure dashed divider */}
                <line x1="40" y1="180" x2="460" y2="180" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />
                <text x="460" y="160" fill="#dc2626" fontSize="10" textAnchor="end" fontWeight="bold">
                  ▲ ضغط مرتفع (High Pressure)
                </text>
                <text x="460" y="200" fill="#0284c7" fontSize="10" textAnchor="end" fontWeight="bold">
                  ▼ ضغط منخفض (Low Pressure)
                </text>

                {/* State Point 1 (Before Compressor) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedStatePoint(1)}
                >
                  <circle
                    cx="80"
                    cy="210"
                    r={selectedStatePoint === 1 ? 14 : 11}
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text x="80" y="214" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    1
                  </text>
                </g>

                {/* State Point 2 (After Compressor / Before Condenser) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedStatePoint(2)}
                >
                  <circle
                    cx="195"
                    cy="60"
                    r={selectedStatePoint === 2 ? 14 : 11}
                    fill="#dc2626"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text x="195" y="64" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    2
                  </text>
                </g>

                {/* State Point 3 (After Condenser / Before Expansion) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedStatePoint(3)}
                >
                  <circle
                    cx="420"
                    cy="110"
                    r={selectedStatePoint === 3 ? 14 : 11}
                    fill="#ea580c"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text x="420" y="114" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    3
                  </text>
                </g>

                {/* State Point 4 (After Expansion / Before Evaporator) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedStatePoint(4)}
                >
                  <circle
                    cx="420"
                    cy="260"
                    r={selectedStatePoint === 4 ? 14 : 11}
                    fill="#0891b2"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text x="420" y="264" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    4
                  </text>
                </g>

                {/* Work Input Arrow (w_c) into Compressor */}
                <g>
                  <line x1="60" y1="120" x2="110" y2="120" stroke="#dc2626" strokeWidth="2" />
                  <polygon points="108,116 116,120 108,124" fill="#dc2626" />
                  <text x="50" y="105" fill="#dc2626" fontSize="10" fontWeight="bold">
                    شغل الضاغط wᶜ
                  </text>
                </g>

                {/* Heat Out Arrow (q_c) from Condenser */}
                <g>
                  <line x1="270" y1="40" x2="270" y2="15" stroke="#ea580c" strokeWidth="2" />
                  <polygon points="266,18 274,18 270,10" fill="#ea580c" />
                  <text x="270" y="10" fill="#ea580c" fontSize="10" fontWeight="bold" textAnchor="middle">
                    حرارة مطرودة q_out (المحيط)
                  </text>
                </g>

                {/* Heat In Arrow (q_e) into Evaporator */}
                <g>
                  <line x1="270" y1="345" x2="270" y2="320" stroke="#0284c7" strokeWidth="2" />
                  <polygon points="266,322 274,322 270,314" fill="#0284c7" />
                  <text x="270" y="355" fill="#0284c7" fontSize="10" fontWeight="bold" textAnchor="middle">
                    حرارة ممتصة qₑ (الحيز المبرد)
                  </text>
                </g>
              </svg>

              {/* 1. COMPRESSOR COMPONENT BOX */}
              <div
                onClick={() => setSelectedComponent(CYCLE_COMPONENTS[0])}
                className={`absolute top-20 left-24 sm:left-28 w-24 sm:w-28 p-2 rounded-xl bg-white border cursor-pointer transition-all shadow-md ${
                  selectedComponent?.id === 'compressor'
                    ? 'border-red-500 ring-2 ring-red-200 bg-red-50/40'
                    : 'border-red-200 hover:border-red-400'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <Activity className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-[9px] font-mono text-red-600 font-bold">1 → 2</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">الضاغط</h4>
                <p className="text-[9px] text-slate-500">Compressor</p>
                <span className="block mt-1 text-[8px] text-red-700 bg-red-50 px-1 py-0.5 rounded text-center font-bold border border-red-100">
                  رفع الضغط والحرارة
                </span>
              </div>

              {/* 2. CONDENSER COMPONENT BOX */}
              <div
                onClick={() => setSelectedComponent(CYCLE_COMPONENTS[1])}
                className={`absolute top-4 left-1/2 -translate-x-1/2 w-28 sm:w-34 p-2 rounded-xl bg-white border cursor-pointer transition-all shadow-md ${
                  selectedComponent?.id === 'condenser'
                    ? 'border-amber-500 ring-2 ring-amber-200 bg-amber-50/40'
                    : 'border-amber-200 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[9px] font-mono text-amber-600 font-bold">2 → 3</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">المكثف</h4>
                <p className="text-[9px] text-slate-500">Condenser</p>
                <span className="block mt-1 text-[8px] text-amber-700 bg-amber-50 px-1 py-0.5 rounded text-center font-bold border border-amber-100">
                  طرد الحرارة وتكثيف
                </span>
              </div>

              {/* 3. EXPANSION DEVICE COMPONENT BOX */}
              <div
                onClick={() => setSelectedComponent(CYCLE_COMPONENTS[2])}
                className={`absolute top-36 right-16 sm:right-20 w-24 sm:w-28 p-2 rounded-xl bg-white border cursor-pointer transition-all shadow-md ${
                  selectedComponent?.id === 'expansion'
                    ? 'border-cyan-500 ring-2 ring-cyan-200 bg-cyan-50/40'
                    : 'border-cyan-200 hover:border-cyan-400'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <Filter className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="text-[9px] font-mono text-cyan-600 font-bold">3 → 4</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">جهاز التمدد</h4>
                <p className="text-[9px] text-slate-500">Expansion Valve</p>
                <span className="block mt-1 text-[8px] text-cyan-700 bg-cyan-50 px-1 py-0.5 rounded text-center font-bold border border-cyan-100">
                  خنق h₃ = h₄
                </span>
              </div>

              {/* 4. EVAPORATOR COMPONENT BOX */}
              <div
                onClick={() => setSelectedComponent(CYCLE_COMPONENTS[3])}
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-28 sm:w-34 p-2 rounded-xl bg-white border cursor-pointer transition-all shadow-md ${
                  selectedComponent?.id === 'evaporator'
                    ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/40'
                    : 'border-blue-200 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <Snowflake className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[9px] font-mono text-blue-600 font-bold">4 → 1</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">المبخر</h4>
                <p className="text-[9px] text-slate-500">Evaporator</p>
                <span className="block mt-1 text-[8px] text-blue-700 bg-blue-50 px-1 py-0.5 rounded text-center font-bold border border-blue-100">
                  امتصاص الحرارة وتبريد
                </span>
              </div>

            </div>

            {/* State Points Quick Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {STATE_POINTS.map((pt) => {
                const isSelected = selectedStatePoint === pt.id;
                return (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedStatePoint(pt.id)}
                    className={`p-2 rounded-lg border text-right transition ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                        {pt.id}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {pt.enthalpyKey}={pt.defaultEnthalpy}
                      </span>
                    </div>
                    <strong className="block text-xs text-slate-800 truncate font-semibold">
                      {pt.titleAr.split(':')[0]}
                    </strong>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {pt.phaseAr.split('(')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* P-h Diagram Section */}
        {(activeTab === 'ph_diagram' || activeTab === 'both') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-5' : 'w-full'}`}>
            <PhDiagram
              h1={h1}
              h2={h2}
              h3={h3}
              h4={h4}
              pLow={2.0}
              pHigh={12.0}
              selectedStatePoint={selectedStatePoint}
              onSelectStatePoint={(id) => setSelectedStatePoint(id)}
            />
          </div>
        )}

      </div>

      {/* Selected Component & State Point Deep Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Component Deep Breakdown */}
        {selectedComponent && (
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  {selectedComponent.id === 'compressor' && <Activity className="w-5 h-5 text-red-600" />}
                  {selectedComponent.id === 'condenser' && <Flame className="w-5 h-5 text-amber-600" />}
                  {selectedComponent.id === 'expansion' && <Filter className="w-5 h-5 text-cyan-600" />}
                  {selectedComponent.id === 'evaporator' && <Snowflake className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedComponent.nameEn}</span>
                  <h3 className="text-base font-bold text-slate-900">{selectedComponent.nameAr}</h3>
                </div>
              </div>

              <span className="text-xs px-2.5 py-0.5 rounded border font-semibold bg-slate-100 text-slate-700 border-slate-200">
                العملية: {selectedComponent.entryState} → {selectedComponent.exitState}
              </span>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedComponent.description}
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">المعادلة الديناميكية:</span>
                  <strong className="text-xs sm:text-sm text-slate-800 font-bold">
                    {selectedComponent.formulaAr}
                  </strong>
                </div>
                <div className="font-mono text-xs bg-white px-2.5 py-1 rounded border border-slate-200 text-blue-700 font-bold" dir="ltr">
                  {selectedComponent.formulaMath}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <button
                  onClick={() => onNavigateToCalculator && onNavigateToCalculator()}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  حساب قيم الطاقة في الحاسبة الحرارية ←
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State Point Deep Breakdown */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {currentStateInfo.id}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono">{currentStateInfo.titleEn}</span>
                <h3 className="text-base font-bold text-slate-900">{currentStateInfo.titleAr}</h3>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5 flex items-center gap-1 text-[10px]">
                  <Layers className="w-3 h-3 text-blue-500" />
                  الحالة والطور الفيزيائي:
                </span>
                <strong className="text-slate-800 text-xs">{currentStateInfo.phaseAr}</strong>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5 flex items-center gap-1 text-[10px]">
                  <Gauge className="w-3 h-3 text-blue-500" />
                  مستوى الضغط:
                </span>
                <strong className={`text-xs font-bold ${currentStateInfo.pressureLevel === 'high' ? 'text-red-600' : 'text-blue-600'}`}>
                  {currentStateInfo.pressureLevel === 'high' ? 'ضغط عالي (High P)' : 'ضغط منخفض (Low P)'}
                </strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {currentStateInfo.description}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
              <span>الموقع: <strong className="text-slate-800">{currentStateInfo.locationAr}</strong></span>
              <span>الإنثالبي (المثال): <strong className="text-blue-600 font-mono font-bold">{currentStateInfo.defaultEnthalpy} kJ/kg</strong></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
