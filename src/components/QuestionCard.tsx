import { Question } from '@/data/questions';

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  questionNumber: number;
}

export default function QuestionCard({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  questionNumber 
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Q{questionNumber}
          </span>
          {question.category && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {question.category}
            </span>
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-800 leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
          const isSelected = selectedAnswer === optionLetter;
          
          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(optionLetter)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {optionLetter}
                </span>
                <span className="text-gray-700">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Question Help */}
      {!selectedAnswer && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 Select one answer to continue
          </p>
        </div>
      )}
    </div>
  );
}
