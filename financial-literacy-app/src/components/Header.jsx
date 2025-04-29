import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Use NavLink for active styling

function Header() {
  const activeStyle = "bg-indigo-800 text-white px-3 py-2 rounded-md text-sm font-medium";
  const inactiveStyle = "text-indigo-100 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
          FinLit Hub
        </Link>
        <div className="space-x-4">
           <NavLink to="/" className={({isActive}) => isActive ? activeStyle : inactiveStyle}>
               Home
           </NavLink>
           <NavLink to="/dashboard" className={({isActive}) => isActive ? activeStyle : inactiveStyle}>
               Dashboard
           </NavLink>
            {/* Add link to Quiz maybe? Or rely on prompt */}
            <NavLink to="/quiz" className={({isActive}) => isActive ? activeStyle : inactiveStyle}>
               Quiz
            </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Header;