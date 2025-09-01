"use client";
import React from 'react';
import { useReviewHistory } from '@/hooks/useReviewHistory';

class ReviewErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean; message?: string}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(err: any) { return { hasError: true, message: err?.message || 'Unexpected error' }; }
  componentDidCatch(err: any, info: any) { console.error('Review page runtime error', err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 p-6">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-3 text-red-700">Review Page Error</h1>
            <p className="text-sm text-gray-700 mb-4 break-all">{this.state.message}</p>
            <p className="text-sm text-gray-600 mb-4">Local saved history may be older or corrupted. You can export then clear.</p>
            <a href="/" className="inline-block px-4 py-2 rounded bg-blue-600 text-white text-sm">Back to Simulator</a>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

// Detail view only; charts moved to /analytics

export default function ReviewPage() {
  const { attempts, clearAll, exportJson } = useReviewHistory();
  const [activeAttempt, setActiveAttempt] = React.useState(0);
  // Pick attempt from query param if present
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const idxStr = params.get('attempt');
    if (idxStr && attempts.length) {
      const idx = parseInt(idxStr, 10);
      if (!isNaN(idx) && idx >= 0 && idx < attempts.length) setActiveAttempt(idx);
    }
  }, [attempts.length]);

  // attempts loaded via hook

  const attempt = React.useMemo(() => {
    if (!attempts.length) return undefined;
    if (activeAttempt < 0 || activeAttempt >= attempts.length) return attempts[0];
    return attempts[activeAttempt];
  }, [attempts, activeAttempt]);

  // Pie chart removed from detail page (moved to /analytics)

  return (
    <ReviewErrorBoundary>
      {attempts.length === 0 ? (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Review Incorrect Answers</h1>
            <p className="text-gray-800 mb-6">No saved incorrect answers yet. Finish an exam and click "Save for Later Review" on the results page.</p>
            <a href="/" className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Back to Simulator</a>
          </div>
        </main>
      ) : (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6">
              <h1 className="text-2xl font-bold">Saved Incorrect Answers</h1>
              <div className="flex gap-2 flex-wrap">
                <button onClick={()=>exportJson()} className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50">Export JSON</button>
                <button onClick={clearAll} className="px-3 py-1 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50">Clear All</button>
                <a href="/" className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">Back</a>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-900">Attempts:</span>
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

            <div className="mb-4 text-xs text-gray-700 flex gap-4 items-center flex-wrap">
              {attempt?.categoryStats && <a className="underline text-blue-600" href="/analytics">View Charts & Trends</a>}
              <span className="hidden sm:inline">Detailed answers below</span>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {attempt?.items.map((item, i) => {
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
                        <summary className="cursor-pointer text-gray-800">Show all options</summary>
                        <ul className="mt-1 space-y-0.5">
                          {item.options.map((opt, idx) => (
                            <li key={idx} className="text-gray-800"><span className="font-semibold">{String.fromCharCode(65+idx)}.</span> {opt}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                    {item.explanation && <p className="mt-2 text-xs text-gray-700 leading-relaxed"><span className="font-semibold">Explanation:</span> {item.explanation}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}
    </ReviewErrorBoundary>
  );
}
