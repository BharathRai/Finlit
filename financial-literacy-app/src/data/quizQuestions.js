// Example structure - IMPORTANT: Ensure question `id` and `topicId` are correct
// The backend should have the canonical list and correct answers.
// Frontend uses this for display.
export const quizQuestions = [
    {
      id: 101, // Unique question ID
      topicId: 1, // Maps to "Budgeting"
      text: "What is the primary purpose of a budget?",
      options: [
        { value: "a", text: "To track past spending exactly." },
        { value: "b", text: "To plan future spending and saving." }, // Correct (Backend knows this)
        { value: "c", text: "To eliminate all discretionary spending." },
        { value: "d", text: "To calculate your net worth." },
      ],
    },
    {
      id: 102,
      topicId: 3, // Maps to "Emergency Fund"
      text: "A common recommendation for an emergency fund is to cover how many months of essential living expenses?",
      options: [
        { value: "a", text: "1 month" },
        { value: "b", text: "1-2 months" },
        { value: "c", text: "3-6 months" }, // Correct
        { value: "d", text: "12 months or more" },
      ],
    },
     {
      id: 103,
      topicId: 9, // Stock Market
      text: "Buying a single company's stock is generally considered:",
      options: [
        { value: "a", text: "Less risky than a diversified mutual fund." },
        { value: "b", text: "More risky than a diversified mutual fund." }, // Correct
        { value: "c", text: "Guaranteed to provide higher returns." },
        { value: "d", text: "Only suitable for retirement savings." },
      ],
    },
    // Add more questions covering various topics...
  ];
  
  // Helper to get questions (can be expanded for fetching from API)
  export const getQuizQuestions = async () => {
     // In a real app, fetch from GET /quiz/questions
     // const response = await fetch('/api/quiz/questions'); // Use your API client
     // const data = await response.json();
     // return data;
     return Promise.resolve(quizQuestions); // Simulate API call for now
  };