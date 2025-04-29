// src/pages/QuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizQuestion from '../components/QuizQuestion';
import { fetchQuizQuestions, submitQuizResults } from '../hooks/useApiClient';
import useUserStore from '../store/userStore';

function QuizPage() {
    const navigate = useNavigate();
    const setUserProfile = useUserStore((state) => state.setUserProfile);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadQuestions = async () => {
            setIsLoading(true); setError(null);
            try {
                const fetchedQuestions = await fetchQuizQuestions(); // Fetches default 10 from API
                if (!Array.isArray(fetchedQuestions) || fetchedQuestions.length === 0) throw new Error("No questions received from server.");
                setQuestions(fetchedQuestions);
                setAnswers(fetchedQuestions.reduce((acc, q) => { acc[q.id] = { answer: null, confidence: 3 }; return acc; }, {}));
            } catch (err) { console.error("Failed loading quiz questions from API:", err); setError(err.message || "Failed to load questions.");
            } finally { setIsLoading(false); }
        };
        loadQuestions();
    }, []);

    const handleAnswerSelect = (questionId, selectedAnswer) => setAnswers((prev) => ({ ...prev, [questionId]: { ...(prev[questionId] || {}), answer: selectedAnswer } }));
    const handleConfidenceChange = (questionId, confidence) => setAnswers((prev) => ({ ...prev, [questionId]: { ...(prev[questionId] || { answer: null }), confidence: confidence } }));

    const handleSubmit = async () => {
        setIsSubmitting(true); setError(null);
        const unanswered = questions.filter(q => !answers[q.id]?.answer);
        if (unanswered.length > 0) { setError(`Please answer all ${questions.length} questions. Missing: ${unanswered.length}.`); setIsSubmitting(false); return; }
        const submissionData = Object.entries(answers).map(([qId, ansData]) => { const q = questions.find(q => q.id === parseInt(qId)); if (!q) return null; return { questionId: parseInt(qId), topicId: q.topicId, selectedAnswerValue: ansData.answer, confidence: ansData.confidence }; }).filter(i => i !== null);
        if (submissionData.length !== questions.length) { setError("Error preparing answers."); setIsSubmitting(false); return; }
        try {
            console.log("Submitting quiz:", submissionData); const profile = await submitQuizResults(submissionData); console.log("Received Profile:", profile);
            if (typeof setUserProfile === 'function') { setUserProfile(profile); console.log("setUserProfile called."); navigate('/dashboard'); }
            else { console.error("setUserProfile is not function!"); setError("Failed save profile locally."); }
        } catch (err) { console.error("Submit quiz error:", err); const detail = err?.response?.data?.detail || err.message || "Submit failed."; setError(`Submission failed: ${detail}`);
        } finally { setIsSubmitting(false); }
    };

    if (isLoading) return <div className="text-center py-10 animate-pulse">Loading Quiz...</div>;
    if (error && !questions.length) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
    if (!questions || questions.length === 0) return <div className="text-center py-10">No quiz questions available.</div>;

    const allAnswered = questions.every(q => answers[q.id]?.answer !== null);

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Financial Literacy Quiz</h1>
            {questions.length > 0 && ( <p className="mb-6 text-gray-600 text-center max-w-xl"> Answer these {questions.length} questions to help us understand your current knowledge and tailor recommendations for you. </p> )}
            {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md w-full max-w-xl text-sm">{error}</div>}
            <div className="w-full max-w-3xl space-y-10">
                {questions.map((question, index) => (
                    <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
                        <QuizQuestion question={question} questionNumber={index + 1} totalQuestions={questions.length} selectedAnswer={answers[question.id]?.answer ?? null} confidence={answers[question.id]?.confidence ?? 3} onAnswerSelect={(val) => handleAnswerSelect(question.id, val)} onConfidenceChange={(val) => handleConfidenceChange(question.id, val)} />
                    </div>
                ))}
            </div>
            <div className="mt-10 w-full max-w-3xl flex justify-center">
                <button onClick={handleSubmit} disabled={isSubmitting || !allAnswered} className="px-8 py-3 text-lg bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"> {isSubmitting ? 'Submitting...' : 'Submit & See Dashboard'} </button>
            </div>
            {!allAnswered && !isSubmitting && ( <p className="text-center text-sm text-red-500 mt-3">Please answer all questions.</p> )}
        </div>
    );
}
export default QuizPage;