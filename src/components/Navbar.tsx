import React from 'react';
import { 
  Tv,
  BookOpen, 
  Cpu, 
  Calculator, 
  HelpCircle, 
  Award,
  Volume2,
  VolumeX,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAudioEnabled: boolean;
  setIsAudioEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAudioEnabled,
  setIsAudioEnabled,
}) => {
  const tabs = [
    { id: 'video', label: 'استوديو الفيديو الكامل', icon: Tv, badge: 'فيديو HD' },
    { id: 'script', label: 'السيناريو والحوار', icon: BookOpen, badge: '9 مشاهد' },
    { id: 'simulator', label: 'محاكي الدائرة ومخطط P-h', icon: Cpu, badge: 'تفاعلي' },
    { id: 'calculator', label: 'الحاسبة الحرارية و COP', icon: Calculator, badge: 'حسابات' },
    { id: 'quiz', label: 'أسئلة المراجعة والاختبار', icon: HelpCircle, badge: '8 أسئلة' },
    { id: 'summary', label: 'الملخص والباب الثاني', icon: Award, badge: 'خلاصة' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1e293b] text-white border-b border-slate-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-sm shrink-0">
              R
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight text-white flex items-center gap-2">
                الباب الأول: دائرة التبريد البسيطة
                <span className="text-[10px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded font-mono hidden md:inline-block">
                  V1.0
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider">
                VAPOR COMPRESSION REFRIGERATION CYCLE
              </p>
            </div>
          </div>

          {/* User Instructor Tag & Audio Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-left pl-3 border-l border-slate-700" dir="ltr">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                <GraduationCap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Dr. Abdullah</p>
                <p className="text-[10px] text-slate-400">Course Lecturer</p>
              </div>
            </div>

            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              title={isAudioEnabled ? 'تعطيل القارئ الصوتي للحوار' : 'تفعيل القارئ الصوتي للحوار'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                isAudioEnabled 
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/50' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isAudioEnabled ? 'الصوت: نشط' : 'الصوت: معطل'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center space-x-1 space-x-reverse overflow-x-auto no-scrollbar pt-1 border-t border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'text-blue-400 border-blue-400 font-bold bg-slate-800/60 rounded-t-lg'
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40 rounded-t-lg'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-300' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
