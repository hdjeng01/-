
import { GoogleGenAI, Type } from "@google/genai";
import { DateTimeInput, BaZiResult } from "../types";

export const getLunarAndBaZi = async (input: DateTimeInput): Promise<BaZiResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const boundaryInstruction = input.yearBoundary === 'solar' 
    ? '計算年柱時，必須嚴格「以立春」為年度分界點（即立春前屬舊年，立春後屬新年，這是命理八字的標準做法）。' 
    : '計算年柱時，請「以農曆正月初一」為年度分界點（即大年初一前屬舊年，初一後屬新年）。';

  const prompt = `請將以下公曆日期和時間轉換為中國傳統農曆和生辰八字：
  公曆時間：${input.year}年${input.month}月${input.day}日 ${input.hour}時${input.minute}分。
  
  ${boundaryInstruction}
  
  請返回結構化的 JSON 數據，包含以下字段：
  - yearPillar (stem, branch): 年柱
  - monthPillar (stem, branch): 月柱
  - dayPillar (stem, branch): 日柱
  - hourPillar (stem, branch): 時柱
  - lunarDate: 農曆日期字符串（如：二零二四年臘月初五）
  - zodiac: 生肖
  - solarTerm: 最近的節氣
  - fiveElements: 該八字對應的主要五行屬性列表
  - interpretation: 簡短的運勢或性格解讀（約100字）`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          yearPillar: {
            type: Type.OBJECT,
            properties: { stem: { type: Type.STRING }, branch: { type: Type.STRING } },
            required: ["stem", "branch"]
          },
          monthPillar: {
            type: Type.OBJECT,
            properties: { stem: { type: Type.STRING }, branch: { type: Type.STRING } },
            required: ["stem", "branch"]
          },
          dayPillar: {
            type: Type.OBJECT,
            properties: { stem: { type: Type.STRING }, branch: { type: Type.STRING } },
            required: ["stem", "branch"]
          },
          hourPillar: {
            type: Type.OBJECT,
            properties: { stem: { type: Type.STRING }, branch: { type: Type.STRING } },
            required: ["stem", "branch"]
          },
          lunarDate: { type: Type.STRING },
          zodiac: { type: Type.STRING },
          solarTerm: { type: Type.STRING },
          fiveElements: { type: Type.ARRAY, items: { type: Type.STRING } },
          interpretation: { type: Type.STRING }
        },
        required: ["yearPillar", "monthPillar", "dayPillar", "hourPillar", "lunarDate", "zodiac", "solarTerm", "fiveElements", "interpretation"]
      }
    }
  });

  return JSON.parse(response.text.trim()) as BaZiResult;
};
