"use client";
import React from 'react';

interface StoredAttemptItem {
  id: string;
  q: string;
  selected: string | null; // letter
  correct: string; // letter
  explanation: string | null;
  options?: string[];
  selectedText?: string | null;
  correctText?: string | null;
  category?: string | null;
  isCorrect?: boolean;
}
interface StoredAttempt {
  date: string;
  items: StoredAttemptItem[];
  categoryStats?: Record<string, { correct: number; incorrect: number; total: number }>;
}
const STORAGE_KEY = 'prince2_incorrect_history_v1';

export default function ReviewPage() {
  const [attempts, setAttempts] = React.useState<StoredAttempt[]>([]);
  const [activeAttempt, setActiveAttempt] = React.useState<number>(0);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredAttempt[] = JSON.parse(raw);
        setAttempts(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const clearAll = () => {
    if (!confirm('Delete all saved incorrect answer history?')) return;
    localStorage.removeItem(STORAGE_KEY);
    setAttempts([]);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(attempts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'incorrect-review-history.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (attempts.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Review Incorrect Answers</h1>
          <p className="text-gray-600 mb-6">No saved incorrect answers yet. Finish an exam and click "Save for Later Review" on the results page.</p>
          <a href="/" className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Back to Simulator</a>
        </div>
      </main>
    );
  }

  const attempt = attempts[activeAttempt];

  // Build pie chart data if stats present
  const pieData = React.useMemo(() => {
    if (!attempt.categoryStats) return [] as { label: string; value: number; color: string }[];
    const palette = ['#2563eb','#16a34a','#dc2626','#7c3aed','#ea580c','#0891b2','#d97706','#db2777','#059669','#4f46e5'];
    const cats = Object.entries(attempt.categoryStats).sort((a,b)=>a[0].localeCompare(b[0]));
    const total = cats.reduce((sum, [,s]) => sum + s.total, 0) || 1;
    return cats.map(([name, s], idx) => {
      const ratio = s.total / total;
      const color = palette[idx % palette.length];
      return { label: name, value: ratio, color };
    });
  }, [attempt]);

  const pieSvg = (() => {
    if (pieData.length === 0) return null;
    let cumulative = 0;
    const radius = 60;
    const cx = radius;
    const cy = radius;
    const slices = pieData.map((d, i) => {
      const startAngle = cumulative * 2 * Math.PI;
      cumulative += d.value;
      const endAngle = cumulative * 2 * Math.PI;
      const x1 = cx + radius * Math.sin(startAngle);
      const y1 = cy - radius * Math.cos(startAngle);
      const x2 = cx + radius * Math.sin(endAngle);
      const y2 = cy - radius * Math.cos(endAngle);
      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      return <path key={i} d={pathData} fill={d.color} aria-label={`${d.label}: ${(d.value*100).toFixed(1)}%`} />;
    });
    return (
      <svg width={radius*2} height={radius*2} role="img" aria-label="Category distribution pie chart">
        {slices}
      </svg>
    );
  })();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6">
          <h1 className="text-2xl font-bold">Saved Incorrect Answers</h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={exportJson} className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50">Export JSON</button>
            <button onClick={clearAll} className="px-3 py-1 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50">Clear All</button>
            <a href="/" className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">Back</a>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-600">Attempts:</span>
          {attempts.map((a, idx) => (
            <button
              key={idx}
              onClick={() => setActiveAttempt(idx)}
              className={`px-3 py-1 text-xs rounded border ${idx === activeAttempt ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              {new Date(a.date).toLocaleString()} ({a.items.length})
            </button>
          ))}
        </div>

        {/* Category Performance Chart */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-3">Category Performance {attempt.categoryStats && pieSvg && (<span className="inline-block">{pieSvg}</span>)}</h2>
          {attempt.categoryStats ? (
            <div className="space-y-3">
              {Object.entries(attempt.categoryStats).sort((a,b)=>a[0].localeCompare(b[0])).map(([cat, stats]) => {
                const pct = stats.total ? (stats.correct / stats.total) * 100 : 0;
                return (
                  <div key={cat} className="text-xs">
                    <div className="flex justify-between mb-1"><span className="font-medium text-gray-700">{cat}</span><span className="text-gray-500">{stats.correct}/{stats.total} ({pct.toFixed(1)}%)</span></div>
                    <div className="h-3 w-full rounded bg-gray-200 overflow-hidden">
                      <div className="h-full bg-green-500" style={{width: pct + '%'}}></div>
                    </div>
                  </div>
                );
              })}
              {/* Legend */}
              {pieData.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {pieData.map(d => (
                    <span key={d.label} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-gray-200">
                      <span className="w-3 h-3 rounded-sm inline-block" style={{background:d.color}}></span>
                      {d.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Category stats not available for this older attempt.</p>
          )}
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {attempt.items.map((item, i) => {
            const selectedText = item.selectedText || (item.selected && item.options ? item.options[item.selected.charCodeAt(0)-65] : null);
            const correctText = item.correctText || (item.options ? item.options[item.correct.charCodeAt(0)-65] : null);
            return (
              <div key={i} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="font-medium text-gray-800">Q{i + 1}. {item.q}</h2>
                  {item.category && <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.category}</span>}
                </div>
                <p className="text-sm"><span className="font-semibold text-red-600">Your answer:</span> {item.selected ? `${item.selected} – ${selectedText}` : 'No answer'}</p>
                <p className="text-sm font-semibold text-black">Correct: {item.correct} – {correctText}</p>
                {item.options && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer text-gray-600">Show all options</summary>
                    <ul className="mt-1 space-y-0.5">
                      {item.options.map((opt, idx) => (
                        <li key={idx} className="text-gray-600"><span className="font-semibold">{String.fromCharCode(65+idx)}.</span> {opt}</li>
                      ))}
                    </ul>
                  </details>
                )}
                {item.explanation && <p className="mt-2 text-xs text-gray-600 leading-relaxed"><span className="font-semibold">Explanation:</span> {item.explanation}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
