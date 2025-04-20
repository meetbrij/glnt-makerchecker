import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-white shadow p-4">
    <Link to="/" className="flex items-center space-x-2">
      {/* Replace the src below with your actual logo path */}
      <img src="/glnt-asia-logo.jpg" alt="GLNT ASIA MARKET INTELLIGIENCE" className="h-8 w-8 object-contain" />
      <span className="font-josefin text-4xl"><span className='font-bold text-gray-800'>GLNT</span><span className='text-sky-700 font-normal'>ELLIGENCE</span></span>
    </Link>
  </header>
);

export default Header;