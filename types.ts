
export interface BaZiPillar {
  stem: string;
  branch: string;
}

export interface BaZiResult {
  yearPillar: BaZiPillar;
  monthPillar: BaZiPillar;
  dayPillar: BaZiPillar;
  hourPillar: BaZiPillar;
  lunarDate: string;
  zodiac: string;
  solarTerm: string;
  fiveElements: string[];
  interpretation: string;
}

export interface DateTimeInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  yearBoundary: 'solar' | 'lunar';
}
