import React, { useState } from 'react';
import { 
  Info, 
  Maximize2, 
  Activity, 
  Flame, 
  Filter, 
  Snowflake,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';
import { StatePoint } from '../types';

interface PhDiagramProps {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  pLow?: number;
  pHigh?: number;
  selectedStatePoint: 1 | 2 | 3 | 4 | null;
  onSelectStatePoint: (id: 1 | 2 | 3 | 4) => void;
}

export const PhDiagram: React.FC<PhDiagramProps> = ({
  h1,
  h2,
  h3,
  h4,
  pLow = 2.0,
  pHigh = 12.0,
  selectedStatePoint,
  onSelectStatePoint,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // SVG Coordinates mapping
  // SVG Width: 600, Height: 400
  // Margin: Left 60, Right 40, Top 40, Bottom 60
  // Chart Area: X from 70 to 550 (h: 50 to 500), Y from 340 to 60 (P: log scale or linear 1 to 16 bar)
  
  const minH = 50;
  const maxH = 520;
  const minP = 1.0;
  const maxP = 20.0;

  const mapX = (h: number) => {
    const clampedH = Math.max(minH, Math.min(maxH, h));
    return 70 + ((clampedH - minH) / (maxH - minH)) * 480;
  };

  const mapY = (p: number) => {
    // Semi-log or smooth linear scale
    const norm = Math.log10(p / minP) / Math.log10(maxP / minP);
    return 340 - Math.max(0, Math.min(1, norm)) * 280;
  };

  const yHigh = mapY(pHigh);
  const yLow = mapY(pLow);

  const x1 = mapX(h1);
  const x2 = mapX(h2);
  const x3 = mapX(h3);
  const x4 = mapX(h4);

  // Saturation Dome Path Points (Approximate physical curve for typical refrigerant)
  const domePoints = [
    { h: 60, p: 1.0 },
    { h: 80, p: 2.0 },
    { h: 100, p: 3.5 },
    { h: 130, p: 6.0 },
    { h: 170, p: 10.0 },
    { h: 220, p: 15.0 },
    { h: 270, p: 18.0 }, // Critical Point near peak
    { h: 320, p: 15.0 },
    { h: 360, p: 10.0 },
    { h: 390, p: 6.0 },
    { h: 410, p: 3.5 },
    { h: 425, p: 2.0 },
    { h: 440, p: 1.0 },
  ];

  const domeSvgPath = domePoints.reduce((acc, pt, i) => {
    const x = mapX(pt.h);
    const y = mapY(pt.p);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              الديناميكا الحرارية
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">مخطط الضغط والإنثالبي (P-h Diagram)</h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            رسم بياني يوضح قبة التشبع والعمليات الأربع لدورة الانضغاط البخاري البسيطة
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-blue-600 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            خطوط ثبوت الضغط
          </span>
          <span className="flex items-center gap-1 text-emerald-600 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            قبة التشبع
          </span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden select-none">
        
        <svg viewBox="0 0 600 380" className="w-full h-full">
          <defs>
            {/* Gradient for cycle fill */}
            <linearGradient id="cycleFillGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
            </linearGradient>

            {/* Gradient for high pressure line */}
            <linearGradient id="highPGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>

            {/* Gradient for low pressure line */}
            <linearGradient id="lowPGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="70" y1="340" x2="560" y2="340" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="70" y1="60" x2="70" y2="340" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* P-h Axes labels */}
          <text x="560" y="365" fill="#475569" fontSize="11" textAnchor="end" fontWeight="bold">
            الإنثالبي النوعي h (kJ/kg) →
          </text>
          <text x="25" y="65" fill="#475569" fontSize="11" textAnchor="start" fontWeight="bold">
            ↑ الضغط P (bar)
          </text>

          {/* Grid sub-lines */}
          {[100, 200, 300, 400, 500].map((val) => (
            <g key={`x-grid-${val}`}>
              <line x1={mapX(val)} y1="60" x2={mapX(val)} y2="340" stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={mapX(val)} y="355" fill="#94a3b8" fontSize="9" textAnchor="middle">
                {val}
              </text>
            </g>
          ))}

          {/* Saturation Dome (قبة التشبع) */}
          <path
            d={domeSvgPath}
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-90"
          />

          {/* Region labels */}
          <text x={mapX(110)} y="260" fill="#047857" fontSize="9" fontWeight="bold" opacity="0.8">
            سائل مضغوط (Subcooled)
          </text>
          <text x={mapX(240)} y="260" fill="#0f766e" fontSize="10" fontWeight="bold" textAnchor="middle" opacity="0.8">
            منطقة الخليط الرطب (سائل + بخار)
          </text>
          <text x={mapX(430)} y="260" fill="#b91c1c" fontSize="9" fontWeight="bold" opacity="0.8">
            بخار محمص (Superheated)
          </text>
          <text x={mapX(270)} y={mapY(18.5) - 8} fill="#047857" fontSize="9" textAnchor="middle" fontWeight="bold">
            النقطة الحرجة (Critical Point)
          </text>

          {/* Saturated Lines text */}
          <text x={mapX(120)} y={mapY(5.5) + 15} fill="#059669" fontSize="8" fontWeight="bold">
            x = 0 (سائل مشبع)
          </text>
          <text x={mapX(380)} y={mapY(5.5) + 15} fill="#059669" fontSize="8" fontWeight="bold">
            x = 1 (بخار مشبع)
          </text>

          {/* Isobaric High Pressure Line (Condenser pressure) */}
          <line
            x1="70"
            y1={yHigh}
            x2="550"
            y2={yHigh}
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text x="65" y={yHigh + 3} fill="#dc2626" fontSize="9" textAnchor="end" fontWeight="bold">
            P_high ({pHigh} bar)
          </text>

          {/* Isobaric Low Pressure Line (Evaporator pressure) */}
          <line
            x1="70"
            y1={yLow}
            x2="550"
            y2={yLow}
            stroke="#0284c7"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text x="65" y={yLow + 3} fill="#0284c7" fontSize="9" textAnchor="end" fontWeight="bold">
            P_low ({pLow} bar)
          </text>

          {/* Cycle polygon fill */}
          <polygon
            points={`${x1},${yLow} ${x2},${yHigh} ${x3},${yHigh} ${x4},${yLow}`}
            fill="url(#cycleFillGrad)"
            className="transition-all duration-300"
          />

          {/* Process 1 -> 2: Isentropic Compression */}
          <line
            x1={x1}
            y1={yLow}
            x2={x2}
            y2={yHigh}
            stroke="#dc2626"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Arrow on 1-2 */}
          <polygon
            points={`${(x1 + x2) / 2},${(yLow + yHigh) / 2 - 4} ${(x1 + x2) / 2 + 5},${(yLow + yHigh) / 2 + 3} ${(x1 + x2) / 2 - 5},${(yLow + yHigh) / 2 + 3}`}
            fill="#dc2626"
            transform={`rotate(${Math.atan2(yHigh - yLow, x2 - x1) * 180 / Math.PI + 90}, ${(x1 + x2) / 2}, ${(yLow + yHigh) / 2})`}
          />

          {/* Process 2 -> 3: Isobaric Heat Rejection (Condenser) */}
          <line
            x1={x2}
            y1={yHigh}
            x2={x3}
            y2={yHigh}
            stroke="#ea580c"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Arrow on 2-3 */}
          <polygon
            points={`${(x2 + x3) / 2 - 4},${yHigh - 4} ${(x2 + x3) / 2 - 4},${yHigh + 4} ${(x2 + x3) / 2 - 10},${yHigh}`}
            fill="#ea580c"
          />

          {/* Process 3 -> 4: Isenthalpic Throttling (Expansion Device) - Vertical Line */}
          <line
            x1={x3}
            y1={yHigh}
            x2={x4}
            y2={yLow}
            stroke="#0891b2"
            strokeWidth="3"
            strokeDasharray="5 3"
            strokeLinecap="round"
          />
          {/* Arrow on 3-4 */}
          <polygon
            points={`${x3 - 4},${(yHigh + yLow) / 2} ${x3 + 4},${(yHigh + yLow) / 2} ${x3},${(yHigh + yLow) / 2 + 7}`}
            fill="#0891b2"
          />

          {/* Process 4 -> 1: Isobaric Heat Absorption (Evaporator) */}
          <line
            x1={x4}
            y1={yLow}
            x2={x1}
            y2={yLow}
            stroke="#0284c7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Arrow on 4-1 */}
          <polygon
            points={`${(x4 + x1) / 2 + 4},${yLow - 4} ${(x4 + x1) / 2 + 4},${yLow + 4} ${(x4 + x1) / 2 + 10},${yLow}`}
            fill="#0284c7"
          />

          {/* State Point 1 */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectStatePoint(1)}
            onMouseEnter={() => setHoveredPoint(1)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <circle
              cx={x1}
              y={yLow}
              r={selectedStatePoint === 1 || hoveredPoint === 1 ? '9' : '6'}
              fill="#0284c7"
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-200 shadow-md"
            />
            <text x={x1 + 12} y={yLow + 4} fill="#0369a1" fontSize="11" fontWeight="bold">
              1 (h₁={h1})
            </text>
          </g>

          {/* State Point 2 */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectStatePoint(2)}
            onMouseEnter={() => setHoveredPoint(2)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <circle
              cx={x2}
              y={yHigh}
              r={selectedStatePoint === 2 || hoveredPoint === 2 ? '9' : '6'}
              fill="#dc2626"
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-200 shadow-md"
            />
            <text x={x2 + 10} y={yHigh - 8} fill="#b91c1c" fontSize="11" fontWeight="bold">
              2 (h₂={h2})
            </text>
          </g>

          {/* State Point 3 */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectStatePoint(3)}
            onMouseEnter={() => setHoveredPoint(3)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <circle
              cx={x3}
              y={yHigh}
              r={selectedStatePoint === 3 || hoveredPoint === 3 ? '9' : '6'}
              fill="#ea580c"
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-200 shadow-md"
            />
            <text x={x3 - 60} y={yHigh - 8} fill="#c2410c" fontSize="11" fontWeight="bold">
              3 (h₃={h3})
            </text>
          </g>

          {/* State Point 4 */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectStatePoint(4)}
            onMouseEnter={() => setHoveredPoint(4)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <circle
              cx={x4}
              y={yLow}
              r={selectedStatePoint === 4 || hoveredPoint === 4 ? '9' : '6'}
              fill="#0891b2"
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-200 shadow-md"
            />
            <text x={x4 - 60} y={yLow + 15} fill="#0e7490" fontSize="11" fontWeight="bold">
              4 (h₄={h4})
            </text>
          </g>

          {/* Process Labels Callouts */}
          <text x={(x1 + x2) / 2 + 15} y={(yLow + yHigh) / 2} fill="#dc2626" fontSize="10" fontWeight="bold">
            wᶜ = h₂ − h₁
          </text>
          <text x={(x2 + x3) / 2} y={yHigh - 12} fill="#ea580c" fontSize="10" textAnchor="middle" fontWeight="bold">
            طرد حرارة q_c = h₂ − h₃
          </text>
          <text x={x3 - 10} y={(yHigh + yLow) / 2} fill="#0891b2" fontSize="10" textAnchor="end" fontWeight="bold">
            خنق h₃ = h₄
          </text>
          <text x={(x4 + x1) / 2} y={yLow + 20} fill="#0284c7" fontSize="10" textAnchor="middle" fontWeight="bold">
            تأثير التبريد qₑ = h₁ − h₄
          </text>

        </svg>

      </div>

      {/* Process legend cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <button
          onClick={() => onSelectStatePoint(1)}
          className={`p-2 rounded-lg border text-right transition ${
            selectedStatePoint === 1 ? 'bg-red-50 border-red-300 text-red-800 font-semibold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <strong className="block text-red-600 text-xs">1 → 2: انضغاط</strong>
          <span className="text-[10px] text-slate-500">رفع الضغط والحرارة (wᶜ)</span>
        </button>

        <button
          onClick={() => onSelectStatePoint(2)}
          className={`p-2 rounded-lg border text-right transition ${
            selectedStatePoint === 2 ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <strong className="block text-amber-600 text-xs">2 → 3: تكثيف</strong>
          <span className="text-[10px] text-slate-500">طرد الحرارة للجو (q_out)</span>
        </button>

        <button
          onClick={() => onSelectStatePoint(3)}
          className={`p-2 rounded-lg border text-right transition ${
            selectedStatePoint === 3 ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-semibold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <strong className="block text-cyan-600 text-xs">3 → 4: تمدد خنق</strong>
          <span className="text-[10px] text-slate-500">خفض الضغط (h₃ = h₄)</span>
        </button>

        <button
          onClick={() => onSelectStatePoint(4)}
          className={`p-2 rounded-lg border text-right transition ${
            selectedStatePoint === 4 ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <strong className="block text-blue-600 text-xs">4 → 1: تبخير</strong>
          <span className="text-[10px] text-slate-500">امتصاص الحرارة (qₑ)</span>
        </button>
      </div>

    </div>
  );
};
