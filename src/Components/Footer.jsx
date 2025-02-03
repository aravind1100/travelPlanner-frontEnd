// src/Components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-3">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link to="/" className="text-xl font-bold hover:text-white">
            Trip Flow
          </Link>
          <p className="text-sm">Plan perfect with us !</p>
        </div>
        <div className="flex space-x-4 mb-4 md:mb-0">
          <Link to="/" className="hover:text-white">
            About
          </Link>
          <Link to="/" className="hover:text-white">
            Contact
          </Link>
          <Link to="/" className="hover:text-white">
            Terms
          </Link>
          <Link to="/" className="hover:text-white">
            Privacy
          </Link>
        </div>
        <div className="text-sm">
          <p>&copy; {new Date().getFullYear()} Trip_Flow All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
