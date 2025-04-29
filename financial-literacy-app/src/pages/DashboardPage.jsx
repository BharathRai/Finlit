// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { fetchRecommendations } from '../hooks/useApiClient';
import RecommendationCard from '../components/RecommendationCard';
import { topics, getCategoryByTopicId } from '../data/financialTopics'; // Use local data for topic names/categories

function DashboardPage() {
    const userProfile = useUserStore((state) => state.userProfile);
    const interestedTopicsSet = useUserStore((state) => state.interestedTopics);
    const resetUser = useUserStore((state) => state.resetUser);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState(true);
    const [errorRecs, setErrorRecs] = useState(null);

    useEffect(() => {
        if (userProfile) {
            setIsLoadingRecs(true); setErrorRecs(null);
            fetchRecommendations()
                .then(data => setRecommendations(data || []))
                .catch(err => { console.error("Failed fetch recommendations:", err); setErrorRecs(err.message || "Could not load recommendations."); })
                .finally(() => setIsLoadingRecs(false));
        } else { setIsLoadingRecs(false); setRecommendations([]); }
    }, [userProfile]);

    const getTopicDetails = (id) => topics[id] || { name: `Unknown Topic ${id}` };
    const interestedTopicsArray = Array.from(interestedTopicsSet);

    const knowledgeData = userProfile ? Object.entries(userProfile.topicKnowledge || {})
        .map(([idStr, score]) => { const id = parseInt(idStr); const details = getTopicDetails(id); return { id: id, name: details.name, knowledge: Math.max(0, Math.min(100, score * 100)), confidence: Math.max(0, Math.min(100, (userProfile.topicConfidence?.[id] || 0) * 20)), category: getCategoryByTopicId(id) || 'Other', }; }) .sort((a, b) => a.name.localeCompare(b.name)) : [];
    const knowledgeByCategory = knowledgeData.reduce((acc, item) => { (acc[item.category] = acc[item.category] || []).push(item); return acc; }, {});

    const generateSummary = () => {
        if (!userProfile) return "Complete the quiz to see your learning profile.";
        const summaries = []; const s = (n) => n > 1 ? 's' : '';
        if (userProfile.misconceptions?.size > 0) summaries.push(`Focus on ${userProfile.misconceptions.size} topic${s(userProfile.misconceptions.size)} with potential misconceptions.`);
        if (userProfile.knowledgeGaps?.size > 0) summaries.push(`Build knowledge in ${userProfile.knowledgeGaps.size} identified gap${s(userProfile.knowledgeGaps.size)}.`);
        if (userProfile.needsReinforcement?.size > 0) summaries.push(`Reinforce understanding in ${userProfile.needsReinforcement.size} topic${s(userProfile.needsReinforcement.size)}.`);
        if (userProfile.proficientTopics?.size > 0) summaries.push(`Proficient in ${userProfile.proficientTopics.size} topic${s(userProfile.proficientTopics.size)}. Keep exploring!`);
        if (summaries.length === 0 && userProfile.assessedTopics?.size > 0) return "Results processed. Check details below.";
        if (summaries.length === 0) return "No specific strengths/weaknesses identified. Explore or retake quiz.";
        return summaries.join(' ');
    };
    const handleResetProfile = () => { if (window.confirm("Reset profile and interests?")) { resetUser(); } };

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
             <div className="flex justify-between items-center gap-4"> <h1 className="text-3xl font-bold text-gray-800">Learning Dashboard</h1> <button onClick={handleResetProfile} className="text-sm text-red-600 hover:text-red-800 hover:underline flex-shrink-0" title="Reset quiz results and interests"> Reset Profile </button> </div>
            {!userProfile && ( <div className="bg-blue-50 p-4 rounded-md text-center border border-blue-200"> <p className="text-gray-700"> Take the initial <Link to="/quiz" className="text-indigo-600 hover:underline font-medium">quiz</Link> to generate your profile and get recommendations! </p> </div> )}
            {userProfile && (
                <>
                    <section className="bg-white p-6 rounded-lg shadow-md"> <h2 className="text-2xl font-semibold mb-4 text-gray-700">Profile Summary</h2> <p className="text-gray-600 mb-4">{generateSummary()}</p> <div className="pt-3 border-t border-gray-200"> <p className="text-xs text-gray-500 italic"> Future ML Insights: Advanced analysis might appear here. </p> </div> </section>
                    <section className="bg-white p-6 rounded-lg shadow-md"> <h2 className="text-2xl font-semibold mb-1 text-gray-700">Knowledge & Confidence</h2> <p className="text-sm text-gray-500 mb-6">Based on initial quiz. Interact to improve!</p>
                         {knowledgeData.length === 0 ? ( <p className="text-gray-500">No quiz data.</p> ) : (
                            <div className="space-y-6"> {Object.entries(knowledgeByCategory).sort(([catA],[catB]) => catA.localeCompare(catB)).map(([category, topicsInCategory]) => (
                                <div key={category}> <h3 className="text-lg font-semibold mb-3 text-indigo-700 border-b pb-1">{category}</h3> <div className="space-y-4 text-sm"> {topicsInCategory.map(topic => (
                                    <div key={topic.id}> <div className="flex justify-between items-center mb-1 gap-2 flex-wrap"> <Link to={`/topic/${topic.id}`} className="text-gray-800 hover:text-indigo-600 hover:underline font-medium break-words">{topic.name}</Link> <div className="flex items-center space-x-2 text-xs flex-shrink-0"> {userProfile.misconceptions?.has(topic.id) && <span className="font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded">(Misconception!)</span>} {userProfile.knowledgeGaps?.has(topic.id) && !userProfile.misconceptions?.has(topic.id) && <span className="font-semibold text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded">(Knowledge Gap)</span>} {userProfile.needsReinforcement?.has(topic.id) && <span className="text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">(Needs Reinforcement)</span>} </div> </div>
                                         <div className="mb-1"> <label className="text-xs font-medium text-gray-600">Knowledge:</label> <div className="w-full bg-gray-200 rounded-full h-2.5 mt-0.5" title={`Knowledge: ${topic.knowledge.toFixed(0)}%`}> <div className={`h-2.5 rounded-full transition-all duration-500 ease-out ${topic.knowledge > 70 ? 'bg-green-500' : topic.knowledge > 40 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${topic.knowledge}%` }}></div> </div> </div>
                                         <div> <label className="text-xs font-medium text-gray-600">Confidence:</label> <div className="w-full bg-gray-200 rounded-full h-2.5 mt-0.5" title={`Confidence: ${topic.confidence.toFixed(0)}% (Scaled)`}> <div className={`h-2.5 rounded-full transition-all duration-500 ease-out ${topic.confidence > 75 ? 'bg-blue-500' : topic.confidence < 45 ? 'bg-gray-400' : 'bg-blue-400'}`} style={{ width: `${topic.confidence}%` }}></div> </div> </div>
                                    </div> ))} </div> </div> ))} </div> )}
                         <div className="mt-6 pt-4 border-t border-gray-200"> <p className="text-xs text-gray-500 italic"> True progress tracking requires logging interactions. Feature coming soon! </p> </div> </section>
                </>
            )}
            <section> <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recommended For You</h2> {isLoadingRecs && <p className="text-gray-500 animate-pulse">Loading recommendations...</p>} {errorRecs && <p className="text-red-600 bg-red-100 p-3 rounded text-sm">Error: {errorRecs}</p>} {!isLoadingRecs && !errorRecs && recommendations.length === 0 && userProfile && ( <p className="text-gray-600 bg-green-50 p-4 rounded-md border border-green-200">No specific recommendations currently.</p> )} {!isLoadingRecs && !errorRecs && recommendations.length === 0 && !userProfile && ( <p className="text-gray-600 italic">Complete the quiz for recommendations.</p> )} {!isLoadingRecs && !errorRecs && recommendations.length > 0 && ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {recommendations.map((rec, index) => ( <RecommendationCard key={`${rec.contentId}-${index}`} recommendation={rec} /> ))} </div> )} </section>
            <section className="bg-white p-6 rounded-lg shadow-md"> <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Explicit Interests</h2> {interestedTopicsArray.length > 0 ? ( <div className="flex flex-wrap gap-2"> {interestedTopicsArray.map(topicId => { const details = getTopicDetails(topicId); return ( <Link key={topicId} to={`/topic/${topicId}`} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm hover:bg-indigo-200 transition-colors flex items-center gap-1" title={`Go to ${details.name}`}> {details.name} <span className="text-red-500 text-xs">♥</span> </Link> ); })} </div> ) : ( <p className="text-gray-600 text-sm">Browse topics and click ♡ to add them!</p> )} </section>
        </div>
    );
}
export default DashboardPage;