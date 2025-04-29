import React from 'react';
import { topics_groups, topics, getTopicsByCategory } from '../data/financialTopics';
import TopicCard from '../components/TopicCard';
import { Link } from 'react-router-dom';

function HomePage() {
  const categories = Object.keys(topics_groups);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Welcome to FinLit Hub</h1>
      <p className="text-center text-gray-600 mb-10">Explore financial topics to build your knowledge.</p>

      {categories.map((categoryName) => {
        const categoryTopics = getTopicsByCategory(categoryName);
        return (
          <section key={categoryName} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 border-l-4 border-indigo-600 pl-3 text-gray-700">
              {/* Optional: Link to a dedicated category page */}
              {/* <Link to={`/category/${encodeURIComponent(categoryName)}`} className="hover:text-indigo-700 transition-colors"> */}
                 {categoryName}
              {/* </Link> */}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default HomePage;