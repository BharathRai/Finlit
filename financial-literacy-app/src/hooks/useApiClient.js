// src/hooks/useApiClient.js
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function apiClient(endpoint, method = 'GET', body = null) {
    const config = { method: method, headers: { 'Content-Type': 'application/json', /* Add Auth later */ }, };
    if (body) { config.body = JSON.stringify(body); }
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`API Request: ${method} ${url}`);
        const response = await fetch(url, config);
        if (!response.ok) {
            let errorData = { message: `HTTP error! Status: ${response.status}` };
            try { const backendError = await response.json(); errorData = { ...errorData, ...backendError }; } catch (e) {}
            console.error("API Client Error Response:", errorData);
            const error = new Error(errorData.detail || errorData.message); error.response = response; error.data = errorData; throw error;
        }
        if (response.status === 204 || response.headers.get('content-length') === '0') return null;
        const data = await response.json(); console.log(`API Response OK: ${method} ${url}`); return data;
    } catch (error) { console.error("API Client Fetch Error:", error); throw error; }
}

export const submitQuizResults = async (answers) => apiClient('/quiz/submit', 'POST', { answers });
export const fetchRecommendations = async () => apiClient('/recommendations', 'GET');
export const fetchQuizQuestions = async (limit = 10) => apiClient(`/quiz/questions?limit=${limit}`, 'GET');
export const fetchAllContent = async () => apiClient('/content', 'GET');

// Optional hook export
// import { useCallback } from 'react';
// const useApiClient = () => ({ /* ... useCallback wrapped functions ... */ });
// export default useApiClient;