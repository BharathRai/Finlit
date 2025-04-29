// src/App.tsx
// No 'import React' needed for JSX
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header'; // Imports .jsx fine due to allowJs
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TopicDetailPage from './pages/TopicDetailPage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import useUserStore from './store/userStore';
import { UserStoreType } from './store/types'; // Import the store type

function App() {
    // Explicitly type the state parameter in the selector
    const userProfile = useUserStore((state: UserStoreType) => state.userProfile);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
             {!userProfile && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-center" role="alert">
                    <p className="font-bold">Personalize Your Learning!</p>
                    <p className="text-sm">
                       Take our quick <Link to="/quiz" className="font-medium underline hover:text-yellow-800">Financial Literacy Quiz</Link> to get recommendations tailored to you.
                     </p>
                </div>
             )}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/quiz" element={<QuizPage />} />
                     <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/topic/:topicId" element={<TopicDetailPage />} />
                    <Route path="*" element={
                        <div className="text-center py-10">
                            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                            <p className="text-gray-600">The page you are looking for does not exist.</p>
                            <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">Go back home</Link>
                        </div>
                    } />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;