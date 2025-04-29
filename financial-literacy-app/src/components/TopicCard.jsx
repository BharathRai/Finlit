import React from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../store/userStore'; // Import the store

function TopicCard({ topic }) {
  const { toggleInterest, isInterested } = useUserStore(); // Get actions/state from store
  const interested = isInterested(topic.id);

  const handleInterestToggle = (e) => {
      e.preventDefault(); // Prevent link navigation when clicking button
      e.stopPropagation(); // Stop event bubbling
      toggleInterest(topic.id);
  };

  if (!topic) return null; // Handle case where topic might be undefined

  return (
    <Link
      to={`/topic/${topic.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-indigo-700">{topic.name}</h3>
          <button
            onClick={handleInterestToggle}
            title={interested ? "Remove from interests" : "Add to interests"}
            className={`text-xl transition-colors duration-200 ${
              interested ? 'text-red-500 hover:text-red-700' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            {interested ? '♥' : '♡'}
          </button>
        </div>
        <p className="text-gray-600 text-sm">{topic.description}</p>
      </div>
      <div className="bg-gray-50 px-5 py-2 text-right">
         <span className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
            Learn More →
         </span>
      </div>
    </Link>
  );
}

export default TopicCard;