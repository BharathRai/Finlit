import React from 'react';
import { Link } from 'react-router-dom'; // Assuming recommendations might link internally

function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  // Determine link target based on contentType
  let linkTarget = '#'; // Default or external link placeholder
  if (recommendation.contentType === 'topic' && recommendation.relatedTopicIds?.length > 0) {
    linkTarget = `/topic/${recommendation.relatedTopicIds[0]}`; // Link to the primary topic page
  } else if (recommendation.contentType === 'article' || recommendation.contentType === 'video') {
     // Assume contentId might be a URL slug or part of one, or the full URL
     // linkTarget = recommendation.contentId; // Needs adjustment based on actual content structure
  } // Add more cases for 'tool', etc.

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="p-5 flex-grow">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full mb-2 inline-block">
          {recommendation.contentType}
        </span>
         {recommendation.reason && (
             <p className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded mb-2 italic">
                💡 {recommendation.reason}
             </p>
         )}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{recommendation.title}</h3>
        <p className="text-gray-600 text-sm mb-3 flex-grow">{recommendation.description}</p>
         <p className="text-xs text-gray-500">Relevance: {(recommendation.relevanceScore * 100).toFixed(0)}%</p>
      </div>
      {/* Make the card clickable if there's a sensible link target */}
       {linkTarget !== '#' ? (
           <Link to={linkTarget} className="block bg-gray-50 hover:bg-gray-100 px-5 py-3 text-right transition-colors">
               <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                   View {recommendation.contentType} →
               </span>
           </Link>
       ) : (
           <div className="bg-gray-50 px-5 py-3 text-right">
              {/* Placeholder if not linkable */}
              <span className="text-sm font-medium text-gray-400">Details unavailable</span>
           </div>
       )}
    </div>
  );
}

export default RecommendationCard;