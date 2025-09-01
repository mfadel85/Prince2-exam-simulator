'use client';

import { useState } from 'react';
import ExamSetup from '@/components/ExamSetup';
import ExamInterface from '@/components/ExamInterface';
import ExamResults from '@/components/ExamResults';
import { Question } from '@/data/questions';

interface ReviewItem {
  index: number;
  question: Question;
  selectedAnswer?: string;
}

export type ExamState = 'setup' | 'taking' | 'results';

export interface ExamConfig {
  questionCount: number;
  timeLimit: number; // in minutes
}

export default function Home() {
  const [examState, setExamState] = useState<ExamState>('setup');
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    questionCount: 20,
    timeLimit: 30,
  });
  const [examScore, setExamScore] = useState<number>(0);
  const [examReview, setExamReview] = useState<ReviewItem[]>([]);

  const startExam = (config: ExamConfig) => {
    setExamConfig(config);
    setExamState('taking');
  };

  const finishExam = (score: number, review: ReviewItem[]) => {
    setExamScore(score);
    setExamReview(review);
    setExamState('results');
  };

  const resetExam = () => {
    setExamState('setup');
    setExamScore(0);
    setExamReview([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          PRINCE2 Foundation Exam Simulator
        </h1>
        <div className="flex justify-center mb-8 gap-4 text-sm flex-wrap">
          <a href="/" className="text-blue-700 font-medium underline">Home</a>
          <a href="/review" className="text-blue-700 font-medium underline">Review</a>
          <a href="/analytics" className="text-blue-700 font-medium underline">Analytics</a>
        </div>
        
        {examState === 'setup' && (
          <ExamSetup onStartExam={startExam} />
        )}
        
        {examState === 'taking' && (
          <ExamInterface 
            config={examConfig} 
            onFinishExam={finishExam} 
          />
        )}
        
        {examState === 'results' && (
          <ExamResults 
            score={examScore} 
            totalQuestions={examConfig.questionCount}
            onRestart={resetExam}
            review={examReview}
          />
        )}
      </div>
    </main>
  );
}
