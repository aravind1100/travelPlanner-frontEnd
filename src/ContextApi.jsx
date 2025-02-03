import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const[selectedTrip,setSelectedTrip]=useState(null);
  const[editDestination,setEditDestination]=useState(null);
  // Function to log in the user
  const login = (token) => {
    localStorage.setItem('token', token); // Store the token in localStorage
    setIsLoggedIn(true); // Update the login state
  };

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setIsLoggedIn(false); // Update the login state
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout ,selectedTrip,setSelectedTrip , editDestination,setEditDestination}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};