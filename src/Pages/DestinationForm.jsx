import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BASE_URL } from '../Api/axios.js';
import { useAuth } from '../ContextApi.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClipboardList, faCalendarAlt, faDollarSign, faStickyNote } from '@fortawesome/free-solid-svg-icons';

const DestinationForm = () => {
  const { tripId, destinationId } = useParams();
  const navigate = useNavigate();
  const { editDestination, setEditDestination } = useAuth();
  const [trip, setTrip] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [initialValues, setInitialValues] = useState({
    name: '',
    activities: '',
    date: '',
    budget: '',
    others: '',
  });

  const validationSchema = useMemo(() => Yup.object().shape({
    name: Yup.string().required('Destination name is required'),
    activities: Yup.string()
      .required('At least one activity is required')
      .test('valid-activities', 'Enter comma-separated activities', (value) => {
        return value.split(',').filter((a) => a.trim()).length > 0;
      }),
    date: Yup.date()
      .required('Date is required')
      .test(
        'is-within-trip-dates',
        'Destination date must be within the trip dates',
        function (value) {
          if (!trip) return false;
          const tripStart = new Date(trip.startDate);
          const tripEnd = new Date(trip.endDate);
          const inputDate = new Date(value);
          return inputDate >= tripStart && inputDate <= tripEnd;
        }
      ),
    budget: Yup.number()
      .required('Enter your budget')
      .positive('Budget must be positive')
      .test(
        'is-within-budget-limit',
        'Exceeding budget limit',
        function (value) {
          if (!trip?.destinations) return true;
          const currentDest = destinationId ? trip.destinations.find(d => d._id === destinationId) : null;
          const total = trip.destinations.reduce(
            (sum, dest) => sum + (dest._id === destinationId ? 0 : dest.budget),
            0
          );
          return (total + Number(value) - (currentDest?.budget || 0)) <= trip.budget;
        }
      ),
  }), [trip, destinationId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trip data for validation
        const tripResponse = await axios.get(`${BASE_URL}/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTrip(tripResponse.data);

        // Priority 1: Use context data if available
        if (editDestination) {
          setInitialValues({
            name: editDestination.name,
            activities: editDestination.activities,
            date: editDestination.date.split('T')[0], // Format for date input
            budget: editDestination.budget,
            others: editDestination.others,
          });
        }
        // Priority 2: Fetch from API if destinationId exists
        else if (destinationId) {
          const destResponse = await axios.get(
            `${BASE_URL}/api/trips/${tripId}/destinations/${destinationId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          setInitialValues({
            ...destResponse.data,
            activities: destResponse.data.activities.join(', '),
            date: destResponse.data.date.split('T')[0], // Format for date input
          });
        }
      } catch (error) {
        console.error('Failed to load data:', error.response?.data?.message);
        setSubmitError('Failed to load destination data');
      }
    };

    fetchData();
  }, [tripId, destinationId, editDestination]);

  useEffect(() => {
    return () => setEditDestination(null);
  }, [setEditDestination]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitError('');
      const payload = {
        ...values,
        activities: values.activities.split(',').map(a => a.trim()).filter(a => a),
      };

      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };

      if (destinationId) {
        await axios.put(
          `${BASE_URL}/api/destinations/${tripId}/${destinationId}`,
          payload,
          config
        );
      } else {
        await axios.post(
          `${BASE_URL}/api/trips/${tripId}/destinations`,
          payload,
          config
        );
      }

      navigate(`/trips/${tripId}`);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to save destination');
    } finally {
      setSubmitting(false);
    }
  };

  if (!trip) return <div className="p-6">Loading trip data...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-6 text-green-800">
    {destinationId ? 'Edit Destination' : 'Add New Destination'}
  </h2>

  {submitError && (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
      {submitError}
    </div>
  )}

  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}
    enableReinitialize
  >
    {({ isSubmitting, touched, errors }) => (
      <Form className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Destination Name
          </label>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500 mr-2" />
            <Field
              name="name"
              type="text"
              className={`block w-full px-3 py-2 border rounded-md ${
                touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
          </div>
          <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Activities Field */}
        <div>
          <label htmlFor="activities" className="block text-sm font-medium text-gray-700 mb-1">
            Activities (comma-separated)
          </label>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClipboardList} className="text-green-500 mr-2" />
            <Field
              name="activities"
              type="text"
              className={`block w-full px-3 py-2 border rounded-md ${
                touched.activities && errors.activities ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
          </div>
          <ErrorMessage name="activities" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Date Field */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Visit Date
          </label>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 mr-2" />
            <Field
              name="date"
              type="date"
              className={`block w-full px-3 py-2 border rounded-md ${
                touched.date && errors.date ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
          </div>
          <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Budget Field */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget (₹)
          </label>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="text-green-500 mr-2" />
            <Field
              name="budget"
              type="number"
              className={`block w-full px-3 py-2 border rounded-md ${
                touched.budget && errors.budget ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
          </div>
          <ErrorMessage name="budget" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Others Field */}
        <div>
          <label htmlFor="others" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faStickyNote} className="text-green-500 mr-2" />
            <Field
              name="others"
              type="text"
              className={`block w-full px-3 py-2 border rounded-md ${
                touched.others && errors.others ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              placeholder="Optional"
            />
          </div>
          <ErrorMessage name="others" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
        >
          {destinationId ? 'Update Destination' : 'Add Destination'}
        </button>
      </Form>
    )}
  </Formik>
</div>
  );
};

export default DestinationForm;