
import React, { useState, useEffect } from "react";
import axiosInstance from "../Api/axios.js";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../Components/SearchBar";
import Filters from "../Components/Filters";
import { useAuth } from "../ContextApi.jsx";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axiosInstance.get("/trips");
        setTrips(response.data);
        setFilteredTrips(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch trips:",
          error.response?.data?.message || error.message
        );
      }
    };
    fetchTrips();
  }, []);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        const filtered = trips.filter(
          (trip) =>
            trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTrips(filtered);
      } else {
        setFilteredTrips(trips);
      }
    }, 100);

    return () => clearTimeout(handler);
  }, [searchQuery, trips]);

  // Filter functionality
  const handleFilter = (filters) => {
    const filtered = trips.filter((trip) => {
      const matchesDate =
        (!filters.startDate || new Date(trip.startDate) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(trip.endDate) <= new Date(filters.endDate));
        
      // Single budget filter - shows trips with budget less than or equal to selected value
      const matchesBudget = !filters.budget || trip.budget <= Number(filters.budget);
  
      return matchesDate && matchesBudget;
    });
    setFilteredTrips(filtered);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Your Trips</h1>
      <div className="mb-6">
        <SearchBar onSearch={(query) => setSearchQuery(query)} />
        <Filters onFilter={handleFilter} setFilteredTrips={setFilteredTrips} trips={trips} />
      </div>
  
      {isLoggedIn && (
        <button
          onClick={() => navigate("/trips/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 w-full sm:w-auto"
        >
          Add Trip
        </button>
      )}
  
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrips.map((trip) => (
          <li key={trip._id} className="bg-white p-4 rounded-lg shadow-md text-center break-words">
            <h2 className="text-xl font-semibold mb-2">Trip to {trip.name}</h2>
            <p className="text-gray-600 mb-1">Brief: {trip.description}</p>
            <p className="text-gray-800 mb-2">Budget: ${trip.budget}</p>
            <Link 
              to={`/trips/${trip._id}`} 
              className="text-blue-500 hover:underline inline-block"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 
  export default Dashboard;
  
