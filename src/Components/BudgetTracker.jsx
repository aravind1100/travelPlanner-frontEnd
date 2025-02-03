import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../Api/axios.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faCreditCard, faPiggyBank, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const BudgetTracker = ({trip}) => {
  const { tripId } = useParams();
  const [budget, setBudget] = useState(
    trip?.budget || 0
  );
  const [expenses, setExpenses] = useState(
    trip?.destinations?.reduce(
      (sum, dest) => sum + (dest.budget || 0),
      0
    ) || 0
  );
  const [newBudget, setNewBudget] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [submitError, setSubmitError] = useState(''); // Added missing state

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        const tripData = response.data;
        setBudget(tripData.budget || 0);
        
        const calculatedExpenses = tripData.destinations?.reduce(
          (sum, destination) => sum + (destination.budget || 0),
          0
        ) || 0;
        setExpenses(calculatedExpenses);
        
      } catch (error) {
        console.error('Error fetching budget data:', error.response?.data?.message);
      }
    };

    fetchBudgetData();
  }, [tripId,trip]);


  const handleBudgetUpdate = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!newBudget || isNaN(newBudget)) {
      setSubmitError('Please enter a valid budget amount');
      return;
    }

    const numericBudget = Number(newBudget);
    
    if (numericBudget < expenses) {
      setSubmitError('New budget cannot be less than current expenses');
      return;
    }

    setIsUpdating(true);
    
    try {
      await axios.put(
        `${BASE_URL}/api/trips/${tripId}`,
        { budget: numericBudget },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setBudget(numericBudget);
      setNewBudget('');
      setSubmitError('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update budget';
      setSubmitError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const remainingBudget = budget - expenses;
  const utilizationPercentage = (expenses / budget) * 100 || 0;

  return (
<div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center sm:text-left">Budget Tracker</h2>

  {submitError && (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
      {submitError}
    </div>
  )}

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
      <p className="text-sm font-medium text-green-600 mb-1 flex items-center">
        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-green-600" />
        Total Budget
      </p>
      <p className="text-2xl font-semibold text-green-800">
        ₹{budget.toLocaleString()}
      </p>
    </div>

    <div className="p-4 bg-red-50 rounded-lg border border-red-100">
      <p className="text-sm font-medium text-red-600 mb-1 flex items-center">
        <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-red-600" />
        Total Expenses
      </p>
      <p className="text-2xl font-semibold text-red-800">
        ₹{expenses.toLocaleString()}
      </p>
    </div>

    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
      <p className="text-sm font-medium text-blue-600 mb-1 flex items-center">
        <FontAwesomeIcon icon={faPiggyBank} className="mr-2 text-blue-600" />
        Remaining
      </p>
      <p
        className={`text-2xl font-semibold ${
          remainingBudget < 0 ? "text-red-700" : "text-blue-800"
        }`}
      >
        ₹{remainingBudget.toLocaleString()}
      </p>
    </div>
  </div>

  <form onSubmit={handleBudgetUpdate} className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Update Budget
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          value={newBudget}
          onChange={(e) => setNewBudget(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter new budget amount"
          min="0"
          step="100"
        />
        <button
          type="submit"
          disabled={isUpdating || !newBudget}
          className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors ${
            isUpdating || !newBudget
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isUpdating ? (
            <span className="flex items-center justify-center">
              <FontAwesomeIcon icon={faSyncAlt} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Updating...
            </span>
          ) : (
            "Update Budget"
          )}
        </button>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex justify-between text-sm font-medium text-gray-600">
        <span>Budget Utilization</span>
        <span>{utilizationPercentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${utilizationPercentage}%` }}
        ></div>
      </div>
    </div>
  </form>
</div>
  );
}
  export default BudgetTracker;
  