# FinLit Hub 💡

Welcome to FinLit Hub, a web application designed to enhance financial literacy through interactive learning and personalized feedback. Explore various financial topics, test your knowledge with our quiz, and receive tailored recommendations based on your results.

## ✨ Live Demo

Check out the live version deployed on Render:
**[https://finlit-hub.onrender.com](https://finlit-hub.onrender.com)**

*(Note: The backend might take a few seconds to spin up on the first visit if it has been idle.)*

## How It Works: Quiz to Dashboard Flow 🧠➡️📊

A core feature of FinLit Hub is the personalized learning journey that starts with our assessment quiz:

1.  **Start with the Quiz:** Navigate to the **[Quiz Page](https://finlit-hub.onrender.com/quiz)**.
2.  **Assess Your Knowledge:** Answer the questions covering various financial topics. Your answers, along with your self-reported confidence level for each question, help the application build a profile of your current understanding.
3.  **Submit Answers:** Once you complete all the questions, click the "Submit & See Dashboard" button.
4.  **View Your Personalized Dashboard:** Upon successful submission, the backend processes your answers, generates your unique user profile (identifying potential knowledge gaps, misconceptions, areas needing reinforcement, and proficient topics), and **you will be automatically redirected** to your **[Dashboard Page](https://finlit-hub.onrender.com/dashboard)**.

Your personalized dashboard provides:
*   A summary of your assessment results.
*   Visualizations of your estimated knowledge and confidence across different financial categories.
*   Tailored content recommendations to help you focus your learning.
*   A place to track topics you've explicitly marked as interesting.

## Features ✨

*   **Browse Financial Topics:** Explore a categorized list of essential financial concepts.
*   **Interactive Quiz:** Assess your knowledge and confidence across various topics.
*   **Personalized User Profile:** Automatically generated profile based on quiz results, highlighting strengths and areas for improvement.
*   **Learning Recommendations:** Content suggestions tailored to your profile needs.
*   **Interest Tracking:** Mark topics you're interested in learning more about.
*   **Topic Detail Pages:** Basic information and related resources for specific topics.
*   **Responsive Design:** Works on different screen sizes.

## Tech Stack 💻

*   **Frontend:**
    *   React (with TypeScript/JavaScript)
    *   Vite (Build Tool)
    *   React Router DOM (Routing)
    *   Zustand (State Management with Persistence)
    *   Tailwind CSS (Styling)
    *   Fetch API / Axios (API Communication)
*   **Backend:**
    *   Python
    *   FastAPI (Web Framework)
    *   Uvicorn (ASGI Server)
    *   Pydantic (Data Validation)
    *   Scikit-learn (Potential for ML-based analysis/recommendations)
    *   python-dotenv (Environment Variables)
*   **Deployment:**
    *   Render (Static Site for Frontend, Web Service for Backend)

## Getting Started Locally 🚀

### Prerequisites

*   Node.js (v18 or later recommended) & npm (or yarn)
*   Python (v3.9 or later recommended) & pip

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BharathRai/Finlit.git
    cd Finlit
    ```

2.  **Backend Setup:**
    ```bash
    cd finlit-backend

    # Create and activate a virtual environment (recommended)
    python -m venv venv
    # On Windows: .\venv\Scripts\activate
    # On macOS/Linux: source venv/bin/activate

    # Install dependencies
    pip install -r requirements.txt

    # Create a .env file in the finlit-backend directory
    # Add necessary environment variables, especially for local development CORS:
    # CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

    # Run the backend server
    uvicorn main:app --reload
    ```
    The backend should now be running, typically on `http://127.0.0.1:8000`.

3.  **Frontend Setup:**
    *   Open a **new terminal** window.
    *   Navigate to the frontend directory:
        ```bash
        cd financial-literacy-app
        ```
    *   Install dependencies:
        ```bash
        npm install
        # or: yarn install
        ```
    *   Create a `.env` file in the `financial-literacy-app` directory.
    *   Add the backend API base URL to the `.env` file (adjust port if needed):
        ```env
        VITE_API_BASE_URL=http://127.0.0.1:8000/api
        ```
    *   Run the frontend development server:
        ```bash
        npm run dev
        # or: yarn dev
        ```
    The frontend should now be accessible, typically on `http://localhost:5173`.

## Deployment 🌐

This project is configured for deployment on Render:

*   The **frontend** (`financial-literacy-app`) is deployed as a **Static Site**.
    *   Build Command: `npm run build`
    *   Publish Directory: `dist`
    *   **Important:** A rewrite rule is needed for React Router:
        *   Source: `/*`
        *   Destination: `/index.html`
        *   Action: `Rewrite`
    *   Environment Variable `VITE_API_BASE_URL` must be set to the live backend URL (e.g., `https://your-backend-url.onrender.com/api`).
*   The **backend** (`finlit-backend`) is deployed as a **Web Service**.
    *   Build Command: `pip install -r requirements.txt`
    *   Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
    *   Environment Variable `CORS_ORIGINS` must be set to the live frontend URL (e.g., `https://your-frontend-url.onrender.com`).

---

Happy Learning!
