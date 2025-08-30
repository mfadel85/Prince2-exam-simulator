"use client";
import React from 'react';

interface StoredAttemptItem {
  id: string;
  q: string;
  selected: string | null;
  correct: string;
  explanation: string | null;
}
interface StoredAttempt {
  date: string;
  items: StoredAttemptItem[];
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

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {attempt.items.map((item, i) => (
            <div key={i} className="p-4 border rounded-lg bg-gray-50">
              <h2 className="font-medium text-gray-800 mb-2">Q{i + 1}. {item.q}</h2>
              <p className="text-sm"><span className="font-semibold text-red-600">Your answer:</span> {item.selected ?? 'No answer'}{item.selected && ` (${item.selected})`}</p>
              <p className="text-sm"><span className="font-semibold text-green-700">Correct:</span> {item.correct}</p>
              {item.explanation && <p className="mt-2 text-xs text-gray-600 leading-relaxed"><span className="font-semibold">Explanation:</span> {item.explanation}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
