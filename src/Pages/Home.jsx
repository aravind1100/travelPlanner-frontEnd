import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { places } from "../utils/data.js";
import { useAuth } from "../ContextApi.jsx";
import Footer from "../Components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import SearchBar from "../Components/SearchBar.jsx";




const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH;


const Home = () => {
  const ITEMS_PER_PAGE = 6;
  
  // State to manage pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPlaces, setDisplayedPlaces] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(false);
  const { isLoggedIn ,setSelectedTrip} = useAuth();
  
  const navigate= useNavigate();
  console.log(isLoggedIn)

  // Fetch images for current page
  const fetchImages = useCallback(
    async (placesToFetch) => {
      const newImages = { ...images };
      for (const trip of placesToFetch) {
        if (!newImages[trip.name]) {
          try {
            const response = await axios.get(
              `https://api.unsplash.com/search/photos`,
              {
                params: { query: `${trip.name} India`, per_page: 1 },
                headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
              }
            );
            newImages[trip.name] =
              response.data.results[0]?.urls?.small || "";
          } catch (error) {
            console.error(
              `Error fetching image for ${trip.name}:`,
              error.message
            );
            newImages[trip.name] = "";
          }
        }
      }
      setImages(newImages);
    },
    [images]
  );

  // Load more data on scroll
  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newPlaces = places.slice(start, end);

    setDisplayedPlaces((prev) => [...prev, ...newPlaces]);
    fetchImages(newPlaces).finally(() => setLoading(false));
    setCurrentPage((prev) => prev + 1);
  }, [currentPage, loading, fetchImages]);

  // Initial load
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite Scroll Event
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  const handleImageClick = (trip) => {
   
    if (!isLoggedIn) {
      
      alert("Login required to add the place")
      navigate("/login")
     
    } 
    else {
      
        const chosenTrip = {
          tripName:trip.name,
          tripDescription:trip.description
        }
        setSelectedTrip(chosenTrip)
        navigate("/trips/new")
      }
     
  }
 
   
  return (
    <>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to Trip Flow
        </h1>
        <p className="text-gray-600 mb-8">
          Plan your trips with ease and efficiency.
        </p>

        {/* Featured trips */}
        <div className="m-5">
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-2 text-green-700">
            Featured Places
          </h2>
          <p className="text-gray-600 mb-8">Click the image to add the place</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {displayedPlaces.map((trip, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                onClick={()=>handleImageClick(trip)}
              >
                {images[trip.name] ? (
                  
                  <img
                    src={images[trip.name]}
                    alt={trip.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                   
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-600">
                      Image not available
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold">{trip.name}</h3>
                <p className="text-gray-600">{trip.description}</p>
              </div>
            ))}
          </div>
          {loading && <p className="mt-4 text-gray-600">Loading...</p>}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Home;
