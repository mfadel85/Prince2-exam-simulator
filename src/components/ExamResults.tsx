import React from 'react';
import { Question } from '@/data/questions';

interface AnswerReviewItem {
  index: number;
  question: Question;
  selectedAnswer?: string;
}

interface ExamResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  review: AnswerReviewItem[];
}

export default function ExamResults({ score, totalQuestions, onRestart, review }: ExamResultsProps) {
  const percentage = score;
  const correctAnswers = Math.round((percentage / 100) * totalQuestions);
  const isPassing = percentage >= 55; // PRINCE2 Foundation passing score

  const incorrect = review.filter(r => r.selectedAnswer !== r.question.correctAnswer);

  // Local persistence key
  const STORAGE_KEY = 'prince2_incorrect_history_v1';

  const saveIncorrectForReview = () => {
    if (incorrect.length === 0) return;
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const attempt = {
        date: new Date().toISOString(),
        items: incorrect.map(i => ({
          id: i.question.id,
            q: i.question.question,
            selected: i.selectedAnswer ?? null,
            correct: i.question.correctAnswer,
            explanation: i.question.explanation || null,
            options: i.question.options,
            // denormalized texts for resilience if bank changes later
            selectedText: i.selectedAnswer ? i.question.options[i.selectedAnswer.charCodeAt(0)-65] : null,
            correctText: i.question.options[i.question.correctAnswer.charCodeAt(0)-65]
        }))
      };
      existing.push(attempt);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Persist failed', e);
    }
  };

  const buildClipboardText = () => {
    const lines: string[] = [];
    lines.push(`Exam Review (${new Date().toLocaleString()})`);
    lines.push(`Score: ${percentage}%  Correct: ${correctAnswers}/${totalQuestions}`);
    lines.push('');
    if (incorrect.length === 0) {
      lines.push('All answers correct.');
    } else {
      lines.push('Incorrect Answers:');
      incorrect.forEach(item => {
        const q = item.question;
        const correctIdx = q.correctAnswer.charCodeAt(0) - 65;
        lines.push(`Q${item.index + 1}. ${q.question}`);
        lines.push(`Your answer: ${item.selectedAnswer ?? '(no answer)'} => ${item.selectedAnswer ? q.options[item.selectedAnswer.charCodeAt(0)-65] : ''}`);
        lines.push(`Correct answer: ${q.correctAnswer} => ${q.options[correctIdx]}`);
        if (q.explanation) lines.push(`Explanation: ${q.explanation}`);
        lines.push('');
      });
    }
    return lines.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildClipboardText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 65) return 'text-blue-600';
    if (percentage >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent! 🎉';
    if (percentage >= 65) return 'Well done! 👏';
    if (percentage >= 55) return 'Good job! 👍';
    return 'Keep studying! 📚';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        {/* Score Display */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Exam Complete!
          </h2>
          
          <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
            {percentage}%
          </div>
          
          <p className="text-xl text-gray-600 mb-4">
            {getScoreMessage()}
          </p>
          
          <div className={`inline-block px-6 py-3 rounded-full text-white font-semibold ${
            isPassing ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {isPassing ? '✅ PASS' : '❌ FAIL'}
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Results Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {totalQuestions - correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="text-left bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">Performance Analysis</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              PRINCE2 Foundation pass mark is 55% (33/60 questions)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Your score: {correctAnswers}/{totalQuestions} questions correct
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {isPassing 
                ? `Congratulations! You exceeded the pass mark by ${(percentage - 55).toFixed(1)}%`
                : `You need ${Math.ceil(totalQuestions * 0.55) - correctAnswers} more correct answers to pass`
              }
            </li>
          </ul>
        </div>

        {/* Incorrect Answers Review */}
        <div className="text-left bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Review Incorrect Answers</h3>
            <button
              onClick={handleCopy}
              className="text-sm px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 transition"
            >
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          {incorrect.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={saveIncorrectForReview}
                className="text-xs px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                {saved ? 'Saved' : 'Save for Later Review'}
              </button>
              <a
                href="/review" 
                className="text-xs px-3 py-1 rounded border border-indigo-300 text-indigo-700 bg-white hover:bg-indigo-50 transition"
              >
                Open Review Page
              </a>
            </div>
          )}
          {incorrect.length === 0 ? (
            <p className="text-sm text-green-700">Perfect score on attempted questions – no review needed.</p>
          ) : (
            <ul className="space-y-4 max-h-96 overflow-y-auto pr-2 text-sm">
              {incorrect.map(item => {
                const q = item.question;
                const correctIdx = q.correctAnswer.charCodeAt(0) - 65;
                return (
                  <li key={item.index} className="p-4 bg-white rounded border border-gray-200 shadow-sm">
                    <p className="font-medium text-gray-800 mb-2">Q{item.index + 1}. {q.question}</p>
                    <div className="space-y-1 mb-2">
                      <p className="text-red-600">Your answer: {item.selectedAnswer ? `${item.selectedAnswer} – ${q.options[item.selectedAnswer.charCodeAt(0)-65]}` : 'No answer selected'}</p>
                      <p className="text-green-700">Correct answer: {q.correctAnswer} – {q.options[correctIdx]}</p>
                    </div>
                    {q.explanation && (
                      <p className="text-gray-600 text-xs leading-relaxed"><span className="font-semibold">Explanation:</span> {q.explanation}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

  {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Take Another Exam
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
            <button 
              onClick={() => window.print()}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Print Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
