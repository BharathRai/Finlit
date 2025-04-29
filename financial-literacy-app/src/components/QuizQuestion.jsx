import React from 'react';
import ConfidenceSlider from './ConfidenceSlider';

function QuizQuestion({ question, questionNumber, totalQuestions, selectedAnswer, confidence, onAnswerSelect, onConfidenceChange }) {
  if (!question) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
      <p className="text-sm font-semibold text-indigo-600 mb-2">
        Question {questionNumber} of {totalQuestions} (Topic ID: {question.topicId})
      </p>
      <h2 className="text-xl font-medium text-gray-800 mb-6">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-150 ${
              selectedAnswer === option.value
                ? 'bg-indigo-100 border-indigo-400 ring-2 ring-indigo-300'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.value}
              checked={selectedAnswer === option.value}
              onChange={() => onAnswerSelect(option.value)}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3"
            />
            <span className="text-gray-700">{option.text}</span>
          </label>
        ))}
      </div>
      <ConfidenceSlider confidence={confidence} onChange={onConfidenceChange} />
    </div>
  );
}

export default QuizQuestion;