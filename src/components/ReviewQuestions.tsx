import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Search,
  Check,
  ArrowLeft,
  ArrowRight,
  Filter
} from 'lucide-react';
import { REVIEW_QUESTIONS } from '../data/quizData';

export const ReviewQuestions: React.FC = () => {
  const [viewMode, setViewMode] = useState<'study' | 'quiz'>('study');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCardId, setExpandedCardId] = useState<number | null>(1);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Categories
  const categories = ['all', ...Array.from(new Set(REVIEW_QUESTIONS.map((q) => q.category)))];

  // Filtered Questions
  const filteredQuestions = REVIEW_QUESTIONS.filter((q) => {
    const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
    const matchSearch = searchQuery.trim() === '' || 
      q.question.includes(searchQuery) || 
      q.shortAnswer.includes(searchQuery) || 
      q.detailedAnswer.includes(searchQuery);
    return matchCat && matchSearch;
  });

  // Quiz handler
  const handleSelectQuizOption = (questionId: number, optionIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // already answered

    const newAnswers = { ...selectedAnswers, [questionId]: optionIndex };
    setSelectedAnswers(newAnswers);

    // If this was the last question, trigger finish
    if (Object.keys(newAnswers).length === REVIEW_QUESTIONS.length) {
      setIsQuizFinished(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Calculate score
  const score = Object.entries(selectedAnswers).reduce((acc, [qId, optIdx]) => {
    const q = REVIEW_QUESTIONS.find((item) => item.id === Number(qId));
    const optionIndex = Number(optIdx);
    if (q && q.quizOptions && q.quizOptions[optionIndex]?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const resetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuizIndex(0);
    setIsQuizFinished(false);
  };

  const currentQuizQ = REVIEW_QUESTIONS[currentQuizIndex];

  return (
    <div className="space-y-4">
      
      {/* Header & Mode Selector */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                أسئلة المراجعة والتقييم
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                أسئلة مراجعة الباب الأول (دائرة التبريد البسيطة)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              الأسئلة الثمانية الشاملة للمقرر مع نموذج الإجابة التفصيلي والاختبار التفاعلي
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-center">
            <button
              onClick={() => setViewMode('study')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                viewMode === 'study'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>بطاقات المذاكرة والحل النموذجي</span>
            </button>
            <button
              onClick={() => setViewMode('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                viewMode === 'quiz'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>الاختبار التفاعلي الذاتي</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: STUDY FLASHCARDS */}
      {viewMode === 'study' && (
        <div className="space-y-3.5">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الأسئلة والإجابات..."
                className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg pr-8 pl-3 py-1.5 border border-slate-200 focus:border-blue-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition border ${
                    selectedCategory === cat
                      ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'all' ? 'جميع الأقسام' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedCardId === q.id;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border transition-all duration-150 overflow-hidden shadow-xs ${
                    isExpanded
                      ? 'bg-white border-blue-300 ring-1 ring-blue-100'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header (Always Visible) */}
                  <div
                    onClick={() => setExpandedCardId(isExpanded ? null : q.id)}
                    className="p-3.5 sm:p-4 cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {q.id}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 inline-block mb-1">
                          {q.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h3>
                        {!isExpanded && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {q.shortAnswer}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 shrink-0"
                      title={isExpanded ? 'طي الإجابة' : 'عرض الإجابة النموذجية'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Content (Model Answer) */}
                  {isExpanded && (
                    <div className="px-3.5 pb-4 sm:px-4 space-y-3 border-t border-slate-100 pt-3 bg-slate-50/50">
                      
                      {/* Short Answer Callout */}
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <strong className="text-xs font-bold text-blue-800 block mb-0.5">
                          الإجابة المختصرة المركزة:
                        </strong>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                          {q.shortAnswer}
                        </p>
                      </div>

                      {/* Detailed Answer */}
                      <div className="space-y-1.5">
                        <strong className="text-xs font-bold text-slate-700 block">
                          الشرح الهندسي والفيزيائي المفصل:
                        </strong>
                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200">
                          {q.detailedAnswer}
                        </div>
                      </div>

                      {/* Formula Callout if any */}
                      {q.formula && (
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                          <span className="text-xs text-slate-600 font-medium">المعادلة الرياضية المقترنة:</span>
                          <div className="font-mono text-xs sm:text-sm text-blue-700 font-bold" dir="ltr">
                            {q.formula}
                          </div>
                        </div>
                      )}

                      {/* Key Takeaways */}
                      <div className="space-y-1.5">
                        <strong className="text-xs font-bold text-slate-700 block">نقاط الحفظ والاستذكار:</strong>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.keyPoints.map((pt, ptIdx) => (
                            <div
                              key={ptIdx}
                              className="flex items-start gap-1.5 p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
                            >
                              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* MODE 2: INTERACTIVE QUIZ */}
      {viewMode === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Quiz Top Progress & Score */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600">
                  السؤال {currentQuizIndex + 1} من {REVIEW_QUESTIONS.length}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">{currentQuizQ.category}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">اختبار استيعاب الباب الأول</h3>
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">الدرجة الحالية</span>
                <strong className="text-base font-mono text-blue-700">{score} / {REVIEW_QUESTIONS.length}</strong>
              </div>
              <button
                onClick={resetQuiz}
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
                title="إعادة الاختبار"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                السؤال {currentQuizQ.id}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQuizQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-2">
              {currentQuizQ.quizOptions?.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuizQ.id] === optIdx;
                const isAnswered = selectedAnswers[currentQuizQ.id] !== undefined;
                const isCorrect = option.isCorrect;

                let btnStyles = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/40';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-300';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-red-50 border-red-400 text-red-900 ring-1 ring-red-300';
                  } else {
                    btnStyles = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isAnswered}
                    onClick={() => handleSelectQuizOption(currentQuizQ.id, optIdx)}
                    className={`w-full text-right p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${btnStyles}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 text-slate-700">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{option.text}</span>
                    </div>

                    {isAnswered && (
                      <div className="shrink-0 mt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isSelected ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answering */}
            {selectedAnswers[currentQuizQ.id] !== undefined && (
              <div className={`p-3 rounded-lg border text-xs sm:text-sm leading-relaxed ${
                currentQuizQ.quizOptions?.[selectedAnswers[currentQuizQ.id]]?.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}>
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {currentQuizQ.quizOptions?.[selectedAnswers[currentQuizQ.id]]?.isCorrect
                      ? 'إجابة صحيحة! أحسنت 👏'
                      : 'إجابة غير دقيقة! التوضيح العلمي:'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">
                  {currentQuizQ.quizOptions?.[selectedAnswers[currentQuizQ.id]]?.explanation}
                </p>
              </div>
            )}

            {/* Quiz Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                disabled={currentQuizIndex === 0}
                onClick={() => setCurrentQuizIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>السؤال السابق</span>
              </button>

              <div className="flex items-center gap-1">
                {REVIEW_QUESTIONS.map((q, idx) => {
                  const ans = selectedAnswers[q.id];
                  let dotColor = 'bg-slate-200';
                  if (ans !== undefined) {
                    dotColor = q.quizOptions?.[ans]?.isCorrect ? 'bg-emerald-500' : 'bg-red-500';
                  } else if (idx === currentQuizIndex) {
                    dotColor = 'bg-blue-600 ring-2 ring-blue-200';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuizIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${dotColor}`}
                      title={`السؤال ${idx + 1}`}
                    />
                  );
                })}
              </div>

              <button
                disabled={currentQuizIndex === REVIEW_QUESTIONS.length - 1}
                onClick={() => setCurrentQuizIndex((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <span>السؤال التالي</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Quiz Completion Banner if all answered */}
          {isQuizFinished && (
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 text-center space-y-2 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                تهانينا! أكملت مراجعة الباب الأول بنجاح 🎉
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                حصلت على <strong className="text-emerald-700 font-mono text-sm">{score}</strong> من إجمالي <strong className="text-slate-900 font-mono text-sm">{REVIEW_QUESTIONS.length}</strong> أسئلة!
              </p>
              <div className="pt-1">
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
                >
                  إعادة الاختبار لقياس التقدم
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
