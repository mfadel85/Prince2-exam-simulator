'use client';

import { useState } from 'react';
import { ExamConfig } from '@/app/page';

interface ExamSetupProps {
  onStartExam: (config: ExamConfig) => void;
}

const QUESTION_OPTIONS = [10, 20, 30, 40, 50, 60];
const TIME_OPTIONS = [15, 30, 45, 60, 75, 90]; // in minutes

export default function ExamSetup({ onStartExam }: ExamSetupProps) {
  const [questionCount, setQuestionCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState(30);

  const handleStart = () => {
    onStartExam({ questionCount, timeLimit });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Configure Your Exam
      </h2>
      
      <div className="space-y-6">
        {/* Question Count Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Number of Questions
          </label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {QUESTION_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`py-2 px-4 rounded-lg border text-center transition-colors ${
                  questionCount === count
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Time Limit Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Time Limit (minutes)
          </label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {TIME_OPTIONS.map((time) => (
              <button
                key={time}
                onClick={() => setTimeLimit(time)}
                className={`py-2 px-4 rounded-lg border text-center transition-colors ${
                  timeLimit === time
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {time}m
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-2">Exam Summary</h3>
          <p className="text-sm text-gray-600">
            You will answer <span className="font-semibold">{questionCount} questions</span> in{' '}
            <span className="font-semibold">{timeLimit} minutes</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Average time per question: {Math.round((timeLimit / questionCount) * 60)} seconds
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}
