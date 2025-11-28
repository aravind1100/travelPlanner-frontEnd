import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import TripForm from "./Pages/TripForm";
import TripDetails from "./Pages/TripDetails";
import DestinationForm from "./Pages/DestinationForm";
import BudgetTracker from "./Components/BudgetTracker";
import { ProtectedRoute } from "./ProtectedRoute";


const App = () => {

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />

            {/* Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute />}>
              {/* Dashboard and Trip Management */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trips/new" element={<TripForm />} />
              <Route path="/trips/:tripId/edit" element={<TripForm />} />
              <Route path="/trips/:tripId" element={<TripDetails />} />

              {/* Destination Management */}
              <Route
                path="/trips/:tripId/destinations/new"
                element={<DestinationForm />}
              />
              <Route
                path="/trips/:tripId/destinations/:destinationId/edit"
                element={<DestinationForm />}
              />

              {/* Budget Tracker */}
              <Route path="/trips/:tripId/budget" element={<BudgetTracker />} />
            </Route>
            {/* Fallbacks */}
            <Route
                path="*"
                element={
                  <div className="text-center mt-20">
                    <h1 className="text-6xl font-bold text-gray-300">404</h1>
                    <p className="text-xl text-gray-600 mt-4">Page not found</p>
                    <Link to="/" className="text-indigo-600 hover:underline mt-4 block">Return Home</Link>
                  </div>
                }
              />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
