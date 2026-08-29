import React from 'react';
import { 
  Award, 
  Sparkles, 
  ArrowLeft, 
  Activity, 
  Flame, 
  Filter, 
  Snowflake, 
  CheckCircle2, 
  Zap, 
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';
import { CYCLE_COMPONENTS, STATE_POINTS } from '../data/scriptData';

interface SummaryCardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ onNavigateToTab }) => {
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden text-right">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            الخلاصة الهندسية
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            ملخص الباب الأول: دائرة التبريد البسيطة
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
            المرجع السريع والشامل لدورة الانضغاط البخاري، القوانين الديناميكية الحرارية، والرباعية الذهبية مع د. عبدالله والطلاب.
          </p>
        </div>
      </div>

      {/* The 4 Golden Words & 4 Processes Grid */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="text-right space-y-0.5">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            المشهد الأخير – رباعية الدورة التبريدية
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            المكونات الأربعة والعمليات الأربع
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Compressor / Compression */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-red-300 transition-all space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-md bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <Activity className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <span className="text-[10px] text-red-700 font-bold block">محمد: Compression</span>
              <h4 className="text-sm font-bold text-slate-900">Compressor (الضاغط)</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              يسحب البخار المشبع من المبخر ويرفع ضغطه ودرجة حرارته لتمكينه من طرد الحرارة في المكثف.
            </p>
            <div className="pt-1.5 border-t border-slate-200 text-[11px] font-mono text-red-700 font-bold" dir="ltr">
              w_c = h_2 - h_1
            </div>
          </div>

          {/* 2. Condenser / Condensation */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 transition-all space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <Flame className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] text-amber-700 font-bold block">حسين: Condensation</span>
              <h4 className="text-sm font-bold text-slate-900">Condenser (المكثف)</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              يطرد حرارة وسيط التبريد إلى الوسط المحيط فيتكثف المائع ويتحول من بخار محمص إلى سائل مشبع.
            </p>
            <div className="pt-1.5 border-t border-slate-200 text-[11px] font-mono text-amber-700 font-bold" dir="ltr">
              q_c = h_2 - h_3
            </div>
          </div>

          {/* 3. Expansion Device / Expansion */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition-all space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <Filter className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] text-blue-700 font-bold block">بسنت: Expansion</span>
              <h4 className="text-sm font-bold text-slate-900">Expansion (جهاز التمدد)</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              يخفض الضغط ودرجة الحرارة بعملية خنق ثابتة الإنثالبي ليتحول إلى خليط رطب بارد.
            </p>
            <div className="pt-1.5 border-t border-slate-200 text-[11px] font-mono text-blue-700 font-bold" dir="ltr">
              h_3 = h_4 (Isenthalpic)
            </div>
          </div>

          {/* 4. Evaporator / Evaporation */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition-all space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                4
              </span>
              <Snowflake className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] text-blue-700 font-bold block">محمد: Evaporation</span>
              <h4 className="text-sm font-bold text-slate-900">Evaporator (المبخر)</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              يمتص الحرارة من الحيز المراد تبريده، فيتبخر وسيط التبريد معطياً التأثير التبريدي المفيد.
            </p>
            <div className="pt-1.5 border-t border-slate-200 text-[11px] font-mono text-blue-700 font-bold" dir="ltr">
              q_e = h_1 - h_4
            </div>
          </div>

        </div>
      </div>

      {/* Summary Formula & Concept Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Core Formulas Cheat-sheet */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <Zap className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">القوانين والمعادلات الحاكمة</h3>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-xs text-blue-700 block">تأثير التبريد النوعي (qₑ)</strong>
                <span className="text-[10px] text-slate-500">الحرارة الممتصة في المبخر لكل 1 kg</span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-blue-700 font-bold" dir="ltr">
                q_e = h_1 - h_4
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-xs text-red-700 block">شغل الضاغط النوعي (wᶜ)</strong>
                <span className="text-[10px] text-slate-500">الشغل الميكانيكي المستهلك لكل 1 kg</span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-red-700 font-bold" dir="ltr">
                w_c = h_2 - h_1
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-xs text-emerald-700 block">معامل الأداء التبريدي (COPᵣ)</strong>
                <span className="text-[10px] text-slate-500">النسبة بين المخرجات المفيدة والمدخلات</span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-emerald-700 font-bold" dir="ltr">
                COP_r = q_e / w_c
              </div>
            </div>
          </div>
        </div>

        {/* State Points Quick Reference */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">حالات المائع عند النقاط الأربع</h3>
          </div>

          <div className="space-y-1.5 text-xs">
            {STATE_POINTS.map((pt) => (
              <div
                key={pt.id}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {pt.id}
                  </span>
                  <div>
                    <strong className="text-slate-800 block text-xs">{pt.titleAr.split(':')[0]}</strong>
                    <span className="text-[10px] text-slate-500">{pt.phaseAr}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  pt.pressureLevel === 'high' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {pt.pressureLevel === 'high' ? 'High P' : 'Low P'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Chapter 2 Teaser Card */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-blue-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
              نظرة إلى الدرس القادم
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              الباب الثاني: طرق تحسين دائرة التبريد البسيطة
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              د. عبدالله: "في الحلقة القادمة سنسأل: هل يمكن أن نجعل دائرة التبريد البسيطة تعمل بكفاءة أعلى؟"
              سنناقش أثر التبريد الدوني (Subcooling)، التحميص الفعال (Superheating)، فاصل السائل (Flash Gas Removal)، والدوائر متعددة المراحل!
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('quiz')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>اختبر معلوماتك في الباب الأول الآن</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
