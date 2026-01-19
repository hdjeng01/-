
import React, { useState, useEffect } from 'react';
import { DateTimeInput, BaZiResult } from './types';
import { getLunarAndBaZi } from './services/geminiService';
import PillarCard from './components/PillarCard';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BaZiResult | null>(null);
  
  const [input, setInput] = useState<DateTimeInput>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    yearBoundary: 'solar',
  });

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLunarAndBaZi(input);
      setResult(data);
    } catch (err) {
      setError("計算失敗，請稍後再試。可能是輸入日期超出範圍或服務暫時不可用。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      setInput(prev => ({ ...prev, [name]: value }));
    } else {
      setInput(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    }
  };

  // Initial calculation
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf6e3] text-[#333] p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <div className="max-w-4xl w-full text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-red-900 mb-2">中國傳統萬年曆</h1>
        <p className="text-red-700 italic">陰陽合曆 · 生辰八字 · 命理乾坤</p>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="md:col-span-4 bg-white shadow-xl rounded-xl p-6 border-t-4 border-red-800">
          <h2 className="text-xl font-bold text-red-800 mb-4 border-b pb-2">輸入公曆時間</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">年份 (Year)</label>
              <input
                type="number"
                name="year"
                value={input.year}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-50 p-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">月份 (Month)</label>
                <input
                  type="number"
                  name="month"
                  min="1"
                  max="12"
                  value={input.month}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-50 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">日期 (Day)</label>
                <input
                  type="number"
                  name="day"
                  min="1"
                  max="31"
                  value={input.day}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-50 p-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">小時 (Hour)</label>
                <input
                  type="number"
                  name="hour"
                  min="0"
                  max="23"
                  value={input.hour}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-50 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">分鐘 (Minute)</label>
                <input
                  type="number"
                  name="minute"
                  min="0"
                  max="59"
                  value={input.minute}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-50 p-2"
                />
              </div>
            </div>

            {/* Year Boundary Choice */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-sm font-bold text-red-800 mb-2">年柱分界點準則</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="yearBoundary"
                    value="solar"
                    checked={input.yearBoundary === 'solar'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">以立春為界</span> (傳統八字命理)
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="yearBoundary"
                    value="lunar"
                    checked={input.yearBoundary === 'lunar'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">以正月初一為界</span> (民俗農曆)
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all shadow-lg ${
                loading ? 'bg-gray-400' : 'bg-red-800 hover:bg-red-700 active:scale-95'
              }`}
            >
              {loading ? '計算中...' : '排定八字'}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="md:col-span-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          {result ? (
            <div className="bg-white shadow-xl rounded-xl p-8 border-8 double border-red-100 flex flex-col gap-8 relative overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-800 opacity-5 transform rotate-45 translate-x-12 -translate-y-12"></div>
              
              {/* Lunar Summary */}
              <div className="text-center">
                <p className="text-sm text-gray-500 tracking-widest mb-1">公曆 {input.year}年{input.month}月{input.day}日 {input.hour}:{input.minute}</p>
                <p className="text-3xl font-bold text-red-900">{result.lunarDate}</p>
                <div className="flex justify-center gap-4 mt-2 text-red-700 font-medium">
                  <span>生肖：{result.zodiac}</span>
                  <span>節氣：{result.solarTerm}</span>
                </div>
              </div>

              {/* BaZi Pillars */}
              <div className="flex justify-center gap-3 md:gap-6">
                <PillarCard label="年柱" pillar={result.yearPillar} />
                <PillarCard label="月柱" pillar={result.monthPillar} />
                <PillarCard label="日柱" pillar={result.dayPillar} />
                <PillarCard label="時柱" pillar={result.hourPillar} />
              </div>

              {/* Five Elements & Interpretation */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-red-800 border-l-4 border-red-800 pl-2 mb-3">五行分析</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.fiveElements.map((el, idx) => (
                      <span key={idx} className="px-3 py-1 bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-full text-sm font-bold">
                        {el}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-red-800 border-l-4 border-red-800 pl-2 mb-3">命理簡評</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 leading-relaxed italic">
                    "{result.interpretation}"
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="text-[10px] text-gray-400">※ 此結果基於傳統算法結合 AI 生成，分界點採用：{input.yearBoundary === 'solar' ? '立春' : '農曆正月初一'}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-white shadow-xl rounded-xl p-8 border-2 border-dashed border-gray-200 text-gray-400">
              請在左側輸入日期並點擊「排定八字」
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Design Element */}
      <footer className="mt-12 text-red-900 opacity-30 text-xs">
        © 傳統文化數字化工程 · 乾坤萬年曆
      </footer>
    </div>
  );
};

export default App;
