import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="p-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 border-t-[2px]">
    <div className="flex items-center space-x-2">
      <Link to="/" className="flex items-center space-x-2 hover:opacity-80">
        {/* Placeholder image logo */}
        <img src="/glnt-asia-logo.jpg" alt="GLNT ASIA MARKET INTELLIGIENCE" className="h-8 w-8 object-contain" />
        <span className="font-josefin text-2xl"><span className='font-bold text-gray-800'>GLNT</span><span className='text-sky-700 font-normal'>ELLIGENCE</span></span>
      </Link>
    </div>
    <nav className="flex space-x-4 mt-4 md:mt-0">
      <Link to="/about" className="hover:underline">About Us</Link>
      <Link to="/terms" className="hover:underline">Terms</Link>
      <Link to="/privacy" className="hover:underline">Privacy</Link>
    </nav>
  </footer>
);

export default Footer;
