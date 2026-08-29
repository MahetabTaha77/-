import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Flame, 
  Snowflake,
  Info,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { REFRIGERANT_PRESETS } from '../data/refrigerantPresets';

export const ThermodynamicCalculator: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('script_example');
  
  // Enthalpy inputs (kJ/kg)
  const [h1, setH1] = useState<number>(240);
  const [h2, setH2] = useState<number>(280);
  const [h4, setH4] = useState<number>(100);
  // In ideal throttling, h3 = h4
  const h3 = h4;

  // Mass flow rate (kg/s)
  const [massFlow, setMassFlow] = useState<number>(0.05); // 0.05 kg/s default

  // Calculations
  const qe = Number((h1 - h4).toFixed(2)); // Refrigeration effect (kJ/kg)
  const wc = Number((h2 - h1).toFixed(2)); // Compressor work (kJ/kg)
  const qc = Number((h2 - h3).toFixed(2)); // Condenser heat rejection (kJ/kg)
  
  // COP
  const cop = wc > 0 && qe > 0 ? Number((qe / wc).toFixed(2)) : 0;

  // Capacities & Powers
  const Qe_kW = Number((massFlow * qe).toFixed(2)); // Cooling Capacity (kW)
  const Qe_TR = Number((Qe_kW / 3.517).toFixed(2)); // Tons of Refrigeration (TR)
  const Wc_kW = Number((massFlow * wc).toFixed(2)); // Compressor Power (kW)
  const Wc_hp = Number((Wc_kW / 0.746).toFixed(2)); // Horsepower (hp)
  const Qc_kW = Number((massFlow * qc).toFixed(2)); // Condenser heat (kW)

  // Load Preset
  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = REFRIGERANT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setH1(preset.defaultH1);
      setH2(preset.defaultH2);
      setH4(preset.defaultH4);
    }
  };

  const isScriptExample = h1 === 240 && h2 === 280 && h4 === 100;

  return (
    <div className="space-y-4">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                الحسابات الهندسية
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                حاسبة الأداء الحراري ومعامل الأداء (COP Solver)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              حل مباشر لمعادلات الطاقة وتأثير التبريد وشغل الضاغط بناءً على إنثالبي النقاط
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-600 font-semibold px-1">النموذج:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="bg-white text-blue-700 text-xs font-bold rounded-md px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-500 shadow-xs"
            >
              {REFRIGERANT_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Script Highlight Box if on example */}
        {isScriptExample && (
          <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <strong className="block font-bold text-blue-800 text-xs mb-0.5">
                تطابق تام مع أرقام المشهد الثامن (د. عبدالله والطلاب):
              </strong>
              <span className="text-slate-700">
                h₁ = 240 kJ/kg, h₂ = 280 kJ/kg, h₄ = 100 kJ/kg ← ينتج عنها qₑ = 140 kJ/kg، wᶜ = 40 kJ/kg، ومعامل أداء COPᵣ = 3.5
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Col: Inputs & Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              مدخلات الإنثالبي والكتلة
            </h3>
            <button
              onClick={() => handlePresetSelect('script_example')}
              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              إعادة الضبط
            </button>
          </div>

          {/* Input h1 */}
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                h₁: مخرج المبخر / مدخل الضاغط
              </label>
              <span className="font-mono text-blue-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                {h1} kJ/kg
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="1600"
              step="1"
              value={h1}
              onChange={(e) => {
                setH1(Number(e.target.value));
                setSelectedPresetId('custom');
              }}
              className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer h-1.5"
            />
            <p className="text-[10px] text-slate-500">حالة البخار المشبع الداخل للضاغط</p>
          </div>

          {/* Input h2 */}
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                h₂: مخرج الضاغط / مدخل المكثف
              </label>
              <span className="font-mono text-red-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                {h2} kJ/kg
              </span>
            </div>
            <input
              type="range"
              min={h1 + 5}
              max="1800"
              step="1"
              value={h2}
              onChange={(e) => {
                setH2(Number(e.target.value));
                setSelectedPresetId('custom');
              }}
              className="w-full accent-red-600 bg-slate-200 rounded-lg cursor-pointer h-1.5"
            />
            <p className="text-[10px] text-slate-500">حالة البخار المحمص الساخن بعد الانضغاط</p>
          </div>

          {/* Input h4 (= h3) */}
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                h₄ (= h₃): مخرج جهاز التمدد
              </label>
              <span className="font-mono text-amber-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                {h4} kJ/kg
              </span>
            </div>
            <input
              type="range"
              min="20"
              max={h1 - 10}
              step="1"
              value={h4}
              onChange={(e) => {
                setH4(Number(e.target.value));
                setSelectedPresetId('custom');
              }}
              className="w-full accent-amber-500 bg-slate-200 rounded-lg cursor-pointer h-1.5"
            />
            <p className="text-[10px] text-slate-500">الإنثالبي ثابت في عملية الخنق (h₃ = h₄)</p>
          </div>

          {/* Input Mass Flow Rate */}
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                معدل تدفق الكتلة (ṁ)
              </label>
              <span className="font-mono text-purple-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                {massFlow} kg/s
              </span>
            </div>
            <input
              type="range"
              min="0.01"
              max="1.0"
              step="0.01"
              value={massFlow}
              onChange={(e) => setMassFlow(Number(e.target.value))}
              className="w-full accent-purple-600 bg-slate-200 rounded-lg cursor-pointer h-1.5"
            />
            <p className="text-[10px] text-slate-500">لحساب السعة التبريدية الإجمالية بالـ kW والطن تبريد</p>
          </div>

        </div>

        {/* Right Col: Mathematical Step-by-Step Breakdown & Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main COP Hero Card */}
          <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  النتيجة النهائية للمنظومة
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1.5">
                  معامل الأداء التبريدي (COPᵣ)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  النسبة بين تأثير التبريد المستفاد وشغل الضاغط المستهلك
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-3 bg-blue-50/60 rounded-xl border border-blue-200 min-w-[130px]">
                <span className="text-3xl font-extrabold text-blue-600 font-mono">
                  {cop}
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">
                  COPᵣ Dimensionless
                </span>
              </div>
            </div>

            {/* Performance status */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">تقييم الكفاءة الطاقية:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                cop >= 4 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : cop >= 3 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {cop >= 4 ? '🌟 أداء طاقي ممتاز جداً' : cop >= 3 ? '✅ أداء قياسي متوازن' : '⚠️ أداء مقبول يحتاج لتحسين'}
              </span>
            </div>
          </div>

          {/* 3 Step-by-Step Cards (Refrigeration Effect, Compressor Work, Condenser Heat) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Step 1: Refrigerating Effect (q_e) */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Snowflake className="w-3.5 h-3.5 text-blue-600" />
                  1. تأثير التبريد النوعي (qₑ)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Evaporator</span>
              </div>

              <div className="bg-slate-50 p-2 rounded-md border border-slate-200 font-mono text-xs text-blue-700 font-semibold" dir="ltr">
                q_e = h_1 - h_4
              </div>

              <div className="flex items-baseline justify-between pt-0.5">
                <span className="text-xs text-slate-500 font-mono">{h1} − {h4} =</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{qe} <span className="text-xs font-normal text-slate-400">kJ/kg</span></span>
              </div>
            </div>

            {/* Step 2: Compressor Work (w_c) */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-red-600" />
                  2. شغل الضاغط النوعي (wᶜ)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Compressor</span>
              </div>

              <div className="bg-slate-50 p-2 rounded-md border border-slate-200 font-mono text-xs text-red-700 font-semibold" dir="ltr">
                w_c = h_2 - h_1
              </div>

              <div className="flex items-baseline justify-between pt-0.5">
                <span className="text-xs text-slate-500 font-mono">{h2} − {h1} =</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{wc} <span className="text-xs font-normal text-slate-400">kJ/kg</span></span>
              </div>
            </div>

            {/* Step 3: Condenser Heat Rejection (q_c) */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  3. حرارة المكثف المطرودة (q_out)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Condenser</span>
              </div>

              <div className="bg-slate-50 p-2 rounded-md border border-slate-200 font-mono text-xs text-amber-700 font-semibold" dir="ltr">
                q_c = h_2 - h_3 = q_e + w_c
              </div>

              <div className="flex items-baseline justify-between pt-0.5">
                <span className="text-xs text-slate-500 font-mono">{h2} − {h3} =</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{qc} <span className="text-xs font-normal text-slate-400">kJ/kg</span></span>
              </div>
            </div>

            {/* Step 4: Full Capacity & Power Output */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                  4. السعات والقدرات الكلية
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ṁ = {massFlow} kg/s</span>
              </div>

              <div className="space-y-1 text-xs pt-0.5">
                <div className="flex justify-between text-slate-600">
                  <span>سعة التبريد (Q̇ₑ):</span>
                  <strong className="text-blue-700 font-mono">{Qe_kW} kW ({Qe_TR} TR)</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>قدرة الضاغط (Ẇᶜ):</span>
                  <strong className="text-red-700 font-mono">{Wc_kW} kW ({Wc_hp} hp)</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Energy Conservation Bar */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1 text-[11px] font-semibold">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                ميزان حفظ الطاقة في الدورة المغلقة:
              </span>
              <span className="font-mono text-slate-800 text-[11px] font-bold" dir="ltr">
                q_c ({qc}) = q_e ({qe}) + w_c ({wc})
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(qe / (qc || 1)) * 100}%` }}
                className="bg-blue-500 h-full transition-all duration-300"
                title={`تأثير التبريد: ${qe} kJ/kg`}
              />
              <div
                style={{ width: `${(wc / (qc || 1)) * 100}%` }}
                className="bg-red-500 h-full transition-all duration-300"
                title={`شغل الضاغط: ${wc} kJ/kg`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span className="text-blue-600 font-medium">حرارة المبخر الممتصة: {Math.round((qe / (qc || 1)) * 100)}%</span>
              <span className="text-red-600 font-medium">شغل الضاغط المضاف: {Math.round((wc / (qc || 1)) * 100)}%</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
