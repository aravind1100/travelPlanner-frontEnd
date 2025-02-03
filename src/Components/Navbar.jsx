import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTachometerAlt, faSignOutAlt, faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-500 p-7 text-white shadow-md ">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Plan Your Travels with Trip Flow
        </Link>

        {/* Hamburger Icon */}
        <button
          className="md:hidden text-3xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-blue-200 flex items-center gap-x-1">
            <FontAwesomeIcon icon={faHome} className="text-xl" /> Home
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200 flex items-center gap-x-1">
                <FontAwesomeIcon icon={faTachometerAlt} className="text-xl" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="hover:text-blue-200 flex items-center gap-x-1">
                <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 flex items-center gap-x-1">
                <FontAwesomeIcon icon={faSignInAlt} className="text-xl" /> Login
              </Link>
              <Link to="/signup" className="hover:text-blue-200 flex items-center gap-x-1">
                <FontAwesomeIcon icon={faUserPlus} className="text-xl" /> Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-600 p-4 space-y-3">
          <Link
            to="/"
            className="block hover:text-blue-200 flex items-center gap-x-1"
            onClick={() => setIsMenuOpen(false)}
          >
            <FontAwesomeIcon icon={faHome} className="text-xl" /> Home
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="block hover:text-blue-200 flex items-center gap-x-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="text-xl" /> Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block hover:text-blue-200 flex items-center gap-x-1"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-blue-200 flex items-center gap-x-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faSignInAlt} className="text-xl" /> Login
              </Link>
              <Link
                to="/signup"
                className="block hover:text-blue-200 flex items-center gap-x-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faUserPlus} className="text-xl" /> Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
