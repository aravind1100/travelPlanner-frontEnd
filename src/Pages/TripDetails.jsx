import React, { useState, useEffect } from 'react';
import axiosInstance from '../Api/axios.js';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BudgetTracker from '../Components/BudgetTracker';
import { useAuth } from '../ContextApi.jsx';

const TripDetails = () => {
  const [trip, setTrip] = useState(null);
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { setEditDestination } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axiosInstance.get(`/trips/${tripId}`);
        setTrip(response.data);
      } catch (error) {
        console.error('Failed to fetch trip:', error.response?.data?.message || error.message);
      }
    };
    fetchTrip();
  }, [tripId,trip]);

  const handleDeleteTrip = async () => {
    try {
      await axiosInstance.delete(`/trips/${tripId}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete trip:', error.response?.data?.message || error.message);
    }
  };

  const handleEditDestination = (destination) => {
    setEditDestination({
      id: destination._id,
      name: destination.name,
      activities: destination.activities.join(", "),
      date: destination.date, // Keep as ISO string for date input
      budget: destination.budget,
      others: destination.others || ""
    });
    navigate(`/trips/${tripId}/destinations/${destination._id}/edit`);
  };

  const handleDeleteDestination = async (id) => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await axiosInstance.delete(`/destinations/${tripId}/${id}`);
      
      // Optimistically update the state
      setTrip(prev => ({
        ...prev,
        destinations: prev.destinations.filter(dest => dest._id !== id),
       
      }));
    } catch (error) {
      console.error('Failed to delete destination:', error.response?.data?.message || error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!trip) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 md:p-6">
    {/* Trip Header Section */}
    <div className="mb-4 md:mb-6">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">{trip.name}</h1>
      
      <div className="space-y-4 md:space-y-6">
        <p className="text-gray-700 text-sm md:text-base">{trip.description}</p>
        
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <p className="text-sm md:text-base">
            Start: {new Date(trip.startDate).toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })}
          </p>
          <p className="text-sm md:text-base">
            End: {new Date(trip.endDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </p>
        </div>
        
        <p className="font-bold text-blue-700 text-lg md:text-xl">
          Total Budget: ₹{trip.budget.toLocaleString()}
        </p>
      </div>
    </div>
  
    {/* Action Buttons */}
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 mb-6 md:mb-8">
      <Link
        to={`/trips/${tripId}/edit`}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center md:text-left"
      >
        Edit Trip
      </Link>
      <button
        onClick={handleDeleteTrip}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete Trip
      </button>
    </div>
  
    {/* Destinations Section */}
    <section className="mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Destinations</h2>
        <Link
          to={`/trips/${tripId}/destinations/new`}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center md:text-left w-full md:w-auto"
          state={{ trip }}
        >
          Add Destination
        </Link>
      </div>
  
      <ul className="space-y-3 md:space-y-4">
        {trip.destinations.map((destination) => (
          <li key={destination._id} className="bg-white p-3 md:p-4 rounded-lg shadow-md">
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-lg md:text-xl font-semibold">{destination.name}</h3>
              
              <div className="space-y-1 text-sm md:text-base">
                <p>Activities: {destination.activities.join(', ')}</p>
                <p>
                  Date: {new Date(destination.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                <p>Budget: ₹{destination.budget.toLocaleString()}</p>
                {destination.others && (
                  <p>Additional Notes: {destination.others}</p>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <button
                  onClick={() => handleEditDestination(destination)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDestination(destination._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  
    <BudgetTracker trip={trip} />
  </div>
  );
};

export default TripDetails;