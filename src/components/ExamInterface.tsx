'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExamConfig } from '@/app/page';
import Timer from './Timer';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import { getRandomQuestions, Question } from '@/data/questions';

interface AnswerReview {
  index: number; // zero-based index
  question: Question;
  selectedAnswer?: string; // undefined if unanswered
}

interface ExamInterfaceProps {
  config: ExamConfig;
  onFinishExam: (score: number, review: AnswerReview[]) => void;
}

export default function ExamInterface({ config, onFinishExam }: ExamInterfaceProps) {
  const [questions] = useState<Question[]>(() => getRandomQuestions(config.questionCount));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit * 60); // Convert to seconds
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const buildReview = useCallback((): AnswerReview[] => {
    return questions.map((q, i) => ({
      index: i,
      question: q,
      selectedAnswer: answers[i]
    }));
  }, [questions, answers]);

  const calculateScore = useCallback(() => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  }, [questions, answers]);

  const handleTimeUp = useCallback(() => {
    const score = calculateScore();
    onFinishExam(score, buildReview());
  }, [calculateScore, buildReview, onFinishExam]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleTimeUp]);

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinishExam = () => {
    const score = calculateScore();
    onFinishExam(score, buildReview());
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg mb-6 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Timer timeRemaining={timeRemaining} />
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Answered: {getAnsweredCount()} / {questions.length}
          </div>
        </div>
        <ProgressBar progress={progress} />
      </div>

      {/* Question */}
      <div className="mb-6">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={answers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={currentQuestionIndex + 1}
        />
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirmFinish(true)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Finish Exam
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={isLastQuestion}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLastQuestion ? 'Last Question' : 'Next'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmFinish && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Finish Exam?</h3>
            <p className="text-gray-600 mb-6">
              You have answered {getAnsweredCount()} out of {questions.length} questions.
              Are you sure you want to finish the exam?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Exam
              </button>
              <button
                onClick={handleFinishExam}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Finish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
