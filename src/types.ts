export interface Character {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  badgeBg: string;
  borderColor: string;
  avatarText: string;
  iconName: string;
}

export interface DialogueLine {
  id: number;
  characterId: string;
  text: string;
  keyConcepts?: string[];
  formula?: string;
  note?: string;
  relatedComponentId?: 'compressor' | 'condenser' | 'expansion' | 'evaporator' | 'all';
}

export interface Scene {
  id: number;
  title: string;
  subtitle?: string;
  location: string;
  description: string;
  dialogues: DialogueLine[];
  relatedComponentId?: 'compressor' | 'condenser' | 'expansion' | 'evaporator' | 'all';
}

export interface StatePoint {
  id: 1 | 2 | 3 | 4;
  titleAr: string;
  titleEn: string;
  locationAr: string;
  phaseAr: string;
  phaseEn: string;
  pressureLevel: 'low' | 'high';
  tempLevel: 'low' | 'high';
  enthalpyKey: 'h1' | 'h2' | 'h3' | 'h4';
  defaultEnthalpy: number; // kJ/kg
  color: string;
  description: string;
}

export interface CycleComponent {
  id: 'compressor' | 'condenser' | 'expansion' | 'evaporator';
  nameAr: string;
  nameEn: string;
  processAr: string;
  processEn: string;
  entryState: 1 | 2 | 3 | 4;
  exitState: 1 | 2 | 3 | 4;
  energyType: 'work_in' | 'heat_out' | 'expansion' | 'heat_in';
  formulaAr: string;
  formulaMath: string;
  description: string;
  color: string;
  accentBg: string;
  borderColor: string;
  icon: string;
}

export interface ReviewQuestion {
  id: number;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  keyPoints: string[];
  category: string;
  formula?: string;
  quizOptions?: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface RefrigerantPreset {
  id: string;
  name: string;
  description: string;
  defaultH1: number;
  defaultH2: number;
  defaultH3: number;
  defaultH4: number;
  pLow: number; // bar
  pHigh: number; // bar
  tEvap: number; // °C
  tCond: number; // °C
}
