import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-white shadow p-4">
    <Link to="/" className="flex items-center justify-center text-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
      <img
        src="/glnt-asia-logo.jpg"
        alt="GLNT ASIA MARKET INTELLIGENCE"
        className="h-10 w-10 object-contain"
      />
      <span className="font-josefin text-2xl sm:text-3xl md:text-4xl">
        <span className="font-bold text-gray-800">GLNT</span>
        <span className="text-sky-700 font-normal">ELLIGENCE</span>
      </span>
    </Link>
  </header>
);

export default Header;
