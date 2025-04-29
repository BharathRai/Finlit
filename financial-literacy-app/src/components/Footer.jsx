import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12 py-6">
      <div className="container mx-auto px-4 text-center text-sm">
        © {new Date().getFullYear()} FinLit Hub. All Rights Reserved.
        <p className="mt-1">Learn | Grow | Prosper</p>
      </div>
    </footer>
  );
}

export default Footer;