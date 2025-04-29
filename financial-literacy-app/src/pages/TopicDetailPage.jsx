// src/pages/TopicDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { topics, getCategoryByTopicId } from '../data/financialTopics';
import useUserStore from '../store/userStore';
import { fetchAllContent } from '../hooks/useApiClient'; // Assuming this fetches GET /api/content

function TopicDetailPage() {
    const { topicId: topicIdParam } = useParams();
    const navigate = useNavigate();
    const { toggleInterest, isInterested } = useUserStore();
    const topicId = parseInt(topicIdParam, 10);

    const [topicContent, setTopicContent] = useState(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [errorContent, setErrorContent] = useState(null);

    const topic = topics[topicId]; // Basic local data
    const category = getCategoryByTopicId(topicId);
    const interested = isInterested(topicId);

    useEffect(() => {
        const loadContent = async () => {
            if (isNaN(topicId)) { setErrorContent("Invalid Topic ID."); setIsLoadingContent(false); return; };
            setIsLoadingContent(true); setErrorContent(null);
            try {
                // Fetch all content items
                const allContent = await fetchAllContent(); // Use API client
                if (!Array.isArray(allContent)) throw new Error("Invalid content data received");
                // Find first item matching topicId
                const found = allContent.find(item => Array.isArray(item.relatedTopicIds) && item.relatedTopicIds.includes(topicId));
                setTopicContent(found || null);
            } catch (err) { console.error("Failed fetch content:", err); setErrorContent("Could not load details."); setTopicContent(null);
            } finally { setIsLoadingContent(false); }
        };
        loadContent();
    }, [topicId]);

    if (isNaN(topicId) || !topic) { return ( <div className="text-center p-10"><h2 className="text-red-600 text-xl">Topic Not Found</h2><Link to="/">Home</Link></div> ); }

    const handleInterestToggle = () => toggleInterest(topicId);
    const displayDescription = topicContent?.description || topic.description || "No description.";
    const handleImageError = (e) => { e.target.style.display = 'none'; }; // Hide broken image

    return (
        <div className="container mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 hover:underline">← Back</button>
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-start mb-4 gap-4">
                    <div><h1 className="text-4xl font-bold text-gray-800">{topic.name}</h1>{category && <p className="text-sm text-gray-500 mt-1">Category: {category}</p>}</div>
                    <button onClick={handleInterestToggle} title={interested ? "Remove interest" : "Add interest"} className={`flex-shrink-0 px-4 py-2 rounded font-semibold transition-colors duration-200 flex items-center gap-2 text-sm ${ interested ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' }`}>{interested ? '♥ Interest' : '♡ Add Interest'}</button>
                </div>
                <p className="text-gray-700 text-lg mb-8">{displayDescription}</p>
                <div className="mt-10 pt-6 border-t border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Related Resources</h2>
                    {isLoadingContent && <p className="text-gray-500 animate-pulse">Loading...</p>}
                    {errorContent && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{errorContent}</p>}
                    {!isLoadingContent && topicContent?.relatedResources?.length > 0 && (
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-md shadow-inner">
                            <h3 className="font-semibold text-gray-800 mb-4">External Links:</h3>
                            <ul className="space-y-4">
                                {topicContent.relatedResources.map((resource, index) => (
                                    <li key={index} className="flex items-center gap-4">
                                        {resource.imageUrl && ( <img src={resource.imageUrl} alt="" className="w-20 h-12 object-cover flex-shrink-0 rounded border border-gray-200 bg-white shadow-sm" onError={handleImageError}/> )}
                                        {!resource.imageUrl && ( <div className="w-20 h-12 flex-shrink-0 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 text-xs">No Image</div> )}
                                        <div> <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:text-indigo-900 hover:underline font-medium text-base">{resource.title}</a> {resource.source && ( <p className="text-xs text-gray-500 mt-0.5">Source: {resource.source}</p> )} </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {!isLoadingContent && (!topicContent || !topicContent.relatedResources || topicContent.relatedResources.length === 0) && ( <p className="text-gray-500 italic text-sm">No specific external resources linked.</p> )}
                    <p className="text-xs text-gray-400 italic mt-4">Future: Dynamically fetch recent news for '{topic.name}'.</p>
                </div>
            </div>
        </div>
    );
}
export default TopicDetailPage;