import React from 'react';

function ConfidenceSlider({ confidence, onChange }) {
  const confidenceLabels = {
    1: "Complete Guess",
    2: "Not Sure",
    3: "Somewhat Sure",
    4: "Confident",
    5: "Very Confident",
  };

  return (
    <div className="mt-6 w-full">
      <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-2">
        How confident are you in your answer?
      </label>
      <input
        type="range"
        id="confidence"
        name="confidence"
        min="1"
        max="5"
        value={confidence}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
      <p className="text-center text-sm font-medium text-indigo-700 mt-2">
         {confidenceLabels[confidence]}
      </p>
    </div>
  );
}

export default ConfidenceSlider;